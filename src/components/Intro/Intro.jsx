import React from 'react';
import styles from './Intro.module.scss';
import Overlay from '../Overlay/Overlay';

function Intro({ onClose }) {

  return (
    <>
      <Overlay />
      <div className={styles.intro}>
        <h1>Snake vai a Brasília</h1>

        <section className={styles.highlight}>
          <p>Controles</p>
          <p>Desktop: use as setas  ⇦ ⇧ ⇨ ⇩ do teclado</p>
          <p>Mobile: toque a tela nas direções desejadas ou use o controle que estará na parte inferior</p>
        </section>

        <section>
          <p className={styles.middle}><i className="fas fa-volume-up" />Ative o som</p>
              
          <p>Coma todos os políticos que puder e boa sorte com a digestão</p>
        </section>

        <section>
          <button onClick={onClose}>Começar</button>
        </section>
      </div>
    </>
  );
}

export default Intro;
