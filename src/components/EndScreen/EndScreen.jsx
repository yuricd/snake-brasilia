import React from "react";
import styles from "./EndScreen.module.scss";
import Overlay from "../Overlay/Overlay";
import thinSnake from '../../assets/images/snake-fat-thin.svg';
import mediumSnake from '../../assets/images/snake-fat-medium.svg';
import largeSnake from '../../assets/images/snake-fat-large.svg';
import { data } from "../../data/politicians";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getRand, copy2clipboard } from "../../utils/Utils";
import { APP_URL } from "../../constants/Links";
import { useState } from "react";

function EndScreen({ score, maw }) {

  const [copiedMsg, setCopiedMsg] = useState(false);
  const player = new Audio();
  
  return (
    <>
      <Overlay />
      <div className={styles.endScreen}>
        <h1>Fim!</h1>

        <div className={styles.fatSnake}>
          <p>Você conseguiu comer {score} de {data.length} políticos.</p>
          {!!maw.length && (
            <>
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
            </>
          )}
        </div>

        <p>Desafie seus amigos a baterem sua pontuação.</p>

        <div className={styles.shareButtons}>
          <button>
            <a id="share" href={`https://www.facebook.com/sharer/sharer.php?u=${APP_URL}&quote=Eu comi ${score} de ${data.length} políticos! Você consegue comer mais do que eu?`} target="_blank" rel="noopener noreferrer">Facebook</a>
          </button>
          <CopyToClipboard text={APP_URL}
            onCopy={() => setCopiedMsg(true)}
          >
            <button>{!copiedMsg ? 'Copiar link' : 'Link copiado!'}</button>
          </CopyToClipboard>
        </div>

        <footer className={styles.bottom}>
          <button>
            <a href="/">Jogar novamente</a>
          </button>
          <p>
            <a href="https://github.com/yuricd/snake-brasilia" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github" /> Open-source, como sempre
            </a>
          </p>
        </footer>
      </div>
    </>
  );

  function playAudios() {
    const randPolit = getRand(maw);
    if(randPolit.audios) {
      const randAudio = getRand(randPolit.audios);
      const file = require(`../../assets/audios/${randPolit.id}/${randAudio}`);
      player.src = file;
      player.play();
    }
  }
}

export default EndScreen;
