import React from 'react';
import snakeRight from '../assets/images/snake-head-right.png';
import snakeDown from '../assets/images/snake-head-down.png';
import snakeLeft from '../assets/images/snake-head-left.png';
import snakeUp from '../assets/images/snake-head-up.png';
import { data } from '../data/politicians';

function reducer(res, newElement) {
  return {
    ...res,
    ...newElement,
  }
}

export const useSnake = ({ canvas, eatCallback }) => {

  const init = {
    canvas: null,
    score: 20,
    width: canvas?.width,
    height: canvas?.height,
    ctx: canvas?.getContext('2d'),
    snakeW: 7,
    snakeH: 7,
    direction: 'right',
    body: [],
    polits: data,
    current: {},
    eatCallback,
    paused: false,
  };

  const [state, setState] = React.useReducer(reducer, init);

  console.log(state, data);

  function drawSnake(x, y, head) {
    let headImg = new Image();

    if (head && state.direction === 'right') {
      headImg.src = snakeRight;
      state.ctx.drawImage(headImg, x*state.snakeW-2, y*state.snakeH-8, 34, 18);
    } else if (head && state.direction === 'left') {
      headImg.src = snakeLeft;
      state.ctx.drawImage(headImg, x*state.snakeW-24, y*state.snakeH-8, 34, 18);
    } else if (head && state.direction === 'up') {
      headImg.src = snakeUp;
      state.ctx.drawImage(headImg, x*state.snakeW-8, y*state.snakeH-24, 18, 34);
    } else if (head && state.direction === 'down') {
      headImg.src = snakeDown;
      state.ctx.drawImage(headImg, x*state.snakeW-3, y*state.snakeH-2, 18, 34);
    } else {
      state.ctx.fillStyle = '#FFB800';
      state.ctx.fillRect(x*state.snakeW, y*state.snakeH, state.snakeW, state.snakeH);
    }
  }

  function checkCollision(x, y, array) {
    if (x < 0 || 
        y < 0 || 
        x >= (state.width)/state.snakeW || 
        y >= (state.height)/state.snakeH
      ) {
        alert('colidiu');
    }
    for (let i=1; i<array.length; i++) {
      if(x === array[i].x && y === array[i].y) {
        alert('colidiu');
      }
    }
    return false;
  }

  function getPolit() {
    return {
      data: state.polits[0],
      pos: {
        x: Math.round(Math.random()*(state.width/state.snakeW)),
        y: Math.round(Math.random()*(state.height/state.snakeH)),
      }
    }
  }

  function drawPolit(renderImg, x, y) {
    state.ctx.shadowOffsetX = 0;
    state.ctx.shadowOffsetY = 0;
    state.ctx.shadowBlur = 1;
    state.ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    state.ctx.drawImage(renderImg, x*state.snakeW-4, y*state.snakeH-4, state.snakeW+8, state.snakeH+8);
    state.ctx.shadowColor = 'rgba(255, 255, 255, 0)';
  }

  function draw() {
    if(!state.current.data) {
      console.log('end');
    } else if (state.paused) { 
      console.log('paused');
    } else {
      state.ctx.clearRect(0, 0, state.width, state.height);

      for (let i=0; i<state.body.length; i++) {
        let x = state.body[i].x;
        let y = state.body[i].y;
        state.drawSnake(x, y, i === 0);
      }

      let renderImg = new Image();
      renderImg.src = state.current.data.image;
      state.drawPolit(renderImg, state.current.pos.x, state.current.pos.y);

      let snakeHeadX = state.body[0].x;
      let snakeHeadY = state.body[0].y;
      
      state.checkCollision(snakeHeadX, snakeHeadY, state.body);

      if(state.direction === 'left') {
        snakeHeadX--;
      } else if(state.direction === 'up') {
        snakeHeadY--;
      } else if(state.direction === 'right') {
        snakeHeadX++;
      } else if(state.direction === 'down') {
        snakeHeadY++;
      }

      if (snakeHeadX === state.current.pos.x && snakeHeadY === state.current.pos.y) {
        state.polits.shift();
        state.current = state.getPolit();
        state.setScore(state.current.data.salary);
        state.eatCallback(state.score);
        state.paused = true;
      } else {
        state.body.pop();
      }

      let newHead = {
        x: snakeHeadX,
        y: snakeHeadY,
      }

      state.body.unshift(newHead);
    }
  }
  
  return {
    getPolit,
    setState,
    drawSnake,
    checkCollision,
    drawPolit,
    draw,
  }
}