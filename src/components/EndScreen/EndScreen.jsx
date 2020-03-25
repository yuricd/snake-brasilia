import React from 'react';
import styles from './EndScreen.module.scss';
import { formatMonetary } from '../../utils/MonetaryUtils';

function EndScreen({ score }) {

  return (
    <div className={styles.endScreen}>
      <h1>Acabou!</h1>
      <p>Você conseguiu {formatMonetary(score, true)}.</p>

      <div className={styles.topLeaders}>
        <table>
          <tbody>
            <tr>
              <th>Nome</th>
              <th>Pontuação</th>
            </tr>
            <tr>
              <td>Yuri</td>
              <td>49.000,00 (4 políticos)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Compartilhe com seus amigos e veja quem consegue comer mais políticos.</p>
    </div>
  );
}

export default EndScreen;
