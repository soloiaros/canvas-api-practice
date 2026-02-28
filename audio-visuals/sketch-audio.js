export const settings = {
  dimensions: [ 1080, 1080 ]
};

export const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(500, 500, 400, 0, 360);
    context.stroke();
  };
};
