import React from 'react';
import styles from './Game.module.scss';
import { useSnake } from '../../hooks/snake';

function Game({ setScore }) {

  const canvas = React.useRef(null);

  const [showInfoBox,] = React.useState(false);

  // const eatCallback = React.useCallback((newScore) => {
  //   setScore(newScore);
  //   setShowInfoBox(true);
  // }, [setScore]);

  const snakeHook = useSnake({ canvas });
  
  return (
    <section className={styles.main}>
      <canvas className={styles.canvas} ref={canvas} width="600" height="600"></canvas>

      {showInfoBox && (
        <div>
          <h1>Info box</h1>
        </div>
      )}
    </section>
  );

 
}

export default Game;
