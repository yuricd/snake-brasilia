import React from "react";
import styles from "./EndScreen.module.scss";
import Overlay from "../Overlay/Overlay";

function EndScreen({ score }) {
  return (
    <>
      <Overlay />
      <div className={styles.endScreen}>
        <h1>Fim!</h1>
        <p>Você conseguiu comer {score} políticos.</p>
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
}

export default EndScreen;
