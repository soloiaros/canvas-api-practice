import canvasSketch from 'canvas-sketch';
import colormap from 'colormap';
import './styles.css';
import math from 'canvas-sketch-util/math';

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const colorPalette = colormap({
  colormap: 'bone',
  nshades: 64,
  format: 'hex',
  alpha: .3,
});

let audioContext, audioData, analyzerNode;
let manager;

const sketch = () => {
  const bins = [5, 13, 37];

  return ({ context, width, height }) => {
    context.fillStyle = '#333';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;
    analyzerNode.getFloatFrequencyData(audioData);

    
    context.save();
    context.translate(width * 0.5, height * 0.5);

    for (let i = 0; i < bins.length; i++) {
      const frequencyMapped = math.mapRange(audioData[bins[i]], analyzerNode.minDecibels, analyzerNode.maxDecibels, 0, 1, true);
      context.beginPath();
      context.arc(0, 0, frequencyMapped * (300 - 50 * i), 0, 360);
      context.lineWidth = 10;
      context.strokeStyle = 'white';
      context.stroke();
      context.closePath();
    }

    context.restore();
  };
};

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
  analyzerNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyzerNode);

  audioData = new Float32Array(analyzerNode.frequencyBinCount);
}

const start = async () => {
  setPageEventListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
}

start();