export const formatMonetary = (val, showUnity = false) => {
  return `${showUnity ? 'R$' : ''} ${(val/100).toFixed(2)}`;
}