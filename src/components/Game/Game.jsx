import React, { useEffect } from 'react';
import styles from './Game.module.scss';
import { useSnake } from '../../hooks/snake';
import InfoBox from '../InfoBox/InfoBox';

function Game({ setScore }) {

  const canvas = React.useRef(null);

  const [showInfoBox, setShowInfoBox] = React.useState(false);
  
  const eatCallback = React.useCallback((newScore) => {
    setScore(newScore);
    setShowInfoBox(true);
  }, [setScore]);

  const canvasWidth = window.innerWidth-50;
  const canvasHeight = 2 * (window.innerHeight/ 3);

  const { current } = useSnake({ canvas, eatCallback });

  return (
    <section className={styles.main}>
      <canvas className={styles.canvas} ref={canvas} width={canvasWidth} height={canvasHeight}></canvas>

      {showInfoBox && current && (
        <InfoBox data={current} />
      )}
    </section>
  );

 
}

export default Game;
