var a = 0;
var fr = 60;
var song;
var fft;
var spectrumA;
var aud;
var screen = 0;


function preload() {
  song = loadSound('Genesis.mp3');
  playing = false;
  song.onended(() => {playing = false; document.getElementById('audioButton').innerText = 'Play'; a = a; fr = 60});
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  layer = createGraphics(windowWidth, windowHeight);
  button = createButton("Play");
  button.mousePressed(toggleAudio);

  fft = new p5.FFT();
  
  a = 360 / (song.duration() * fr);
  b = a;

  frameRate(fr);
  layer.clear();

}

function draw() {
  if (screen == 0) {
    uploadScreen();
  } else {
    irisgramScreen();
  }
}

function changeScreen() {
  if (screen == 0) {
    screen = 1;
  } else  {
    screen = 0;
  }
}

function uploadScreen() {
  background(100);
}

function irisgramScreen() {
  background(0);

  layer.noFill();

  spectrumA = fft.analyze();
  var spectrumB = spectrumA.reverse(); // uses the preloaded song.
  // var spectrumB = micFFTAnalysis.reverse(); // uses the input mic analysis.
  // spectrumB/splice(0, 200); // if you want only certain fqs.

  push() //?

    noFill();
    stroke('red');
    translate(windowWidth/2, windowHeight/2);
    beginShape(); //?
    for (let i = 0 ; i < spectrumB.length ; i++) {
      var amp = spectrumB[i];
      var x = map(amp, 0, 128, -3, 3)
      var y = map(i, 0, spectrumB.length, 40, 256);

      vertex(x, y);
    }
    endShape();

  pop()

  push()
    translate(width/2, height/2); // Puts it in the middle.
    rotate(radians(a)); // Rotates the canvas by amount a. The reason it's amount a is so that every second has a spot in the circle.

    layer.push();
      layer.translate(width/2, height/2); // Puts it in the middle.
      layer.rotate(radians(-a)); 

      for (let i = 0; i < spectrumB.length ; i++) { // for every frequency in the spectrum at that second t.
        layer.strokeWeight(0.01 * spectrumB[i]); // We add stroke weighting, such that the degree of intensity for that frequency will be either bold if the amplitude is high or faint/transparent if the amplitude is low.
        layer.stroke(45 + spectrumB[i], 255, 255, spectrumB[i]/60); // Colour of the stroke.
        layer.point(0, i/4, 0, i/4); // For that frequency i, draw a line (that's actually a point) with a certain stroke depending on it's amplitude.
      }
    layer.pop();
  image(layer, -width/2, -height/2);
  pop()

  if(song.isPlaying()) { 
    a += b
  };
  
}

function toggleAudio() {
  if (song.isPlaying()) {
    song.pause();
    console.log('Playing');
    button.html = 'Pause';
  } else {
    song.play();
    console.log('Paused');
    button.html = 'Play';
  }
}