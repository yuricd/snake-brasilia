import React from "react";
import styles from "./Controls.module.scss";

function Controls() {
  return (
    <div className={styles.controls}>
      <div className={[styles.item, styles.up].join(" ")}>
        <button>
          <i className="fas fa-caret-square-up" />
        </button>
      </div>
      <div className={[styles.item, styles.right].join(" ")}>
        <button>
          <i className="fas fa-caret-square-right"></i>
        </button>
      </div>
      <div className={[styles.item, styles.down].join(" ")}>
        <button>
          <i className="fas fa-caret-square-down"></i>
        </button>
      </div>
      <div className={[styles.item, styles.left].join(" ")}>
        <button>
          <i className="fas fa-caret-square-left"></i>
        </button>
      </div>
    </div>
  );
}

export default Controls;
