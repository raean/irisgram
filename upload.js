// Upload screen global variables:
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new window.AudioContext();
var source;
var screen = 1;
var uploadDiv;
var buf;

// Irisgram screen global variables:
var song;
var fft;
var spectrumA;
var a = 0;
var fr = 60;
var layer;
var rValue;
var gValue;
var bValue;

window.onblur = function () {
    if (song != null) {
        if (song.isPlaying()) {
            song.pause();
            document.getElementById("audioButton").innerText = "play";
        }
    }
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    layer = createGraphics(windowWidth, windowHeight);

    // Colour selection sliders:
    rValue = document.getElementById('rSlider');
    gValue = document.getElementById('gSlider');
    bValue = document.getElementById('bSlider');

    rValue.value = Math.floor(random(255));
    gValue.value = Math.floor(random(255));
    bValue.value = Math.floor(random(255));
}

function preload() {
    //?
}

function averageOfArray(arr) {
    const sum = arr.reduce((acc, curr) => acc + curr, 0);
    const average = sum / arr.length;
    return average;
}

function uploadScreen() {
    // Title
    background(0);
    fill(255);
    translate(0, -100);
    textSize(30);
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    text('welcome to irisgram', width / 2, height / 2);

    // Upload button
    input = document.getElementById("mp3-input");
    input.addEventListener("change", uploadMP3, false);
}

function colourSelectionScreen() {
    // HTML elements
    uploadDiv = document.getElementById('uploadControl');
    uploadDiv.style.display = 'none';

    colourControl = document.getElementById('colourControl');
    colourControl.hidden = false;

    // Title
    push();
    background(0);
    fill(255);
    stroke(0);
    translate(0, -150);
    textSize(30);
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    text('select your irisgram colours:', width / 2, height / 2);
    pop();

    // Iris
    push();
    translate(width / 2 - 100, height / 2 );
    fill(rValue.value, gValue.value, bValue.value);
    ellipse(0, 0, 128, 128);
    fill(255);
    strokeWeight(2);
    ellipse(0, 0, 32, 32);
    noFill();
    stroke(255);
    ellipse(0, 0, 134, 134);
    pop();

    translate(0, 100)
    strokeWeight(0.5);
    textSize(10);
    textFont('Courier New');
    textAlign(CENTER, CENTER);
    text('*fullscreen recommended before clicking start', width / 2, height / 2);

}

function irisgramScreen() {
    background(0);

    layer.noFill();

    spectrumA = fft.analyze();
    var spectrumB = spectrumA.reverse();
    if (song.isPlaying()) {
        push() //?

        noFill();
        stroke('red');
        translate(windowWidth / 2, windowHeight / 2);
        beginShape(); //?
        for (let i = 0; i < spectrumB.length; i++) {
            var amp = spectrumB[i];
            var x = map(amp, 0, 128, -3, 3)
            var y = map(i, 0, spectrumB.length, 40, 256);

            vertex(x, y);
        }
        endShape();

        pop()
    }

    push()
    translate(width / 2, height / 2); // Puts it in the middle.
    rotate(radians(a)); // Rotates the canvas by amount a. The reason it's amount a is so that every second has a spot in the circle.

    layer.push();
    layer.translate(width / 2, height / 2); // Puts it in the middle.
    layer.rotate(radians(-a));

    for (let i = 0; i < spectrumB.length; i++) { // for every frequency in the spectrum at that second t.
        layer.strokeWeight(0.01 * spectrumB[i]); // We add stroke weighting, such that the degree of intensity for that frequency will be either bold if the amplitude is high or faint/transparent if the amplitude is low.
        layer.stroke(rValue.value, gValue.value, bValue.value, spectrumB[i] / 50); // Colour of the stroke.
        layer.point(0, i / 4, 0, i / 4); // For that frequency i, draw a line (that's actually a point) with a certain stroke depending on it's amplitude.
    }
    layer.pop();
    image(layer, -width / 2, -height / 2);
    pop()

    if (song.isPlaying()) {
        a += b
    };
}

function draw() {
    if (screen == 1) {
        uploadScreen();
    } else if (screen == 2) {
        clear();
        colourSelectionScreen();
    } else {
        clear();
        irisgramScreen();
    }
}

function clickUploadButton() {
    console.log("Upload button clicked.");
    input = document.getElementById("mp3-input");
    input.click();
}

function uploadMP3() {
    console.log("I'm in the upload function");
    const fileList = this.files;
    const file = fileList[0];
    console.log(file);
    song = loadSound(file, () => loadedSound());
    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
}

function loadedSound() {
    a = 360 / (song.duration() * fr);
    b = a;
    frameRate(fr);
    layer.clear();
    screen = 2;
}

function startIrisgram() {
    console.log("Start irisgram");
    colourControl = document.getElementById("colourControl");
    colourControl.hidden = true;
    irisgramControlDiv = document.getElementById("irisgramControl");
    irisgramControlDiv.hidden = false;
    screen = 3;
    song.play();
}

function resetIrisgram() {
    location.reload();
}

function toggleSound() {
    if (song.isPlaying()) {
        song.pause();
        console.log('Playing');
        document.getElementById("audioButton").innerText = "play";
    } else {
        song.play();
        console.log('Paused');
        document.getElementById("audioButton").innerText = "pause";
    }
}

function saveIrisgram() {
    saveCanvas('Your Irisgram', 'png');
}

function windowResized() {
    // if (screen != 3) {
        resizeCanvas(windowWidth, windowHeight);
    // }
}

