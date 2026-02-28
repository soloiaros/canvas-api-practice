import canvasSketch from 'canvas-sketch';
import colormap from 'colormap';
import './styles.css';

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const colorPalette = colormap({
  colormap: 'plasma',
  nshades: 64,
  format: 'hex',
  alpha: .3,
});

let audioContext, audioData, analyzerNode;
let manager;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;
    analyzerNode.getFloatFrequencyData(audioData);
    const { avgFreq, minFreq, maxFreq } = getAudioProps(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.beginPath();
    context.arc(0, 0, Math.abs(avgFreq) * 2, 0, 360);
    context.lineWidth = 50;
    context.strokeStyle = colorPalette[Math.abs(Math.floor(avgFreq) % 64)];
    context.stroke();
    context.closePath();
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
  sourceNode.connect(analyzerNode);

  audioData = new Float32Array(analyzerNode.frequencyBinCount);
}

const getAudioProps = (data) => {
  const sum = data.reduce((curr, prev) => prev += curr, 0);
  const avg = sum / data.length;

  let min = 9999;
  let max = -9999;
  data.forEach((value) => {
    if (value > max) max = value;
    if (value < min) min = value;
  })

  return { avgFreq: avg, maxFreq: max, minFreq: min }
}

const start = async () => {
  setPageEventListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
}

start();