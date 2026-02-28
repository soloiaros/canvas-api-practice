export const settings = {
  dimensions: [ 1080, 1080 ]
};

export const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  };
};
