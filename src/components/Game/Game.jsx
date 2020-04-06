import React, { useState } from 'react';
import styles from './Game.module.scss';
import { useSnake } from '../../hooks/SnakeHook';
import InfoBox from '../InfoBox/InfoBox';
import Controls from '../Controls/Controls';
import Score from '../Score/Score';
import EndScreen from '../EndScreen/EndScreen';
import bgMusic from '../../assets/audios/_general/bgMusic.mp3';
import { useEffect } from 'react';
import Intro from '../Intro/Intro';

const SNAKE_SIZE = 7;

function Game() {

  const canvas = React.useRef(null);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  
  const eatCallback = React.useCallback((newScore) => {
    setScore(newScore);
    setShowInfoBox(true);
  }, [setScore]);

  const { current, listenClick, setPaused2False, finished, paused } = useSnake({ canvas, eatCallback });

  const heightAvailable = 2 * (window.innerHeight/ 3)
  const canvasWidth = window.innerWidth > 700 ? 500 : window.innerWidth - (window.innerWidth % SNAKE_SIZE) - (SNAKE_SIZE * 4);
  const canvasHeight = heightAvailable - (heightAvailable % SNAKE_SIZE) - (SNAKE_SIZE * 4);
  const bottomHeight = window.innerHeight / 3;

  useEffect(() => {
    if (paused && current?.audios) {
      const says = new Audio();
      says.src = require(`../../assets/audios/${current.id}/${getRandAudio(current.audios)}`);
      says.play();
    }
  }, [current, paused])

  useEffect(() => {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = "0.3";
    bgMusic.loop = true;
  }, []);

  return (
    <div>

      {showIntro && (
        <Intro onClose={onClose} />
      )}

      {finished && (
        <EndScreen score={score} />
      )}
      
      <audio id="bgMusic">
        <source loop src={bgMusic} type="audio/mpeg" />
      </audio> 

      <section className={styles.main} style={{ width: canvasWidth }}>
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
  );

  function onClose() {
    setShowIntro(false);
    setPaused2False(false);
    playBg();
  }

  function getRandAudio(audios) {
    const idx = Math.floor(Math.random() * (audios.length) );
    console.log(audios[idx])
    return audios[idx];
  }

  function playBg() {
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.play();
  }

  function onCloseInfoBox() {
    setShowInfoBox(false);
    setPaused2False();
  }
}

export default Game;
