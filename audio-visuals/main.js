import canvasSketch from 'canvas-sketch';
import { sketch, settings } from './sketch-audio.js';
import './styles.css'

const audio = document.querySelector('audio');
audio.autoplay = true;


const setPageEventListeners = () => {
  window.addEventListener('mouseup', () => {
    document.startViewTransition(() => {
      const pauseScreen = document.querySelector('.pause-screen');
      if (pauseScreen.computedStyleMap().get('display').value === 'none') {
        pauseScreen.style.display = 'block';
        audio.pause();
      }
      else {
        pauseScreen.style.display = 'none';
        audio.play();
      }
    })
  })
}

setPageEventListeners();
canvasSketch(sketch, settings);