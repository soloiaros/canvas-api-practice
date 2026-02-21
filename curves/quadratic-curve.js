const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {

  const points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 350, y: 300, control: true }),
    new Point({ x: 880, y: 540 }),
  ]

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(200, 540);
    context.quadraticCurveTo(350, 300, 880, 540);
    context.stroke();
  };
};

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
    context.restore();
  }
}

canvasSketch(sketch, settings);
