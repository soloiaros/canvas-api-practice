import canvasSketch from 'canvas-sketch';
import './styles.css';
import math, { mapRange } from 'canvas-sketch-util/math';
import eases from 'eases';
import random from 'canvas-sketch-util/random';

const settings = {
  dimensions: [ 2480, 2480 ],
  animate: true,
};

let audioContext, audioData, analyzerNode;
let manager;

let font = new FontFace("Montserrat", "url(./fonts/Montserrat-Thin.woff2)");

const sketch = () => {
  const numCircles = 6;
  const initLineWidth = 100;
  const initRadius = 120;
  const linePadding = 25;
  const fontSizeBig = 160;
  const fontSizeMed = 80;
  const fontSizeSmall = 40;
  const fontMargin = 50;

  const bins = [];
  const rotationOffsets = [];
  for (let i = 0; i < numCircles; i++) {
    bins.push(random.rangeFloor(4, 16));
  }
  for (let i = 0; i < numCircles; i++) {
    rotationOffsets.push(random.range(Math.PI * -0.25, Math.PI * 0.25));
  }
  
  return ({ context, width, height }) => {
    context.fillStyle = '#31394C'
    context.fillRect(0, 0, width, height);
    
    if (!analyzerNode) return;
    analyzerNode.getFloatFrequencyData(audioData);
    
    context.save();
    
    context.translate(width * 0.5, height * 0.5);
    context.beginPath();
    context.moveTo(-width * 0.48, -width * 0.48);
    context.lineTo(width * 0.48, -width * 0.48);
    context.lineTo(width * 0.48, width * 0.48);
    context.lineTo(-width * 0.48, width * 0.48);
    context.closePath();
    context.clip();
    
    context.save();
    context.translate(-width * 0.5, -height * 0.5);
    context.fillStyle = '#EDEDED'
    context.fillRect(0, 0, width, height);
    context.restore();

    context.save();
    context.translate(width * -0.48 + fontMargin, height * -0.48 + fontSizeBig / 2 + fontMargin)
    context.font = `bold ${fontSizeBig}px Helvetica`;
    context.fillStyle = '#31394C';
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    context.fillText("Yaroslav", 0, 0);
    context.fillText("Solovev", 0, fontSizeBig);
    context.font = `bold ${fontSizeSmall}px Montserrat`;
    context.fillText("inspired by", 0, fontSizeBig * 2);
    context.font = `bold ${fontSizeMed}px Montserrat`;
    context.fillText("Joseph", 0, fontSizeBig * 2 + 120);
    context.fillText("Müller-Brockmann", 0, fontSizeBig * 2 + 120 + fontSizeMed);
    context.restore()
    
    context.strokeStyle = '#31394C';
    context.fillStyle = '#31394C';
    context.beginPath();
    context.arc(0, 0, initRadius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    let cradius = initRadius;

    for (let i = 0; i < numCircles; i++) {
      context.save();
      context.rotate(Math.PI / numCircles * i + Math.PI * 1);
      const bin = bins[i];
      const mapped = math.mapRange(audioData[bin], analyzerNode.minDecibels, analyzerNode.maxDecibels, 0, 1);
      const phi = Math.PI * 1.5 * mapped;

      const t = i / (numCircles - 1);
      const lineWidth = eases.quadIn(t) * initLineWidth + initLineWidth;
      context.beginPath();
      context.arc(0, 0, cradius + lineWidth * 0.5 + linePadding * 0.5, 0, phi);

      context.lineWidth = lineWidth;
      context.stroke();
      cradius = cradius + lineWidth + linePadding;
      context.restore();
    }

    context.restore();
  }
}

// const sketch = () => {
//   const bins = [5, 13, 37];

//   return ({ context, width, height }) => {
//     context.fillStyle = '#333';
//     context.fillRect(0, 0, width, height);

//     if (!audioContext) return;
//     analyzerNode.getFloatFrequencyData(audioData);

    
//     context.save();
//     context.translate(width * 0.5, height * 0.5);

//     for (let i = 0; i < bins.length; i++) {
//       const frequencyMapped = math.mapRange(audioData[bins[i]], analyzerNode.minDecibels, analyzerNode.maxDecibels, 0, 1, true);
//       context.beginPath();
//       context.arc(0, 0, frequencyMapped * (300 - 50 * i), 0, 360);
//       context.lineWidth = 10;
//       context.strokeStyle = 'white';
//       context.stroke();
//       context.closePath();
//     }

//     context.restore();
//   };
// };

const setPageEventListeners = () => {
  const audio = document.querySelector('audio');

  window.addEventListener('mouseup', () => {

    if (!audioContext) setupAudio();

    document.startViewTransition(() => {
      const pauseScreen = document.querySelector('.pause-screen');

      if (pauseScreen.computedStyleMap().get('display').value === 'none') {
        pauseScreen.style.display = 'block';
        audio.pause();
        manager.pause();
      }
      else {
        pauseScreen.style.display = 'none';
        audio.play();
        manager.play();
      }
    })
  })
}

const setupAudio = () => {
  const audio = document.querySelector('audio');
  
  audioContext = new AudioContext();

  const sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyzerNode = audioContext.createAnalyser();
  analyzerNode.fftSize = 512;
  analyzerNode.smoothingTimeConstant = 0.95;
  sourceNode.connect(analyzerNode);

  audioData = new Float32Array(analyzerNode.frequencyBinCount);
}

const start = async () => {
  setPageEventListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
}

console.log(font)
font.load().then(() => {
  console.log(font)
  document.fonts.add(font);
  start();
})