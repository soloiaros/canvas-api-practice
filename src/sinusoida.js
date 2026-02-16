import canvasSketch from 'canvas-sketch';

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true,
  fps: 24,
  duration: 5,
};

document.body.style['display'] = 'grid';
document.body.style['justify-items'] = 'center';


const speedRange = document.createElement('input');
speedRange.type = 'range';
speedRange.id = 'speed';
speedRange.min = '1';
speedRange.max = '5';
speedRange.value = '1';
const speedLabel = document.createElement('label');
speedLabel.setAttribute('for', 'speed');
setSpeedLabel(speedLabel, speedRange.value);
document.body.appendChild(speedLabel);
document.body.appendChild(speedRange);

let speed = 1;
speedRange.addEventListener('input', () => {
  speed = Math.min(Math.max(speedRange.value, 1), 5);
  setSpeedLabel(speedLabel, speed);
});

function setSpeedLabel (label, speedValue) {
  label.textContent = `y = sin(${speedValue}x)`;
}

const sketch = (props) => {

  const { context, width, height } = props;
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'black';
  context.fillRect(0, height / 2 - 1, width, 2);

  
  return ({ canvas, context, playhead }) => {
    context.drawImage(canvas, -speed * 2, 0);
    context.beginPath();
    context.ellipse(width / 2, height / 2 + Math.sin(playhead * 2 * Math.PI) * height / 4, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
    context.fill();
  };
};

canvasSketch(sketch, settings);
