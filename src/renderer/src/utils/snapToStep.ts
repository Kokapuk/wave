const snapToStep = (value: number, step: number) => {
  const decimals = `${step}`.split('.')[1]?.length ?? 0;

  return parseFloat((Math.round(value / step) * step).toFixed(decimals));
};

export default snapToStep;
