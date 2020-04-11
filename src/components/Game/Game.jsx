import React, { useCallback, useRef, useState } from "react";
import styles from "./Game.module.scss";
import { useSnake } from "../../hooks/SnakeHook";
import InfoBox from "../InfoBox/InfoBox";
import Controls from "../Controls/Controls";
import Score from "../Score/Score";
import EndScreen from "../EndScreen/EndScreen";
import bgMusic from "../../assets/audios/_general/bgMusic.mp3";
import { useEffect } from "react";
import Intro from "../Intro/Intro";
import { sleep } from "../../utils/Utils";
import Countdown from "../Countdown/Countdown";
import { getRand } from "../../utils/Utils";

const SNAKE_SIZE = 7;

function Game() {
  const canvas = useRef(null);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [started, setStarted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  const eatCallback = useCallback(() => {
    setStarted(true);
    setShowInfoBox(true);
  }, []);

  const {
    current,
    score,
    listenJoystickClick,
    setPaused,
    nextPolitician,
    finished,
    paused,
    maw,
  } = useSnake({ canvas, eatCallback });

  const { canvasWidth, canvasHeight, bottomHeight } = screenConfig();

  useEffect(() => {
    if (paused && current?.audios && started && !finished) {
      const says = new Audio();
      says.src = require(`../../assets/audios/${current.id}/${getRand(
        current.audios
      )}`);
      says.play();
    }
    /* eslint-disable-next-line */
  }, [current, score, started, finished]);

  useEffect(() => {
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.volume = "0.3";
    bgMusic.loop = true;
  }, []);

  return (
    <div>
      {showIntro && <Intro onClose={onClose} />}

      {finished && <EndScreen maw={maw}  score={score} />}

      <audio id="bgMusic">
        <source loop src={bgMusic} type="audio/mpeg" />
      </audio>

      <section className={styles.main} style={{ width: canvasWidth }}>
        <section className={styles.game}>
          <canvas
            className={styles.canvas}
            ref={canvas}
            width={canvasWidth}
            height={canvasHeight}
          />

          {showCountdown && <Countdown />}
        </section>

        <section
          id="bottom"
          className={styles.bottom}
          styles={{ height: bottomHeight }}
        >
          <Score score={score} />
          
          <button onClick={() => setPaused(!paused)}>
            <i className="fas fa-pause" />
          </button>
          
          <Controls clickHandler={listenJoystickClick} />
        </section>
      </section>

      {showInfoBox && current && (
        <InfoBox data={current}continueCallback={onCloseInfoBox} />
      )}
    </div>
  );

  function screenConfig() {
    const heightAvailable = 5 * (window.innerHeight / 7);
    const canvasWidth =
      window.innerWidth > 700
        ? 500
        : window.innerWidth - (window.innerWidth % SNAKE_SIZE) - SNAKE_SIZE * 4;
    const canvasHeight =
      heightAvailable - (heightAvailable % SNAKE_SIZE) - SNAKE_SIZE * 4;
    const bottomHeight = (2 * window.innerHeight) / 7;

    return { canvasWidth, canvasHeight, bottomHeight };
  }

  function onClose() {
    setShowIntro(false);
    setPaused(false);
    playBg();
  }

  function playBg() {
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.play();
  }

  async function onCloseInfoBox() {
    setShowInfoBox(false);
    setShowCountdown(true);
    await sleep(0.9 * 1000);
    setShowCountdown(false);
    nextPolitician();
  }
}

export default Game;
