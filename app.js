document.addEventListener('DOMContentLoaded', () => {
  const dino = document.querySelector('.dino');
  const obstacles = document.querySelector('.obstacles');
  const background = document.querySelector('.background');
  const alert = document.querySelector('.alert');
  const play = document.querySelector('.play');
  const playAgain = document.querySelector('.play-again');
  const backgroundToggle = document.querySelector('.background-toggle');
  const planet = Array.from(document.getElementsByClassName('planet'));
  const earth = document.getElementById('earth');
  const moon = document.getElementById('moon');

  let isJumping = false;
  let isGameOver = false;
  let isBackgroundOn = true;
  let position = 0;

  //Planet-based variables - set to earth to start with
  let gravityUp;
  let gravityDown;
  let jumpCount;
  let positionDown;
  let positionUp;

  function control(e) {
    e.preventDefault();
    if (e.keyCode === 32 || e.type === 'click') {
      if (!isJumping) {
        isJumping = true;
        jump();
      }
    }
  }

  function jump() {
    count = 0;
    let timerId = setInterval(function () {
      if (count === jumpCount) {
        clearInterval(timerId);
        let downTimerId = setInterval(function () {
          if (count === 0) {
            clearInterval(downTimerId);
            isJumping = false;
          }
          //move down
          position -= positionUp;
          position *= gravityUp;
          count--;
          dino.style.bottom = position + 'px';
        }, 20)
      }
      //move up
      count++;
      position += positionDown;
      position *= gravityDown;
      dino.style.bottom = position + 'px';
    }, 20)
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

    let timerId = setInterval(function () {
      if (obstaclePosition > 0 && obstaclePosition < 60 && position < 60) {
        clearInterval(timerId);
        gameOver();
      }

      if (!isGameOver) {
        obstaclePosition -= 10;
        obstacle.style.left = obstaclePosition + 'px';
        calculateScore();
      }
    }, 30)
    if (!isGameOver) {
      setTimeout(generateObstacles, randomTime);
    }
  }

  function gameOver() {
    alert.innerHTML = 'Game Over';
    playAgain.style.display = 'block';
    isGameOver = true;
    //Check the score and update the high score, if necessary
    calculateScore();
    //fade out all obstacles
    for (obstacle of obstacles.childNodes) {
      obstacle.classList.add('fadeOut');
    }
    setTimeout(() => {
      //remove all obstacles
      while (obstacles.firstChild) {
        obstacles.removeChild(obstacles.lastChild);
      }      
    }, 500);
    background.classList.remove('animate');
    document.removeEventListener('keyup', control);
    background.removeEventListener('click', control);
    playAgain.addEventListener('click', playGameAgain);
    dino.classList.add('dead');
  }

  function calculateScore() {
    //count how many obstacles have position < 0
    //that's the score of how many the dinosaur jumped over
    const obstaclesJumped = Array.from(obstacles.children).filter(element => {
      const leftPosition = parseInt(element.style.left.replace('pxg', ''));
      if (leftPosition < 0) {
        return element;
      }
    })
    document.querySelector('.score-number').innerHTML = obstaclesJumped.length;
    if (isGameOver) {
      updateHighScore(obstaclesJumped.length);
    }
  }

  function updateHighScore(score) {
    let currentHighScore = getHighScore();
    if (!currentHighScore || score > currentHighScore) {
      const planet = sessionStorage.getItem('planet');
      setHighScore(`highScore-${planet}`, score);
      writeHighScore(score);
      if (score > currentHighScore) {
        alert.innerHTML += ". New high score!";
      }
    }
  }

  function getHighScore() {
    //let highScore;
    let currentPlanet = sessionStorage.getItem('planet');
    if (!currentPlanet) {
      currentPlanet = 'earth';
    }
    const highScore = localStorage.getItem(`highScore-${currentPlanet}`);
    return highScore;
  }

  function setHighScore(planet, score) {
    localStorage.setItem(planet, score);
  }

  function writeHighScore(highScore) {
    if (highScore) {
      document.querySelector('.high-score-number').innerHTML = highScore;
    }
  }

  const highScore = getHighScore();
  writeHighScore(highScore);

  function setBackgroundSpeed() {
    let constant = 15;
    if (window.innerWidth <= 550) {
      constant = 7;
    }
    const animationTime = window.innerWidth * 0.03 - constant;
    background.style.animationDuration = animationTime + 's';
  }

  function playGame() {
    play.style.display = 'none';
    isGameOver = false;
    alert.innerHTML = '';
    background.classList.add('animate');
    setBackgroundSpeed();
    window.addEventListener('resize', setBackgroundSpeed);
    window.focus();
    document.addEventListener('keyup', control);
    background.addEventListener('click', control);
    generateObstacles();
    play.removeEventListener('click', playGame);
  }

  play.addEventListener('click', playGame);

  /* 
    When we click play, if we've played before, the removed children are re-added
    So to stop this we'll force the browser to reload
    And if it's reloading (not loading for the first time)
    immediately run the game without having to press play
  */

  function playGameAgain() {
    sessionStorage.setItem('reloading', 'true');
    //using JSON.stringify here because sessionStorage only stores strings, not booleans
    sessionStorage.setItem('background', JSON.stringify(isBackgroundOn));
    location.reload();
  }

  const reloading = sessionStorage.getItem('reloading');

  if (reloading) {
    sessionStorage.removeItem('reloading');
    //using JSON.stringify here because sessionStorage only stores strings and we need this is a boolean
    isBackgroundOn = JSON.parse(sessionStorage.getItem('background'));

    if (sessionStorage.getItem('planet') === 'earth') {
      setUpEarth();
    };
    if (sessionStorage.getItem('planet') === 'moon') {
      setUpMoon();
    };
    setBackground();
    const highScore = getHighScore();
    writeHighScore(highScore);
    playGame();
  } else {
    //Set Earth to start with
    setUpEarth();
  }

  function toggleBackground() {
    window.focus(); //in case it's pressed while playing
    if (isBackgroundOn) {
      isBackgroundOn = false;
      setBackground();
    } else {
      isBackgroundOn = true;
      setBackground();
    }
  }

  function setBackground() {
    if (isBackgroundOn) {
      backgroundToggle.innerHTML = "Turn off background";
      background.style.opacity = 1;
    } else {
      backgroundToggle.innerHTML = "Turn on background";
      background.style.opacity = 0;
    }
  }

  backgroundToggle.addEventListener('change', toggleBackground);

  function setUpEarth() {
    gravityUp = 0.9;
    gravityDown = 0.9;
    jumpCount = 15;
    positionDown = 30;
    positionUp = 5;
    earth.disabled = true;
    moon.disabled = false;
    sessionStorage.setItem('planet', 'earth');
  }

  function setUpMoon() {
    gravityUp = 1 / 1.05;
    gravityDown = 0.9;
    jumpCount = 50;
    positionDown = 25;
    positionUp = 1;
    moon.disabled = true;
    earth.disabled = false;
    sessionStorage.setItem('planet', 'moon');
  }

  planet.forEach(function (element) {
    element.addEventListener('click', function () {
      if (this.id === 'earth') {
        setUpEarth();
      }
      if (this.id === 'moon') {
        setUpMoon();
      }
      const highScore = getHighScore();
      writeHighScore(highScore);
    })
  });

})