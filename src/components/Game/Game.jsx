import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Game.module.scss";
import { useSnake } from "../../hooks/SnakeHook";
import InfoBox from "../InfoBox/InfoBox";
import Controls from "../Controls/Controls";
import Score from "../Score/Score";
import EndScreen from "../EndScreen/EndScreen";
import bgMusic from "../../assets/audios/_general/background-music.ogg";
import bgMaw from "../../assets/audios/_general/background-maw.ogg";
import Intro from "../Intro/Intro";
import { sleep } from "../../utils/Utils";
import Countdown from "../Countdown/Countdown";

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

  const listenKeyboard = useCallback(async e => {
    if ([32].includes(e.keyCode) && showInfoBox) {
      setShowInfoBox(false);
      setShowCountdown(true);
      await sleep(0.9 * 1000);
      setShowCountdown(false);
      nextPolitician();
    }
  }, [showInfoBox, nextPolitician]);

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
    const bgAudio = document.getElementById("bgAudio");
    if (finished) {
      bgAudio.src = bgMaw;
      bgAudio.volume = "0.3";
      bgAudio.play();
    } else {
      bgAudio.src = bgMusic;
      bgAudio.volume = "0.5";
    }
    bgAudio.loop = true;
  }, [finished]);

  useEffect(() => {
    window.addEventListener("keydown", listenKeyboard);

    return () => {
      window.removeEventListener("keydown", listenKeyboard);
    };
  }, [listenKeyboard]);

  return (
    <div>
      {showIntro && <Intro onClose={onClose} />}

      {finished && <EndScreen maw={maw} score={score} />}

      <audio id="bgAudio">
        <source loop type="audio/mpeg" />
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
          style={{ height: bottomHeight }}
        >
          <div className={styles.leSide}>
            <Score score={score} />

            <nav>
              <button
                className={styles.githubBtn}
                onClick={() => setPaused(!paused)}
              >
                <a href="https://github.com/yuricd/snake-brasilia" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github" />
                </a>
              </button>

              <button
                className={styles.pauseBtn}
                onClick={() => setPaused(!paused)}
              >
                <i className="fas fa-pause" />
              </button>
            </nav>
          </div>

          <Controls clickHandler={listenJoystickClick} />
        </section>
      </section>

      {showInfoBox && current && (
        <InfoBox data={current} continueCallback={onCloseInfoBox} />
      )}
    </div>
  );

  function getRand(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
  }

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
    const bgAudio = document.getElementById("bgAudio");
    bgAudio.play();
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
