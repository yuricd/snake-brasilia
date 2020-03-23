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

export const useSnake = ({ canvas }) => {
  let cpBody = [];
  for (let i = 19; i >= 0; i--) {
    cpBody.push({
      x: i,
      y: 10
    });
  }

  const init = {
    body: cpBody,
    direction: "right",
    score: 20,
    snakeW: 7,
    snakeH: 7,
    polits: data,
    paused: false,
  };

  const [state, setState] = React.useReducer(reducer, init);

  const getDirection = useCallback(
    e => {
      if (e.keyCode === 37 && state.direction !== "right") {
        setState({ direction: "left" });
      } else if (e.keyCode === 38 && state.direction !== "down") {
        setState({ direction: "up" });
      } else if (e.keyCode === 39 && state.direction !== "left") {
        setState({ direction: "right" });
      } else if (e.keyCode === 40 && state.direction !== "up") {
        setState({ direction: "down" });
      }
    },
    [state.direction]
  );

  useEffect(() => {
    window.addEventListener("keydown", getDirection);
    return () => {
      window.removeEventListener("keydown", getDirection);
    };
  }, [getDirection]);

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
    if (canvas && canvas.current) {
      const width = canvas.current.width;
      const height = canvas.current.height;
      
    setState({
      current: getPolit(width, height),
    });
  }

  }, []);

  function drawSnake(ctx, x, y, head) {
    let headImg = new Image();

    if (head && state.direction === "right") {
      console.log("1");
      headImg.src = snakeRight;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 2,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (head && state.direction === "left") {
      console.log("2");

      headImg.src = snakeLeft;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 24,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (head && state.direction === "up") {
      console.log("3");

      headImg.src = snakeUp;
      ctx.drawImage(
        headImg,
        x * state.snakeW - 8,
        y * state.snakeH - 24,
        18,
        34
      );
    } else if (head && state.direction === "down") {
      console.log("4");

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
      data: state.polits ? state.polits[0] : data[0],
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

      if (state.direction === "left") {
        snakeHeadX--;
      } else if (state.direction === "up") {
        snakeHeadY--;
      } else if (state.direction === "right") {
        snakeHeadX++;
      } else if (state.direction === "down") {
        snakeHeadY++;
      }

      if (
        snakeHeadX === state.current.pos.x &&
        snakeHeadY === state.current.pos.y
      ) {
        state.polits.shift();
        state.current = getPolit(width, height);
        state.setScore(state.current.data.salary);
        state.eatCallback(state.score);
        state.paused = true;
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

  return {
    getPolit,
    setState,
    drawSnake,
    checkCollision,
    drawPolit,
    draw
  };
};
