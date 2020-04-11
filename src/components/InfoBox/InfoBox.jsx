import React from 'react';
import styles from './InfoBox.module.scss';
import Overlay from '../Overlay/Overlay';

function InfoBox({ data, continueCallback }) {

  const { id, name, description, skills } = data;

  return (
    <div style={{ width: '100vw', overflowX: 'hidden' }}>
      <Overlay />
      <div className={styles.infoBox}>
        <header className={styles.header}>
          <figure>
            <img src={require(`../../assets/politicians/${id}.jpg`)} alt="Politician's ugly face" />
          </figure>

          <div className={styles.summary}>
            <h1>{name}</h1>
              {description.map((desc, idx) => <p key={idx}> {desc}</p>)}
          </div>
        </header>
        
        <section className={styles.skills}>
          <div className={styles.display}>
            <h3>Atributos</h3>
            {Object.keys(skills).map((skill, idx) => 
              <div className={styles.row} key={idx}>
                <span className={styles.skill}>
                  {skill}
                </span>
                <span className={styles.val}>
                  <div className={styles.bar} style={{ width: `${skills[skill] * 10}%`}}>
                    <div className={styles.fill}>{skills[skill]}</div>
                  </div>
                </span>
              </div>
            )}
          </div>
        </section>

        <section className={styles.bottom}>
          <span />
          <button className={styles.continue} onClick={continueCallback}>Continuar</button>
        </section>
      </div>
    </div>
  );
}

export default InfoBox;
