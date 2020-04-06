import { useEffect, useReducer, useLayoutEffect, useCallback } from "react";
import snakeRight from "../assets/images/snake-head-right.png";
import snakeDown from "../assets/images/snake-head-down.png";
import snakeLeft from "../assets/images/snake-head-left.png";
import snakeUp from "../assets/images/snake-head-up.png";
import { data } from "../data/politicians";
import { shuffle } from "../utils/Shuffle";

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

export const useSnake = ({ canvas, eatCallback, controlClickHandler = () => console.log('pegou') }) => {
  let cpBody = [];

  for (let i = 2; i >= 0; i--) {
    cpBody.push({
      x: i,
      y: 10
    });
  }

  const init = {
    body: cpBody,
    direction: Direction.RIGHT,
    score: 0,
    snakeW: 7,
    snakeH: 7,
    polits: shuffle(data),
    paused: true,
    control: Direction.UP,
    finished: false,
  };

  const [state, setState] = useReducer(reducer, init);

  const listenKeyboard = useCallback(
    e => {
      if (e.keyCode === 37 && state.direction !== Direction.RIGHT) {
        setState({ direction: Direction.LEFT });
      } else if (e.keyCode === 38 && state.direction !== Direction.DOWN) {
        setState({ direction: Direction.UP });
      } else if (e.keyCode === 39 && state.direction !== Direction.LEFT) {
        setState({ direction: Direction.RIGHT });
      } else if (e.keyCode === 40 && state.direction !== Direction.UP) {
        setState({ direction: Direction.DOWN });
      }
    },
    [state.direction]
  );

  const listenClick = (direction) => {
    if (direction === Direction.LEFT && state.direction !== Direction.RIGHT) {
      setState({ direction: Direction.LEFT });
    } else if (direction === Direction.UP && state.direction !== Direction.DOWN) {
      setState({ direction: Direction.UP });
    } else if (direction === Direction.RIGHT && state.direction !== Direction.LEFT) {
      setState({ direction: Direction.RIGHT });
    } else if (direction === Direction.DOWN && state.direction !== Direction.UP) {
      setState({ direction: Direction.DOWN });
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", listenKeyboard);
    return () => {
      window.removeEventListener("keydown", listenKeyboard);
    };
  }, [listenKeyboard]);

  useLayoutEffect(() => {
    const interval = setInterval(() => {
      if (canvas && canvas.current && !state.paused) {
        const ctx = canvas.current.getContext("2d");
        const width = canvas.current.width;
        const height = canvas.current.height;
        draw(ctx, width, height);
      }
    }, 70);

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

  function drawSnake(ctx, x, y, head) {
    let headImg = new Image();

    if (head && state.direction === Direction.RIGHT) {
      headImg.src = snakeRight;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 2,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (head && state.direction === Direction.LEFT) {
      headImg.src = snakeLeft;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 24,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (head && state.direction === Direction.UP) {
      headImg.src = snakeUp;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 8,
        y * state.snakeH - 24,
        18,
        34
      );
    } else if (head && state.direction === Direction.DOWN) {
      headImg.src = snakeDown;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 3,
        y * state.snakeH - 2,
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

  function getPolit(width, height, politsList = state.polits) {
    return {
      data: politsList.length ? politsList[0] : data[0],
      pos: {
        x: Math.round(Math.random() * (width / state.snakeW)),
        y: Math.round(Math.random() * (height / state.snakeH))
      }
    };
  }

  function drawPolit(ctx, renderImg, x, y) {
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
      console.log("end");
    } else {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < state.body.length; i++) {
        let x = state.body[i].x;
        let y = state.body[i].y;
        drawSnake(ctx, x, y, i === 0);
      }
      
      let renderImg = new Image();
      renderImg.src = state.current.data.image;
      drawPolit(ctx, renderImg, state.current.pos.x, state.current.pos.y);

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

      if (
        snakeHeadX === state.current.pos.x &&
        snakeHeadY === state.current.pos.y
      ) {
        const sumScore = state.score + 1;
        setState({ paused: true, score: sumScore });
        eatCallback(sumScore);
      } else {
        state.body.pop();
      }

      let newHead = {
        x: snakeHeadX,
        y: snakeHeadY
      };

      setState({ body: [newHead].concat(state.body) });
    }
  }

  async function nextPolitician(width, height) {
    if (state.polits.length) {
      const [, ...rest] = state.polits;
      setState({ polits: rest });
      setState({ current: getPolit(width, height, rest) });
    } else {
      setState({ finished: true });
    }
  }

  function setPaused2False(getNextPolitician = true) {
    setState({ paused: false });

    if (getNextPolitician) {
      nextPolitician(state.width, state.height);
    }
  }

  function setDirection(direction) {
    setState({ direction });
  }

  return {
    current: state.current?.data,
    setDirection,
    listenClick,
    setPaused2False,
    nextPolitician,
    finished: state.finished,
    paused: state.paused,
  };
};
