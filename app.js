document.addEventListener('DOMContentLoaded', () => {
  const dino = document.querySelector('.dino');
  const obstacles = document.querySelector('.obstacles');
  const background = document.querySelector('.background');
  const alert = document.getElementById('alert');
  const play = document.querySelector('.play');
  const playAgain = document.querySelector('.play-again');
  const backgroundToggle = document.querySelector('.background-toggle');

  let isJumping = false;
  let isGameOver = false;
  let gravity = 0.9;

  let highScore = localStorage.getItem('highScore');
  if (highScore) {
    document.querySelector('.high-score-number').innerHTML = highScore;
  }

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
      if (count === 15) {
        clearInterval(timerId);
        let downTimerId = setInterval(function () {
          if (count === 0) {
            clearInterval(downTimerId);
            isJumping = false;
          }
          //move down
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
        playAgain.style.display = 'block';
        isGameOver = true;
        //count how many obstacles have position < 0
        //that's the score of how many the dinosaur jumped over
        const obstaclesJumped = Array.from(obstacles.children).filter(element => {
          const leftPosition = parseInt(element.style.left.replace('pxg',''));
          if (leftPosition < 0) {
            return element;
          }
        })
        document.querySelector('.score-number').innerHTML = obstaclesJumped.length;
        updateHighScore(obstaclesJumped.length);
        //remove all obstacles
        while (obstacles.firstChild) {
          obstacles.removeChild(obstacles.lastChild);
        }
        background.classList.remove('animate');
        document.removeEventListener('keyup', control);
        playAgain.addEventListener('click', playGameAgain);
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

  function updateHighScore(score) {
    let currentHighScore = localStorage.getItem('highScore');
    if (!currentHighScore || score > currentHighScore) {
      localStorage.setItem('highScore',score);
      document.querySelector('.high-score-number').innerHTML = score;
    }
  }

  function playGame(){
    play.style.display = 'none';
    isGameOver = false;
    alert.innerHTML = '';
    background.classList.add('animate');
    window.focus();
    document.addEventListener('keyup', control);
    generateObstacles();
    play.removeEventListener('click', playGame);
  }
  play.addEventListener('click', playGame);

  /* When we click play, if we've played before, the removed children are re-added
     So to stop this we'll force the browser to reload
     And if it's reloading (not loading for the first time)
     immediately run the game without having to press play
  */

  function playGameAgain() {
    sessionStorage.setItem("reloading", "true");
    location.reload();
  }

  const reloading = sessionStorage.getItem("reloading");
  if (reloading) {
    sessionStorage.removeItem("reloading");
    playGame();
  }

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