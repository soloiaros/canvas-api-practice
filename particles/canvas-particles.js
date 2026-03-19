import canvasSketch from 'canvas-sketch';
// import imgSourceURL from '../images/txt.png';

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const cursor = { x: -9999, y: -9999 }
let elCanvas;

const sketch = ({ width, height, canvas }) => {
  elCanvas = canvas;
  setEventListeners(canvas);

  const imgSourceCanvas = document.createElement('canvas');
  const imgSourceContext = imgSourceCanvas.getContext('2d');
  imgSourceCanvas.width = width;
  imgSourceCanvas.height = height;
  imgSourceContext.fillStyle = 'white';
  imgSourceContext.font = '256px sans-serif';
  imgSourceContext.textAlign = 'center';
  imgSourceContext.fillText("YUM", width * 0.5, height * 0.5);
  const imgSourceData = imgSourceContext.getImageData(0, 0, width, height).data;

  const numCircles = 150;
  const gapCircles = 4;
  const gapDots = 4;
  let dotRadius = 1;
  let circleRadius = 0;
  const fitRadius = dotRadius;
  const particles = [];

  for (let i = 0; i < numCircles; i++) {
    const circumference = Math.PI * 2 * circleRadius;
    const numDotsInCircle = i ? Math.floor(circumference / (fitRadius * 2 + gapDots)) : 1;

    for (let j = 0; j < numDotsInCircle; j++) {
      const theta = (Math.PI * 2 / numDotsInCircle) * j;
      const x = width * 0.5 + Math.cos(theta) * circleRadius;
      const y = height * 0.5 + Math.sin(theta) * circleRadius;

      const imageX = Math.floor(x);
      const imageY = Math.floor(y);
      const colorIndex = (imageY * width + imageX) * 4;
      const color = `rgb(${imgSourceData[colorIndex + 0]}, ${imgSourceData[colorIndex + 1]}, ${imgSourceData[colorIndex + 2]})`;

      if (color !== 'rgb(0, 0, 0)') particles.push(new Particle({ x, y, radius: dotRadius, color }));
    }

    circleRadius += fitRadius * 2 + gapCircles;
    dotRadius = (1 - i / numCircles) * fitRadius;
  }
  
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    // context.drawImage(imgSourceCanvas, 0, 0)

    particles.forEach((particle) => {
      particle.update();
      particle.draw(context);
    })
  };
};

class Particle {
  constructor({ x, y, radius = 10, color = 'black' }) {
    this.radius = radius;
    this.color = color;
    this.minReactDistance = 50;
    this.pushFactor = 0.04;
    this.pullFactor = 0.02;
    this.dampFactor = 0.92;

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
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    
    context.restore();
  }
}

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  })
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

const start = async () => {
  // imgSource = await loadImage(imgSourceURL);
  canvasSketch(sketch, settings);
}

start();