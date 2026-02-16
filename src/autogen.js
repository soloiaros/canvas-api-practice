import canvasSketch from 'canvas-sketch';

const settings = {
  dimensions: [ 1000, 1000 ],
  animate: true,
};

const sketch = () => {

  
  let x = 0;
  let y = 0;
  let xDelta = 5;
  let yDelta = 5;
  
  let houseWidth = 220;
  let houseHeight = 190;
  
  return (properties) => {
    const { width, height, context } = properties;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    xDelta = (x + xDelta + houseWidth > 1000 || x + xDelta < 0) ? -(xDelta / Math.abs(xDelta) * Math.ceil(Math.random() * 10)) : xDelta;
    yDelta = (y + yDelta + houseHeight > 1000 || y + yDelta < 0) ? -(yDelta / Math.abs(yDelta) * Math.ceil(Math.random() * 10)) : yDelta;
    x = x + xDelta;
    y = y + yDelta;

    context.fillStyle = 'black';

    context.lineWidth = 10;
    // Wall
    context.strokeRect(x + 25, y + 80, 150, 110);
    // Door
    context.fillRect(x + 80, y + 130, 40, 60);
    // Roof
    context.beginPath();
    context.moveTo(x, y + 80);
    context.lineTo(x + 100, y);
    context.lineTo(x + 200, y + 80);
    context.closePath();
    context.stroke();
  };
};

canvasSketch(sketch, settings);
