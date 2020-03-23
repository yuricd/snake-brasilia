import snakeRight from '../assets/images/snake-head-right.png';
import snakeDown from '../assets/images/snake-head-down.png';
import snakeLeft from '../assets/images/snake-head-left.png';
import snakeUp from '../assets/images/snake-head-up.png';

export class Snake {
  constructor(canvas, data, eatCallback) {

    this.score = 20;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.snakeW = 7;
    this.snakeH = 7;
    this.direction = 'right';
    this.body = [];
    this.polits = data;
    this.current = this.getPolit();
    this.eatCallback = eatCallback;
    this.paused = false;

    for (let i=this.score-1; i>=0; i--) {
      this.body.push({ 
        x: i,
        y: 10,
      })
    }
  }

  setScore(newScore) {
    this.score = newScore;
    return this.score;
  }

  drawSnake(x, y, head) {
    let headImg = new Image();

    if (head && this.direction === 'right') {
      headImg.src = snakeRight;
      this.ctx.drawImage(headImg, x*this.snakeW-2, y*this.snakeH-8, 34, 18);
    } else if (head && this.direction === 'left') {
      headImg.src = snakeLeft;
      this.ctx.drawImage(headImg, x*this.snakeW-24, y*this.snakeH-8, 34, 18);
    } else if (head && this.direction === 'up') {
      headImg.src = snakeUp;
      this.ctx.drawImage(headImg, x*this.snakeW-8, y*this.snakeH-24, 18, 34);
    } else if (head && this.direction === 'down') {
      headImg.src = snakeDown;
      this.ctx.drawImage(headImg, x*this.snakeW-3, y*this.snakeH-2, 18, 34);
    } else {
      this.ctx.fillStyle = '#FFB800';
      this.ctx.fillRect(x*this.snakeW, y*this.snakeH, this.snakeW, this.snakeH);
    }
  }

  checkCollision(x, y, array) {
    if (x < 0 || 
        y < 0 || 
        x >= (this.width)/this.snakeW || 
        y >= (this.height)/this.snakeH
      ) {
        alert('colidiu');
    }
    for (let i=1; i<array.length; i++) {
      if(x === array[i].x && y === array[i].y) {
        alert('colidiu');
      }
    }
    return false;
  }

  getPolit() {
    return {
      data: this.polits[0],
      pos: {
        x: Math.round(Math.random()*(this.width/this.snakeW)),
        y: Math.round(Math.random()*(this.height/this.snakeH)),
      }
    }
  }

  drawPolit(renderImg, x, y) {
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 1;
    this.ctx.shadowColor = 'rgba(255, 255, 255, 1)';
    this.ctx.drawImage(renderImg, x*this.snakeW-4, y*this.snakeH-4, this.snakeW+8, this.snakeH+8);
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0)';
  }

  draw() {
    if(!this.current.data) {
      console.log('end');
    } else if (this.paused) { 
      console.log('paused');
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i=0; i<this.body.length; i++) {
        let x = this.body[i].x;
        let y = this.body[i].y;
        this.drawSnake(x, y, i === 0);
      }

      let renderImg = new Image();
      renderImg.src = this.current.data.image;
      this.drawPolit(renderImg, this.current.pos.x, this.current.pos.y);

      let snakeHeadX = this.body[0].x;
      let snakeHeadY = this.body[0].y;
      
      this.checkCollision(snakeHeadX, snakeHeadY, this.body);

      if(this.direction === 'left') {
        snakeHeadX--;
      } else if(this.direction === 'up') {
        snakeHeadY--;
      } else if(this.direction === 'right') {
        snakeHeadX++;
      } else if(this.direction === 'down') {
        snakeHeadY++;
      }

      if (snakeHeadX === this.current.pos.x && snakeHeadY === this.current.pos.y) {
        this.polits.shift();
        this.current = this.getPolit();
        this.setScore(this.current.data.salary);
        this.eatCallback(this.score);
        this.paused = true;
      } else {
        this.body.pop();
      }

      let newHead = {
        x: snakeHeadX,
        y: snakeHeadY,
      }

      this.body.unshift(newHead);
    }
  }
}