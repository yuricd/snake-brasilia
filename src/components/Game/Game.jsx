import React, { useState } from 'react';
import styles from './Game.module.scss';
import { useSnake } from '../../hooks/snake';
import InfoBox from '../InfoBox/InfoBox';
import Controls from '../Controls/Controls';
import Score from '../Score/Score';
import EndScreen from '../EndScreen/EndScreen';

function Game() {

  const canvas = React.useRef(null);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [score, setScore] = React.useState(0);
  
  const eatCallback = React.useCallback((newScore) => {
    setScore(newScore);
    setShowInfoBox(true);
  }, [setScore]);

  const { current, listenClick, setPaused2False, finished } = useSnake({ canvas, eatCallback });

  const canvasWidth = window.innerWidth - 50;
  const canvasHeight = 2 * (window.innerHeight/ 3);
  const bottomHeight = window.innerHeight/ 3;

  return (
    <>
      {finished ? (
        <EndScreen score={score} />
      ) : (
        <div>
          <section className={styles.main}>
            <section className={styles.game}>
              <canvas className={styles.canvas} ref={canvas} width={canvasWidth} height={canvasHeight}></canvas>
            </section>

            <section id="bottom" className={styles.bottom} styles={ { height: bottomHeight } }>
              <Score score={score} />
              <Controls clickHandler={listenClick} />
            </section>  
          </section>

          {showInfoBox && current && (
            <InfoBox data={current} continueCallback={onCloseInfoBox} />
          )}
        </div>
      )}
    </>
  );
  

  function onCloseInfoBox() {
    setShowInfoBox(false);
    setPaused2False();
  }
}

export default Game;
