const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let scaledCanvas, points, canvasObj;

const sketch = ({ canvas }) => {
  
  canvasObj = canvas;

  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 800, y: 800 }),
    new Point({ x: 880, y: 540 }),
    new Point({ x: 300, y: 220 }),
    new Point({ x: 900, y: 250 }),
  ]

  canvas.addEventListener('mousedown', onMouseDown);

  scaledCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'gray';
    context.beginPath();
    for (let i = 0; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();
    context.closePath();


    context.strokeStyle = 'black';
    context.lineWidth = '4';
    context.beginPath();
    for (let i = 0; i < points.length - 1; i++) {
      const currPoint = points[i];
      const nextPoint = points[i + 1];

      const mx = currPoint.x + (nextPoint.x - currPoint.x) * 0.5;
      const my = currPoint.y + (nextPoint.y - currPoint.y) * 0.5;

      if (i == 0) context.moveTo(mx, my);
      else context.quadraticCurveTo(points[i].x, points[i].y, mx, my);
    }
    context.stroke();

    points.forEach(point => {
      point.draw(context); 
    })
  };
};

let mouseClickAndMove = false;

const onMouseDown = (e) => {
  canvasObj.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = e.offsetX / scaledCanvas.offsetWidth * scaledCanvas.width;
  const y = e.offsetY / scaledCanvas.offsetHeight * scaledCanvas.height;

  let hit = false;
  points.forEach(point => {
    if (point.hitTest(x, y)) { point.isPressed = true; hit = true };
  });
  if (!hit) {
    points.push(new Point({ x, y }))
  }
}

const onMouseMove = (e) => {

  mouseClickAndMove = true;

  const x = e.offsetX / scaledCanvas.offsetWidth * scaledCanvas.width;
  const y = e.offsetY / scaledCanvas.offsetHeight * scaledCanvas.height;
  
  points.forEach(point => {
    if (point.isPressed) {
      point.x = x;
      point.y = y
    }
  })
}

const onMouseUp = () => {
  canvasObj.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  if (!mouseClickAndMove) {
    let updatedPoints = [];
    points.forEach(point => {
      if (!point.isPressed) updatedPoints.push(point);
    });
    points = updatedPoints;
  }

  points.forEach(point => {
    point.isPressed = false;
  });

  mouseClickAndMove = false
}

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.save()
    context.translate(this.x, this.y);
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fillStyle = this.control ? 'red' : 'black';
    context.fill();
    context.closePath();
    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx ** 2 + dy ** 2);
    return dd < 20;
  }
}

canvasSketch(sketch, settings);
