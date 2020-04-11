export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getRand = (arr) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

export const copy2clipboard = (text) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
} 