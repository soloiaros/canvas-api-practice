import canvasSketch from 'canvas-sketch';
import { degToRad } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random'

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 16,
};

const sketch = ({ width, height }) => {

  let rectNum;
  rectNum = 20;
  let rects = [];
  for (let i = 0; i < rectNum; i++) {
    rects.push(createRectObject(-200, -40, width + 200, height + 40 ));
  }

  const moveDistance = 5;
  const moveAngle = -30;
  const moveOffsetX = Math.cos(degToRad(moveAngle)) * moveDistance;
  const moveOffsetY = Math.sin(degToRad(moveAngle)) * moveDistance;

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'blue';
    context.fillStyle = 'blue';

    if (frame % 2 == 0) {
      let updatedRects = [];
      for (let rect of rects) {
        rect.x -= moveOffsetX;
        rect.y -= moveOffsetY;
        if (!(rect.x + rect.rx < 0 || rect.y + rect.ry > height)) {
          updatedRects.push(rect);
        } else {
          let spawnMode = random.pick(['h', 'v']);
          let widthStart = spawnMode === 'h' ? 0 : width;
          let heightFinish = spawnMode === 'v' ?  height : -100;
          updatedRects.push(createRectObject(widthStart, -250, width + 100, heightFinish));
        }
      }
      rects = updatedRects;

    }
    for (let rect of rects) {
      context.save();
      context.translate(rect.x, rect.y);
      drawSkewedRect({ context, w: rect.w, h: rect.h, rx: rect.rx, ry: rect.ry, degrees: rect.degrees });
      if (rect.style === 'fill') {context.fill()} else {context.stroke()};
      context.restore();
    }
    
  };
};

function createRectObject(xStart, yStart, xFinish, yFinish) {
  let x, y, w, h, rx, ry, degrees, angle, style;
  w = random.range(200, 600);
  h = random.range(40, 200);
  x = random.range(xStart, xFinish);
  y = random.range(yStart, yFinish);
  degrees = -30;
  angle = degToRad(degrees);
  rx = Math.cos(angle) * w;
  ry = Math.sin(angle) * w;
  style = Math.random() > 0.7 ? 'fill' : 'stroke';
  return { x, y, rx, ry, w, h, degrees, style };
}

function drawSkewedRect({ context, w, h, rx, ry }) {
  
  context.save();
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.restore();
}

canvasSketch(sketch, settings);
