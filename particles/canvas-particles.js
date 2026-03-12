const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({ width, height }) => {

  const particles = [];
  for (let i = 0; i < 1; i++) {
    particles.push(new Particle(width * 0.5, height * 0.5));
  }
  
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    })
  };
};

class Particle {
  constructor(x, y, radius = 10) {
    this.radius = radius;

    // position
    this.x = x;
    this.y = y;

    // initial position
    this.ix = x;
    this.iy = y;

    // acceleration
    this.ax = 0;
    this.ay = 0;

    // velocity
    this.vx = 4;
    this.vy = -15;
  }

  update() {
    this.ax += 0.00025;
    this.ay += 0.05;
    
    this.vx += this.ax;
    this.vy += this.ay;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'black';

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    
    context.restore();
  }
}

canvasSketch(sketch, settings);
