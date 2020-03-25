import React from 'react';
import Score from '../Score/Score';
import Controls from '../Controls/Controls';
import Game from '../Game/Game';
import { Direction } from '../../hooks/snake'; 

import styles from './Main.module.scss';

function Main() {

  return (
      <Game />
  );
}

export default Main;
