export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getRand = (arr) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}