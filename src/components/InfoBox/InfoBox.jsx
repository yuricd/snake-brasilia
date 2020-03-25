import React from 'react';
import styles from './InfoBox.module.scss';
import { formatMonetary } from '../../utils/MonetaryUtils';

function InfoBox({ data, continueCallback }) {

  const { name, image, description, skills, salary } = data;

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.infoBox}>
        <header className={styles.header}>
          <figure>
            <img src={image} alt="Politician's ugly face" />
          </figure>

          <div className={styles.summary}>
            <h1>{name}</h1>
              {description.map((desc, idx) => <p key={idx}> {desc}</p>)}
          </div>
        </header>
        
        <section className={styles.skills}>
          <div className={styles.display}>
            {Object.keys(skills).map((skill, idx) => 
              <div className={styles.row} key={idx}>
                <span className={styles.skill}>
                  {skill}
                </span>
                <span className={styles.val}>
                  <div className={styles.bar} style={{ width: `${skills[skill] * 100}%`}}>
                    {skills[skill] * 10} / 10
                  </div>
                </span>
              </div>
            )}
          </div>
        </section>

        <section className={styles.bottom}>
          <span>Salário: {formatMonetary(salary, true)}</span>
          <button className={styles.continue} onClick={continueCallback}>Continuar</button>
        </section>
      </div>
    </>
  );
}

export default InfoBox;
