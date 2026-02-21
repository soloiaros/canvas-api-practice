const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let scaledCanvas, points;

const sketch = ({ canvas }) => {
  
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 800, y: 800, control: true }),
    new Point({ x: 880, y: 540 }),
  ]

  canvas.addEventListener('mousedown', onMouseDown);

  scaledCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    context.stroke();

    points.forEach(point => {
      point.draw(context); 
    })
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = e.offsetX / scaledCanvas.offsetWidth * scaledCanvas.width;
  const y = e.offsetY / scaledCanvas.offsetHeight * scaledCanvas.height;

  points.forEach(point => {
    if (point.hitTest(x, y)) { point.isPressed = true; }
  })
}

const onMouseMove = (e) => {

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
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  points.forEach(point => {
    point.isPressed = false;
  })
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
