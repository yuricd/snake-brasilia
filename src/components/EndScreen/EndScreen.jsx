import React from "react";
import styles from "./EndScreen.module.scss";
import Overlay from "../Overlay/Overlay";
import thinSnake from '../../assets/images/snake-fat-thin.png';
import mediumSnake from '../../assets/images/snake-fat-medium.png';
import largeSnake from '../../assets/images/snake-fat-large.png';

import { getRand } from "../../utils/Utils";

function EndScreen({ score, maw }) {

  console.log(maw);
  const player = new Audio();

  return (
    <>
      <Overlay />
      <div className={styles.endScreen}>
        <h1>Fim!</h1>

        <div className={styles.fatSnake}>
          <p>Você conseguiu comer {score} políticos.</p>
          <p>Clique para ouvir o som da sua barriga:</p>
          <figure>
            {maw.length < 5 ? (
              <img src={thinSnake} alt="Snake de bucho cheio" onClick={playAudios} />
            ) : (maw.length >= 5 && maw.length < 20) ? (
              <img src={mediumSnake} alt="Snake de bucho cheio" onClick={playAudios} />
            ) : (
              <img src={largeSnake} alt="Snake de bucho cheio" onClick={playAudios} />
            )}
          </figure>
        </div>

        <p>Desafie seus amigos a baterem sua pontuação.</p>

        <div className={styles.shareButtons}>
          <button>Facebook</button>
          <button>Copiar link</button>
        </div>

        <footer className={styles.bottom}>
          <button>Jogar novamente</button>
          <p>
            <i className="fab fa-github" /> Open-source, como sempre
          </p>
        </footer>
      </div>
    </>
  );

  function playAudios() {
    const randPolit = getRand(maw);
    const randAudio = getRand(randPolit.audios);
    const file = require(`../../assets/audios/${randPolit.id}/${randAudio}`);
    player.src = file;
    player.play();
  }
}

export default EndScreen;
