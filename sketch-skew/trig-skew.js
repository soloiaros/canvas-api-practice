import canvasSketch from 'canvas-sketch';
import { degToRad } from 'canvas-sketch-util/math';
import random from 'canvas-sketch-util/random';
import { offsetHSL } from 'canvas-sketch-util/color'
import risoColors from 'riso-colors';

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  fps: 30,
};

const colorPalette = [];
for (let i = 0; i < 2; i++) {colorPalette.push(random.pick(risoColors))};
const bodyColor = random.pick(risoColors).hex;

const sketch = ({ width, height }) => {
  
  let rectNum;
  rectNum = 40;
  let rects = [];
  for (let i = 0; i < rectNum; i++) {
    rects.push(createRectObject(0, 0, width, height ));
  }

  const mask = {
    radius: width * 0.4,
    sides: 3,
    rotate: false,
    x: width * 0.5,
    y: height * 0.5,
  }

  const moveDistance = 5;
  const moveAngle = -30;
  const moveOffsetX = Math.cos(degToRad(moveAngle)) * moveDistance;
  const moveOffsetY = Math.sin(degToRad(moveAngle)) * moveDistance;

  return ({ context, width, height, frame }) => {
    context.fillStyle = bodyColor;
    context.fillRect(0, 0, width, height);
    
    context.save()

    context.translate(mask.x, mask.y);
    drawRegularPolygon({ context, radius: mask.radius, sides: mask.sides, rotate: mask.rotate });
    context.clip();

    context.translate(-mask.x, -mask.y);

    if (frame % 3 == 0) {
      let updatedRects = [];
      for (let rect of rects) {
        rect.x -= moveOffsetX;
        rect.y -= moveOffsetY;
        if (!(rect.x + rect.rx < 0 || rect.y + rect.ry > height)) {
          updatedRects.push(rect);
        } else {
          let spawnMode = random.pick(['h', 'v']);
          let widthStart = spawnMode === 'h' ? 0 : width;
          let heightFinish = spawnMode === 'v' ?  height : 0;
          updatedRects.push(createRectObject(widthStart, 0, width, heightFinish));
        }
      }
      rects = updatedRects;

    }
    for (let rect of rects) {
      context.save();
      context.translate(rect.x, rect.y);
      context.strokeStyle = rect.stroke;
      context.fillStyle = rect.fill;
      context.lineWidth = random.range(7, 10);
      context.globalCompositeOperation = rect.blend;
      
      drawSkewedRect({ context, w: rect.w, h: rect.h, rx: rect.rx, ry: rect.ry, degrees: rect.degrees });

      const darkerFill = offsetHSL(rect.fill, 0, 0, -20);
      
      context.shadowColor = darkerFill.hex;
      context.shadowOffsetX = -10;
      context.shadowOffsetY = -20;
      context.fill()
      
      context.shadowColor = null;
      context.stroke();
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();

      context.globalCompositeOperation = 'source-over';
      context.restore();
    }
    
    context.restore();
    
    // mask's outline
    context.save();

    context.translate(mask.x, mask.y);
    context.lineWidth = 25;
    context.globalCompositeOperation = 'color-burn';
    drawRegularPolygon({ context, radius: mask.radius - context.lineWidth, sides: mask.sides, rotate: mask.rotate })
    context.strokeStyle = colorPalette[0].hex;
    context.stroke();

    context.restore()
  };
};

function createRectObject(xStart, yStart, xFinish, yFinish) {
  let x, y, w, h, rx, ry, degrees, angle, fill, stroke, blend;
  w = random.range(600, 800);
  h = random.range(40, 200);
  x = random.range(xStart, xFinish);
  y = random.range(yStart, yFinish);
  degrees = -30;
  angle = degToRad(degrees);
  rx = Math.cos(angle) * w;
  ry = Math.sin(angle) * w;
  stroke = random.pick(colorPalette).hex;
  fill = Math.random() > 0.3 ? random.pick(colorPalette).hex : 'transparent';
  blend = Math.random() > 0.5 ? 'overlay' : 'source-over';
  return { x, y, rx, ry, w, h, degrees, stroke, fill, blend };
}

function drawSkewedRect({ context, w, h, rx, ry }) {
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
}

function drawRegularPolygon({ context, radius = 100, sides = 3, rotate = false }) {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  const initialAngle = rotate ? 0.5 * slice : 0;
  if (rotate) {
    context.moveTo(radius * Math.cos(initialAngle - Math.PI * 0.5), radius * Math.sin(initialAngle - Math.PI * 0.5))
  } else {
    context.moveTo(0, -radius);
  }
  for (let i = 1; i < sides; i++) {
    const theta = slice * i - Math.PI * 0.5;
    context.lineTo(radius * Math.cos(theta + initialAngle), radius * Math.sin(theta + initialAngle));
  }
  context.closePath();
}

canvasSketch(sketch, settings);
