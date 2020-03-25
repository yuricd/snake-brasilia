import React from "react";
import styles from "./Controls.module.scss";
import { Direction } from '../../hooks/snake'; 

function Controls({ clickHandler }) {
  return (
    <div className={styles.controls}>
      <div className={[styles.item, styles.up].join(" ")}>
        <button onClick={() => handleClick(Direction.UP)}>
          <i className="fas fa-caret-square-up" />
        </button>
      </div>
      <div className={[styles.item, styles.right].join(" ")}>
        <button onClick={() => handleClick(Direction.RIGHT)}>
          <i className="fas fa-caret-square-right"></i>
        </button>
      </div>
      <div className={[styles.item, styles.down].join(" ")}>
        <button onClick={() => handleClick(Direction.DOWN)}>
          <i className="fas fa-caret-square-down"></i>
        </button>
      </div>
      <div className={[styles.item, styles.left].join(" ")}>
        <button onClick={() => handleClick(Direction.LEFT)}>
          <i className="fas fa-caret-square-left"></i>
        </button>
      </div>
    </div>
  );

  function handleClick(direction) {
    clickHandler(direction);
  }
}

export default Controls;
