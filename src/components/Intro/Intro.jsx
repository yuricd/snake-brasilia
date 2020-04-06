import React from 'react';
import styles from './Intro.module.scss';
import Overlay from '../Overlay/Overlay';

function Intro({ onClose }) {

  return (
    <>
      <Overlay />
      <div className={styles.intro}>
        <h1>Cobrinha vai à Brasília</h1>
        
        <section>
          <p>Coma todos os políticos que puder</p>
          <p>Boa sorte com a digestão</p>  
        </section>

        <section>
          <p><i className="fas fa-volume-up" /></p>
          <p>Deixe o som ativado para ouvir o que a nata política tem a dizer</p>
        </section>

        <section>
          <button onClick={onClose}>Começar</button>
        </section>
      </div>
    </>
  );
}

export default Intro;
