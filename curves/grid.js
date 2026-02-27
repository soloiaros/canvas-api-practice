import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import math from 'canvas-sketch-util/math';
import colormap from 'colormap';

const settings = {
  dimensions: [ 1584, 396 ],
  animate: true,
};

let f = new FontFace("clip-text", "url(../fonts/CascadiaMono-Regular.woff2)");

const sketch = ({ width, height }) => {

  const numRows = 150;
  const numCols = 300;
  const gridWidth = width * 1.2;
  const gridHeight = height * 1.2;
  const cellWidth = gridWidth / numCols;
  const cellHeight = gridHeight / numRows;
  const gridMarginX = (width - gridWidth) * 0.5;
  const gridMarginY = (height - gridHeight) * 0.5;

  const colorPalette = colormap({
    colormap: 'inferno',
    nshades: 16,
    format: 'hex',
    alpha: .5,
  });

  // configuring noise
  const frequency = 0.002;
  const amplitude = 90;

  
  const points = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {

      let x = gridMarginX + c * cellWidth;
      let y = gridMarginY + r * cellHeight;

      const noise = random.noise2D(x, y, frequency, amplitude);
      x += noise;
      y += noise;

      const lineWidth = math.mapRange(noise, -amplitude, amplitude, 1, 5);
      const color = colorPalette[Math.floor(math.mapRange(noise, -amplitude, amplitude, 0, 16))];

      points.push(new Point({ x, y, lineWidth, color }))
    }
  }

  // defining clipping mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = width;
  maskCanvas.height = height;
  const maskContext = maskCanvas.getContext('2d');
  maskContext.save();
  maskContext.translate(width * 0.5, height * 0.5);
  maskContext.font = `700 ${height / 2}px clip-text`;
  maskContext.fillStyle = 'white';
  maskContext.textBaseline = 'middle';
  maskContext.textAlign = 'center';
  maskContext.fillText("Welcome", 0, 0);
  maskContext.restore();
  
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    context.save();
    context.translate(cellWidth * 0.5, cellHeight * 0.5);

    points.forEach(point => {
      const noise = random.noise2D(point.initX + frame * 3, point.initY + frame, frequency, amplitude + 100 * Math.sin(Math.PI * 2 * (frame % 120) / 120));
      point.x = point.initX + noise;
      point.y = point.initY + noise;
    })


    //drawing points
    points.forEach(point => {
      point.draw(context);
    })
    
    //drawing lines
    // let lastX, lastY;
    // for (let r = 0; r < numRows; r++) {
    //   for (let c = 0; c < numCols - 1; c++) {
    //     context.beginPath();

    //     const currPoint = points[r * numCols + c + 0];
    //     const nextPoint = points[r * numCols + c + 1];
    //     const mx = currPoint.x + (nextPoint.x - currPoint.x) * 0.5;
    //     const my = currPoint.y + (nextPoint.y - currPoint.y) * 5;

    //     if (!(c === 0)) context.moveTo(lastX, lastY);
    //     context.quadraticCurveTo(currPoint.x, currPoint.y, mx, my);
    //     [lastX, lastY] = [mx + c / numCols * 150, my + r / numRows * 200];
        
    //     context.lineWidth = currPoint.lineWidth;
    //     context.strokeStyle = currPoint.color;
    //     context.stroke();
    //     context.closePath();
    //   }
    // }
    context.restore();

    // rendering the masking canvas
    context.globalCompositeOperation = 'destination-in';
    context.drawImage(maskCanvas, 0, 0);
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
  };
};


class Point {
  constructor({ x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.initX = x;
    this.initY = y;
    this.lineWidth = lineWidth;
    this.color = color;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0, 0, this.lineWidth, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
  }
}

f.load().then(() => {
  document.fonts.add(f);
  console.log(f)
  canvasSketch(sketch, settings);
})
