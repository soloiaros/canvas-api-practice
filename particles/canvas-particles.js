const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const cursor = { x: -9999, y: -9999 }
let elCanvas;

const sketch = ({ width, height, canvas }) => {
  elCanvas = canvas;
  setEventListeners(canvas);

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
    this.minReactDistance = 100;
    this.pushFactor = 0.02;
    this.pullFactor = 0.02;
    this.dampFactor = 0.95;

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
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    let deltaX, deltaY, deltaHyp, cursorProx;

    // pulling force
    deltaX = this.ix - this.x;
    deltaY = this.iy - this.y;

    this.ax = deltaX * this.pullFactor;
    this.ay = deltaY * this.pullFactor;
    
    // pushing force
    deltaX = this.x - cursor.x;
    deltaY = this.y - cursor.y;
    deltaHyp = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    cursorProx = this.minReactDistance - deltaHyp;
    
    if (deltaHyp <= this.minReactDistance) {
      this.ax += (deltaX / deltaHyp) * cursorProx * this.pushFactor;
      this.ay += (deltaY / deltaHyp) * cursorProx * this.pushFactor;
    }
    
    // updating position
    this.vx += this.ax;
    this.vy += this.ay;
    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

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

const setEventListeners = (canvas) => {
  canvas.addEventListener('mousedown', onMouseDown);

  function onMouseDown(e) {
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    onMouseMove(e);
  }
  
  function onMouseMove(e) {
    const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
    const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

    cursor.x = x;
    cursor.y = y;
  }
  
  function onMouseUp() {
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);

    cursor.x = -9999;
    cursor.y = -9999;
  }
}

canvasSketch(sketch, settings);
