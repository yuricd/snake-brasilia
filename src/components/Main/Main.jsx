import React from 'react';
import Score from '../Score/Score';
import Controls from '../Controls/Controls';
import Game from '../Game/Game';

import styles from './Main.module.scss';

function Main() {

  const [score, setScore] = React.useState(0);

  return (
    <div className={styles.main}>
      <section className={styles.game}>
        <Game setScore={setScore} />
      </section>

      <section id="bottom" className={styles.bottom}>
        <Score score={score} />
        <Controls />
      </section>
    </div>
  );
}

export default Main;
