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
        console.log("resetou1");
      } else if (e.keyCode === 38 && state.direction !== "down") {
        console.log("resetou2");
        setState({ direction: "up" });
      } else if (e.keyCode === 39 && state.direction !== "left") {
        console.log("resetou3");
        setState({ direction: "right" });
      } else if (e.keyCode === 40 && state.direction !== "up") {
        console.log("resetou4");
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
        setState({
          width: canvas.current.width,
          height: canvas.current.height,
          ctx: canvas.current.getContext("2d"),
          current: getPolit(),
        });

        draw(ctx, width, height);
      }
    }, 70);

    return () => clearInterval(interval);
  });

  function drawSnake(x, y, head) {
    let headImg = new Image();

    if (head && state.direction === "right") {
      console.log("1");
      headImg.src = snakeRight;
      state.ctx.drawImage(
        headImg,
        x * state.snakeW - 2,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (head && state.direction === "left") {
      console.log("2");

      headImg.src = snakeLeft;
      state.ctx.drawImage(
        headImg,
        x * state.snakeW - 24,
        y * state.snakeH - 8,
        34,
        18
      );
    } else if (head && state.direction === "up") {
      console.log("3");

      headImg.src = snakeUp;
      state.ctx.drawImage(
        headImg,
        x * state.snakeW - 8,
        y * state.snakeH - 24,
        18,
        34
      );
    } else if (head && state.direction === "down") {
      console.log("4");

      headImg.src = snakeDown;
      state.ctx.drawImage(
        headImg,
        x * state.snakeW - 3,
        y * state.snakeH - 2,
        18,
        34
      );
    } else {
      state.ctx.fillStyle = "#FFB800";
      state.ctx.fillRect(
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
      alert("colidiu");
    }
    // for (let i=1; i<array.length; i++) {
    //   if(x === array[i].x && y === array[i].y) {
    //     alert('colidiu2');
    //   }
    // }
    return false;
  }

  function getPolit() {
    return {
      data: state.polits ? state.polits[0] : data[0],
      pos: {
        x: Math.round(Math.random() * (state.width / state.snakeW)),
        y: Math.round(Math.random() * (state.height / state.snakeH))
      }
    };
  }

  function drawPolit(renderImg, x, y) {
    state.ctx.shadowOffsetX = 0;
    state.ctx.shadowOffsetY = 0;
    state.ctx.shadowBlur = 1;
    state.ctx.shadowColor = "rgba(255, 255, 255, 1)";
    state.ctx.drawImage(
      renderImg,
      x * state.snakeW - 4,
      y * state.snakeH - 4,
      state.snakeW + 8,
      state.snakeH + 8
    );
    state.ctx.shadowColor = "rgba(255, 255, 255, 0)";
  }

  function draw() {
    if (!state.current?.data) {
      console.log("end");
    } else if (state.paused) {
      console.log("paused");
    } else {
      state.ctx.clearRect(0, 0, state.width, state.height);

      for (let i = 0; i < state.body.length; i++) {
        let x = state.body[i].x;
        let y = state.body[i].y;
        drawSnake(x, y, i === 0);
      }

      let renderImg = new Image();
      renderImg.src = state.current.data.image;
      drawPolit(renderImg, state.current.pos.x, state.current.pos.y);

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
        state.current = getPolit();
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
