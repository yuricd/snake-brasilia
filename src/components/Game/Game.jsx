import React from 'react';
import styles from './Game.module.scss';
import { useSnake } from '../../hooks/snake';

function Game({ setScore }) {

  const canvasRef = React.useRef(null);

  const [showInfoBox, setShowInfoBox] = React.useState(false);

  const eatCallback = React.useCallback((newScore) => {
    setScore(newScore);
    setShowInfoBox(true);
  }, [setScore]);

  const snakeHook = useSnake(canvasRef, eatCallback);

  const getDirection = React.useCallback((e) => {
    if (e.keyCode === 37 && snakeHook.direction !== 'right') {
      snakeHook.setState({ direction: 'left' });
    } else if (e.keyCode === 38 && snakeHook.direction !== 'down') {
      snakeHook.setState({ direction: 'up' });
    } else if (e.keyCode === 39 && snakeHook.direction !== 'left') {
      snakeHook.setState({ direction: 'right' });
    } else if (e.keyCode === 40 && snakeHook.direction !== 'up') {
      snakeHook.setState({ direction: 'up' });
    }
  }, [snakeHook]);

  const callback = React.useCallback(() => {
    snakeHook.draw();
  }, [snakeHook]);
  
  React.useEffect(() => {
    document.addEventListener('keydown', getDirection);
  
    setInterval(() => callback(), 70);
  }, []);

  React.useEffect(() => {
    snakeHook.setState({ canvas: canvasRef.current })
  }, [canvasRef])

  return (
    <section className={styles.main}>
      <canvas className={styles.canvas} ref={canvasRef} width="600" height="600"></canvas>

      {showInfoBox && (
        <div>
          <h1>Info box</h1>
        </div>
      )}
    </section>
  );

 
}

export default Game;
