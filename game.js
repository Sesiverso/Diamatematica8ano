let player = document.getElementById('player');
let balls = document.querySelectorAll('.ball');
let triangles = document.querySelectorAll('.triangle');
let timeLeft = 30;
let timerElement = document.getElementById('time');
let questionElement = document.getElementById('question');
let gameBoard = document.getElementById('board');
let gameOver = false;

let playerPos = { x: 0, y: 0 };
let ballPositions = [];
let trianglePositions = [];
let answers = [];
let correctAnswer = 0;

function startGame() {
  gameOver = false;
  player.style.left = '0px';
  player.style.top = '0px';
  ballPositions = [];
  trianglePositions = [];
  timeLeft = 30;
  updateTimer();

  generateQuestion();
  moveBalls();

  setInterval(() => {
    if (gameOver) return;
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      alert("Tempo esgotado! Fim de jogo.");
      resetGame();
    }
  }, 1000);
}

function updateTimer() {
  timerElement.textContent = `Tempo restante: ${timeLeft}s`;
}

function generateQuestion() {
  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  let questionType = Math.random() < 0.5 ? 'sum' : 'multiply';
  
  if (questionType === 'sum') {
    correctAnswer = num1 + num2;
    questionElement.textContent = `Pergunta: Quanto é ${num1} + ${num2}?`;
  } else if (questionType === 'multiply') {
    correctAnswer = num1 * num2;
    questionElement.textContent = `Pergunta: Quanto é ${num1} x ${num2}?`;
  }

  generateAnswerChoices();
}

function generateAnswerChoices() {
  answers = [correctAnswer, correctAnswer + 1, correctAnswer - 1];
  answers = shuffle(answers);

  for (let i = 0; i < 3; i++) {
    triangles[i].textContent = answers[i];
    trianglePositions[i] = { x: Math.random() * 240, y: Math.random() * 240 };
    triangles[i].style.left = `${trianglePositions[i].x}px`;
    triangles[i].style.top = `${trianglePositions[i].y}px`;
  }
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function moveBalls() {
  balls.forEach((ball, index) => {
    let ballPos = { x: Math.random() * 280, y: Math.random() * 280 };
    ballPositions.push(ballPos);
    ball.style.left = `${ballPos.x}px`;
    ball.style.top = `${ballPos.y}px`;

    setInterval(() => {
      if (gameOver) return;
      ballPos.x += (Math.random() - 0.5) * 10;
      ballPos.y += (Math.random() - 0.5) * 10;

      if (ballPos.x < 0 || ballPos.x > 280) ballPos.x = Math.random() * 280;
      if (ballPos.y < 0 || ballPos.y > 280) ballPos.y = Math.random() * 280;

      ball.style.left = `${ballPos.x}px`;
      ball.style.top = `${ballPos.y}px`;
    }, 100);
  });
}

gameBoard.addEventListener('mousemove', (e) => {
  if (gameOver) return;
  playerPos.x = e.clientX - gameBoard.offsetLeft - player.offsetWidth / 2;
  playerPos.y = e.clientY - gameBoard.offsetTop - player.offsetHeight / 2;
  player.style.left = `${playerPos.x}px`;
  player.style.top = `${playerPos.y}px`;

  balls.forEach((ball) => {
    if (checkCollision(ball)) {
      alert('Você colidiu com uma bolinha! Jogo reiniciado.');
      resetGame();
    }
  });

  triangles.forEach((triangle, index) => {
    if (checkCollision(triangle)) {
      if (answers[index] === correctAnswer) {
        alert('Parabéns! Você encontrou a resposta correta!');
        resetGame();
      } else {
        alert('Resposta errada! Tente novamente.');
        resetGame();
      }
    }
  });
});

function checkCollision(element) {
  let elementRect = element.getBoundingClientRect();
  let playerRect = player.getBoundingClientRect();
  return !(elementRect.right < playerRect.left || 
           elementRect.left > playerRect.right || 
           elementRect.bottom < playerRect.top || 
           elementRect.top > playerRect.bottom);
}

function resetGame() {
  gameOver = true;
  setTimeout(startGame, 1000); // reinicia o jogo após 1 segundo
}

startGame();

