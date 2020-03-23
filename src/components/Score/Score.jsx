import React from 'react';
import styles from './Score.module.scss';

function Score({ score = 0 }) {
  return (
    <div className={styles.score}>
      <h3 className={styles.title}>Pontuação</h3>
      <div className={styles.value}>
        <span className={styles.monetary}>R$</span>
        <span>{formatMonetary(score)}</span>
      </div>
    </div>
  );
}

const formatMonetary = (val) => {
  return (val/100).toFixed(2);
}

export default Score;
