import { useEffect, useReducer, useLayoutEffect, useCallback } from "react";
import snakeRight from "../assets/images/snake-head-right.svg";
import snakeDown from "../assets/images/snake-head-down.svg";
import snakeLeft from "../assets/images/snake-head-left.svg";
import snakeUp from "../assets/images/snake-head-up.svg";
import { data } from "../data/politicians";
import { shuffle } from "../utils/Shuffle";

/**
 * AJUSTAR VOLUMES
 */

function reducer(res, newElement) {
  return {
    ...res,
    ...newElement
  };
}

export const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2, 
  RIGHT: 3,
}

export const useSnake = ({ canvas, eatCallback }) => {

  const initiY = 10; 

  const init = {
    body: new Array(3).fill(0).map((_, idx) => ({ x: idx, y: initiY })).reverse(),
    direction: Direction.RIGHT,
    score: 0,
    snakeW: 7,
    snakeH: 7,
    polits: shuffle(data),
    paused: true,
    control: Direction.UP,
    finished: false,
    speed: 70,
    maw: [],
  };

  const [state, setState] = useReducer(reducer, init);

  const listenKeyboard = useCallback(
    e => {
      if ([37,65].includes(e.keyCode) && state.direction !== Direction.RIGHT) {
        setState({ direction: Direction.LEFT });
      } else if ([38,87].includes(e.keyCode) && state.direction !== Direction.DOWN) {
        setState({ direction: Direction.UP });
      } else if ([39, 68].includes(e.keyCode) && state.direction !== Direction.LEFT) {
        setState({ direction: Direction.RIGHT });
      } else if ([40, 83].includes(e.keyCode) && state.direction !== Direction.UP) {
        setState({ direction: Direction.DOWN });
      } else if ([80].includes(e.keyCode)) {
        setState({ paused: !state.paused });
      }
    },
    [state.direction, state.paused]
  );

  const listenJoystickClick = (direction) => {
    if (direction === Direction.LEFT && state.direction !== Direction.RIGHT) {
      setState({ direction: Direction.LEFT });
    } else if (direction === Direction.UP && state.direction !== Direction.DOWN) {
      setState({ direction: Direction.UP });
    } else if (direction === Direction.RIGHT && state.direction !== Direction.LEFT) {
      setState({ direction: Direction.RIGHT });
    } else if (direction === Direction.DOWN && state.direction !== Direction.UP) {
      setState({ direction: Direction.DOWN });
    }
  };

  const listenScreenTouch = useCallback(e => {
    const { body, snakeW } = state;
    const head = body[0];
    const { offsetX, offsetY } = e;
    const [relX, relY] = [offsetX / snakeW, offsetY / snakeW];

    if (body && !state.paused) {
      if (state.direction === Direction.RIGHT || state.direction === Direction.LEFT) {
        if (relY < head.y) {
          setState({ direction: Direction.UP });
        } else { 
          setState({ direction: Direction.DOWN });
        }
      }

      if (state.direction === Direction.UP || state.direction === Direction.DOWN) {
        if (relX < head.x) {
          setState({ direction: Direction.LEFT });
        } else { 
          setState({ direction: Direction.RIGHT });
        }
      }
    }
  }, 
    /* eslint-disable-next-line */
    [state.direction, state.body]
  );

  useEffect(() => {
    const canvasCurr = canvas.current;
    window.addEventListener("keydown", listenKeyboard);
    canvasCurr.addEventListener("click", listenScreenTouch);

    return () => {
      window.removeEventListener("keydown", listenKeyboard);
      canvasCurr.removeEventListener("click", listenScreenTouch);
    };
    /* eslint-disable-next-line */
  }, [listenKeyboard, listenScreenTouch, state.paused]);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      if (canvas && canvas.current && !state.paused) {
        const ctx = canvas.current.getContext("2d");
        const width = canvas.current.width;
        const height = canvas.current.height;
        draw(ctx, width, height);
      }
    }, state.speed);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (canvas?.current) {
      const width = canvas.current.width;
      const height = canvas.current.height;
      
      setState({
        width,
        height,
        current: getPolit(width, height),
      });
    }
    /* eslint-disable-next-line */
  }, []);

  function drawSnake(ctx, x, y, isHead) {
    let headImg = new Image();

    if (isHead && state.direction === Direction.RIGHT) {
      headImg.src = snakeRight;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 4,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (isHead && state.direction === Direction.LEFT) {
      headImg.src = snakeLeft;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 24,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (isHead && state.direction === Direction.UP) {
      headImg.src = snakeUp;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 8,
        y * state.snakeH - 24,
        18,
        34
      );
    } else if (isHead && state.direction === Direction.DOWN) {
      headImg.src = snakeDown;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 3,
        y * state.snakeH - 3,
        18,
        34
      );
    } else {
      ctx.fillStyle = "#FFB800";
      ctx.fillRect(
        x * state.snakeW,
        y * state.snakeH,
        state.snakeW,
        state.snakeH
      );
    }
  }

  function checkCollision(x, y, array) {
    if (
      x < 0 ||
      y < 0 ||
      x >= state.width / state.snakeW ||
      y >= state.height / state.snakeH
    ) {
      setState({ finished: true, paused: true });
    }
    for (let i=1; i<array.length; i++) {
      if(x === array[i].x && y === array[i].y) {
        setState({ finished: true, paused: true });
      }
    }
    return false;
  }

  function checkProximity(snakeHead, pos) {
    const [headX, headY] = snakeHead;
    const { x, y } = pos;
    if (headX === x && headY === y) {
      return 0;
    } else {
      const maxVal = Math.max(x - headX, y - headY);
      return maxVal > 0 ? maxVal : 1  ;
    }
  }

  function getPolit(width, height, politsList = state.polits) {
    return {
      data: politsList[0],
      pos: {
        x: Math.round(Math.random() * (((width + state.snakeW) - 3 * state.snakeW) / state.snakeW)),
        y: Math.round(Math.random() * (((height + state.snakeH) - 3 * state.snakeH) / state.snakeH))
      }
    };
  }

  function drawPolit(ctx, current) {
    const { pos, data } = current;
    const { x,y  } = pos;

    let renderImg = new Image();
    renderImg.src = require(`../assets/politicians/${data.id}.jpg`);
    
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 1;
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.drawImage(
      renderImg,
      x * state.snakeW - 1,
      y * state.snakeH - 1,
      state.snakeW + 2,
      state.snakeH + 2
    );
    ctx.shadowColor = "rgba(255, 255, 255, 0)";
  }

  async function draw(ctx, width, height) {
    if (!state.current?.data) {
      setState({ finished: true });
    } else {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < state.body.length; i++) {
        let x = state.body[i].x;
        let y = state.body[i].y;
        drawSnake(ctx, x, y, i === 0);
      }
      
      drawPolit(ctx, state.current);

      let snakeHeadX = state.body[0].x;
      let snakeHeadY = state.body[0].y;

      checkCollision(snakeHeadX, snakeHeadY, state.body);

      if (state.direction === Direction.LEFT) {
        snakeHeadX--;
      } else if (state.direction === Direction.UP) {
        snakeHeadY--;
      } else if (state.direction === Direction.RIGHT) {
        snakeHeadX++;
      } else if (state.direction === Direction.DOWN) {
        snakeHeadY++;
      }

      const proximity = checkProximity([snakeHeadX, snakeHeadY], state.current.pos);

      if (proximity === 0) {
        const sumScore = state.score + 1;
        setState({ maw: state.maw.concat(state.current.data), paused: true, score: sumScore, speed: state.speed-1 });
        eatCallback();
      } else {
        state.body.pop();
      }

      const newHead = {
        x: snakeHeadX,
        y: snakeHeadY
      };

      setState({ body: [newHead].concat(state.body) });
    }
  }

  async function getNextPolitician(width, height) {
    if (state.polits.length) {
      const [, ...rest] = state.polits;
      setState({ polits: rest });
      setState({ current: getPolit(width, height, rest) });
    } else {
      setState({ finished: true });
    }
  }

  function setPaused(paused) {
    setState({ paused })
  }


  function nextPolitician() {
    setState({ paused: false });

    getNextPolitician(state.width, state.height);
    
  }

  return {
    current: state.current?.data,
    listenJoystickClick,
    setPaused,
    finished: state.finished,
    paused: state.paused,
    score: state.score,
    nextPolitician,
    maw: state.maw,
  };
};
