export const wait = (t: number) => new Promise((ok) => setTimeout(ok, t));

export const randomBoolean = () => Math.random() < 0.5;

export const randomElement = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

export const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
