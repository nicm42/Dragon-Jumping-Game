document.addEventListener('DOMContentLoaded', () => {
  const dino = document.querySelector('.dino');
  const obstacles = document.querySelector('.obstacles');
  const background = document.querySelector('.background');
  const alert = document.getElementById('alert');
  const play = document.querySelector('.play');
  const backgroundToggle = document.querySelector('.background-toggle');

  let isJumping = false;
  let isGameOver = false;
  let gravity = 0.9;

  function control(e) {
    e.preventDefault();
    if (e.keyCode === 32) {
      if (!isJumping) {
        isJumping = true;
        jump();
      }
    }
  }

  let position = 0;
  function jump() {
    count = 0;
    let timerId = setInterval(function () {
      //move down
      if (count === 15) {
        clearInterval(timerId);
        let downTimerId = setInterval(function () {
          if (count === 0) {
            clearInterval(downTimerId);
            isJumping = false;
          }
          position -= 5;
          position *= gravity;
          count --;
          dino.style.bottom = position + 'px';
        },20)
      }
      //move up
      count++;
      position += 30;
      position *= gravity;
      dino.style.bottom = position + 'px';
    },20)
  }

  function generateObstacles() {
    let randomTime = Math.random() * 4000;
    let obstaclePosition = window.innerWidth + 100;
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    if (!isGameOver) {
      obstacles.appendChild(obstacle);
      obstacle.style.left = obstaclePosition + 'px';
    }

    let timerId = setInterval(function() {
      if (obstaclePosition > 0 && obstaclePosition < 60 && position < 60) {
        clearInterval(timerId);
        alert.innerHTML = 'Game Over';
        play.style.visibility = 'visible';
        isGameOver = true;
        //count how many obstacles have position < 0
        //that's the score of how many the dinosaur jumped over
        //const obstaclesChildren = Array.from(obstacles.children);
        const obstaclesJumped = Array.from(obstacles.children).filter(element => {
          const leftPosition = parseInt(element.style.left.replace('pxg',''));
          if (leftPosition < 0) {
            return element;
          }
        })
        document.querySelector('.score-number').innerHTML = obstaclesJumped.length;
        //remove all obstacles
        while (obstacles.firstChild) {
          obstacles.removeChild(obstacles.lastChild);
        }
        background.classList.remove('animate');
      }

      if(!isGameOver){
        obstaclePosition -= 10;
        obstacle.style.left = obstaclePosition + 'px';      
      }
    },30)
    if (!isGameOver) {
      setTimeout(generateObstacles, randomTime);
    }
  }

  function playGame(){
    play.style.visibility = 'hidden';
    isGameOver = false;
    alert.innerHTML = '';
    background.classList.add('animate');
    window.focus();
    document.addEventListener('keyup', control);
    generateObstacles();    
  }
  play.addEventListener('click', playGame);

  function toggleBackground() {
    window.focus(); //in case it's pressed while playing
    if(isBackgroundOn) {
      backgroundToggle.innerHTML = "Turn on background";
      background.style.visibility = "hidden";
      isBackgroundOn = false;
    } else {
      backgroundToggle.innerHTML = "Turn off background";
      background.style.visibility = "visible";
      isBackgroundOn = true;
    }
  }
  let isBackgroundOn = true;
  backgroundToggle.addEventListener('click', toggleBackground);
})