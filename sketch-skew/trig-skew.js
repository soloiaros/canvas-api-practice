import canvasSketch from 'canvas-sketch';
import { degToRad } from 'canvas-sketch-util/math';

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  duration: 5,
  fps: 16,
};

const sketch = () => {

  let x, y, w, h, degrees;
  degrees = 0;

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    w = width * 0.6;
    h = height * 0.1;
    x = width * 0.5;
    y = height * 0.5;
    if (frame % 2 === 0) {
      degrees = (degrees += 3) % 360;
    }
    
  context.strokeStyle = 'blue';
  context.fillStyle = 'blue';
  context.save();
  context.translate(x, y);
  drawSkewedRect({ context, w, h, degrees });
  if (90 <= degrees  && degrees <= 270) {context.fill()} else {context.stroke()};
  context.restore();
    
  };
};

function drawSkewedRect({ context, w = 600, h = 200, degrees = 45 }) {
  const angle = degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;
  
  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.restore();
}

canvasSketch(sketch, settings);
