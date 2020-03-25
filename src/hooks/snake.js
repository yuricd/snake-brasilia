import React, { useEffect, useLayoutEffect, useCallback } from "react";
import snakeRight from "../assets/images/snake-head-right.png";
import snakeDown from "../assets/images/snake-head-down.png";
import snakeLeft from "../assets/images/snake-head-left.png";
import snakeUp from "../assets/images/snake-head-up.png";
import { data } from "../data/politicians";

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
    polits: data,
    paused: false,
    control: Direction.UP,
    finished: false,
  };

  const [state, setState] = React.useReducer(reducer, init);

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
      if (canvas && canvas.current) {
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
      console.log("colidiu");
    }
    // for (let i=1; i<array.length; i++) {
    //   if(x === array[i].x && y === array[i].y) {
    //     alert('colidiu2');
    //   }
    // }
    return false;
  }

  function getPolit(width, height) {
    return {
      data: state.polits.length ? state.polits[0] : data[0],
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
      x * state.snakeW - 4,
      y * state.snakeH - 4,
      state.snakeW + 8,
      state.snakeH + 8
    );
    ctx.shadowColor = "rgba(255, 255, 255, 0)";
  }

  function draw(ctx, width, height) {
    if (!state.current?.data) {
      console.log("end");
    } else if (state.paused) {
      console.log("paused");
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
        const sumScore = state.score + state.current.data.salary;
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

  function nextPolitician(width, height) {
    if (state.polits.length) {
      setState({ polits: state.polits.shift() });
      setState({ current: getPolit(width, height) });
    } else {
      setState({ finished: true });
    }
  }
 
  function setPaused2False() {
    setState({ paused: false });
    nextPolitician(state.width, state.height);
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
  };
};
