import React from 'react';
import styles from './Score.module.scss';

function Score({ score = 0 }) {
  return (
    <div className={styles.score}>
      <h3 className={styles.title}>Pontuação</h3>
      <div className={styles.value}>
        <span>{score}</span>
      </div>
    </div>
  );
}

export default Score;
