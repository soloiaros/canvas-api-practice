import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({ width, height }) => {

  const numRows = 8;
  const numCols = 12;
  const gridWidth = width * 0.8;
  const gridHeight = height * 0.8;
  const cellWidth = gridWidth / numCols;
  const cellHeight = gridHeight / numRows;
  const gridMarginX = (width - gridWidth) * 0.5;
  const gridMarginY = (height - gridHeight) * 0.5;
  // configuring noise
    const frequency = 0.02;
    const amplitude = 45;
    
    const points = [];
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let x = gridMarginX + c * cellWidth;
        let y = gridMarginY + r * cellHeight;
        const noise = random.noise2D(x, y, frequency, amplitude);
        x += noise;
        y += noise;
      points.push(new Point({ x, y }))
    }
  }


  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    context.save();
    context.translate(cellWidth * 0.5, cellHeight * 0.5);
    // drawing dots
    // for (let point of points) {
    //   point.draw(context);
    // }
    
    //drawing lines
    context.strokeStyle = 'red';
    for (let r = 0; r < numRows; r++) {
      context.beginPath();
      for (let c = 0; c < numCols - 1; c++) {
        const currPoint = points[r * numCols + c + 0];
        const nextPoint = points[r * numCols + c + 1];
        const mx = currPoint.x + (nextPoint.x - currPoint.x) * 0.5;
        const my = currPoint.y + (nextPoint.y - currPoint.y) * 0.5;
        if (c === 0) context.moveTo(currPoint.x, currPoint.y);
        else if (c === numCols - 2) context.quadraticCurveTo(currPoint.x, currPoint.y, nextPoint.x, nextPoint.y);
        context.quadraticCurveTo(currPoint.x, currPoint.y, mx, my);
      }
      context.stroke();
      context.closePath();
    }
    for (let c = 0; c < numCols - 1; c++) {
      context.beginPath();
      for (let r = 0; r < numRows; r++) {
        const currPoint = points[(r + 0) * numCols + (c + 0)];
        const nextPointX = points[(r + 0) * numCols + (c + 1)];
        const mx = currPoint.x + (nextPointX.x - currPoint.x) * 0.5;
        const my = currPoint.y + (nextPointX.y - currPoint.y) * 0.5;
        if (r === 0 && c !== 0) context.moveTo(mx, my);
        else context.lineTo(currPoint.x, currPoint.y);
      }
      context.stroke();
      context.closePath();
    }
    // drawing the last vertical line
    context.beginPath();
    const c = numCols - 1;
    for (let r = 0; r < numRows; r++) {
      const currPoint = points[r * numCols + c];
      context.lineTo(currPoint.x, currPoint.y)
    }
    context.stroke();
    context.closePath();
    context.restore();
  };
};


class Point {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
    context.restore();
  }
}

canvasSketch(sketch, settings);
