import React, { useState } from 'react';
import styles from './Game.module.scss';
import { useSnake } from '../../hooks/snake';
import InfoBox from '../InfoBox/InfoBox';
import { Direction } from '../../hooks/snake';
import Controls from '../Controls/Controls';
import Score from '../Score/Score';

function Game() {

  const canvas = React.useRef(null);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [score, setScore] = React.useState(0);
  
  const eatCallback = React.useCallback((newScore) => {
    setScore(newScore);
    setShowInfoBox(true);
  }, [setScore]);

  const { current, setDirection, listenClick } = useSnake({ canvas, eatCallback });

  const canvasWidth = window.innerWidth-50;
  const canvasHeight = 2 * (window.innerHeight/ 3);
  const bottomHeight = window.innerHeight/ 3;

  return (
    <>
      <section className={styles.main}>
        <section className={styles.game}>
          <canvas className={styles.canvas} ref={canvas} width={canvasWidth} height={canvasHeight}></canvas>
          <button onClick={() => setDirection(Direction.DOWN)}>Botão</button>
        </section>

        <section id="bottom" className={styles.bottom} styles={ { height: bottomHeight } }>
          <Score score={score} />
          <Controls clickHandler={listenClick} />
        </section>  
      </section>

      {showInfoBox && current && (
        <InfoBox data={current} />
      )}

    </>
  );

 
}

export default Game;
