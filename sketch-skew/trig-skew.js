import canvasSketch from 'canvas-sketch';
import { degToRad } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random'

const settings = {
  dimensions: [ 1080, 1080 ],
};

const sketch = ({ width, height }) => {

  let x, y, w, h, degrees, rectNum, rects;
  rectNum = 20;
  rects = [];
  for (let i = 0; i < rectNum; i++) {
    w = random.range(200, 600);
    h = random.range(40, 200);
    x = random.range(0, width);
    y = random.range(0, height);
    degrees = random.pick([-30, 150]);
    rects.push({ x, y, w, h, degrees })
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    
  context.strokeStyle = 'blue';
  context.fillStyle = 'blue';
  for (let { x, y, w, h, degrees } of rects) {
    context.save();
    context.translate(x, y);
    drawSkewedRect({ context, w, h, degrees });
    console.log(x, y)
    if (90 <= degrees  && degrees <= 270) {context.fill()} else {context.stroke()};
    context.restore();
  }
    
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
