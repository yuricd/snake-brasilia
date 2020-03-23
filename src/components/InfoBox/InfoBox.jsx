import React from 'react';
import styles from './InfoBox.module.scss';

function InfoBox({ data }) {

  const { name, image, description, skills, salary } = data;

  return (
    <div className={styles.infoBox}>
      <header className={styles.header}>
        <figure>
          <img src={image} />
        </figure>

        <div className={styles.summary}>
          <h1>{name}</h1>
          <h2>{description}</h2>
        </div>
      </header>
      
      <section className={styles.skills}>
        <table>
          {Object.keys(skills).map(skill => 
            <tr>
              <td>{skill}</td>
              <td>{skills[skill]}</td>
            </tr>
          )}
        </table>
      </section>

      <section className={styles.bottom}>
        <span>Salário: {salary}</span>
        <button>Continuar</button>
      </section>
    </div>
  );
}

export default InfoBox;
