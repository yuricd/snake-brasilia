/**
 * Fisher–Yates Shuffle Algorithm 
 * */ 

export const shuffle = (arr) => {
  let currIdx = arr.length; 
  let randIdx;
  let tmpValue;

  while (0 !== currIdx) {

    randIdx = Math.floor(Math.random() * currIdx);
    currIdx -= 1;

    tmpValue = arr[currIdx];
    arr[currIdx] = arr[randIdx];
    arr[randIdx] = tmpValue;
  }

  return arr;
}
