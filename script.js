const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
let score = 0;

// Definição de peças
const pieceWidth = 30;
const pieceHeight = 30;
let currentPiece = { x: 4, y: 0, shape: generatePiece() };

// Definições de teclas (não usadas, pois o controle é feito pelos botões)
const keys = { left: 37, right: 39, down: 40, rotate: 38 };

// Questões e alternativas
let currentQuestion = "";
let answerOptions = [];
let correctAnswer = null;

// Função para gerar peças aleatórias (apenas uma peça simples para exemplo)
function generatePiece() {
  return [[1]];  // Forma de peça 1x1 para simplificação
}

// Função para gerar questões matemáticas
function generateQuestion() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operation = Math.random() > 0.5 ? '+' : '-';
  currentQuestion = `${num1} ${operation} ${num2}`;
  correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
  
  // Geração de alternativas
  answerOptions = [correctAnswer, correctAnswer + 1, correctAnswer - 1, Math.floor(Math.random() * 20)];
  answerOptions = shuffle(answerOptions);
  document.getElementById('question').textContent = `Qual é o resultado de: ${currentQuestion}`;
}

// Função para embaralhar as alternativas
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Função para verificar a resposta
function checkAnswer(selected) {
  if (answerOptions[selected] === correctAnswer) {
    score += 10;
  } else {
    score -= 5;
  }
  scoreElement.textContent = score;
  generateQuestion(); // Gerar uma nova questão
}

// Função para desenhar a peça
function drawPiece() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'orange';
  ctx.fillRect(currentPiece.x * pieceWidth, currentPiece.y * pieceHeight, pieceWidth, pieceHeight);
}

// Função para mover a peça
function movePiece(direction) {
  if (direction === 'left') {
    currentPiece.x -= 1;
  } else if (direction === 'right') {
    currentPiece.x += 1;
  } else if (direction === 'down') {
    currentPiece.y += 1;
  }
  drawPiece();
}

// Inicia o jogo
function startGame() {
  generateQuestion();
  setInterval(function() {
    drawPiece();
  }, 1000);
}

startGame();
