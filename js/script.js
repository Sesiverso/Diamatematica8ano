const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');

const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

let score = 0;
let player, arena, nextPiece;
let gamePaused = true;
let isPieceFalling = false;
let currentQuestion, correctAnswer;
let remainingTime = 30;
let gameInterval, timerInterval;

// Gera uma nova questão
function generateQuestion() {
    remainingTime = 30;
    updateTimer();

    const types = ['asc', 'desc', 'soma', 'sub', 'mult', 'div'];
    const type = types[Math.floor(Math.random() * types.length)];

    let a, b;

    switch (type) {
        case 'asc':
            a = Math.floor(Math.random() * 50);
            questionEl.textContent = `Complete a sequência: ${a}, ${a + 1}, ___, ${a + 3}`;
            correctAnswer = a + 2;
            break;
        case 'desc':
            a = Math.floor(Math.random() * 50) + 3;
            questionEl.textContent = `Complete: ${a}, ${a - 1}, ___, ${a - 3}`;
            correctAnswer = a - 2;
            break;
        case 'soma':
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
            questionEl.textContent = `Resolva: ${a} + ${b}`;
            correctAnswer = a + b;
            break;
        case 'sub':
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * 10) + 1;
            questionEl.textContent = `Resolva: ${a} - ${b}`;
            correctAnswer = a - b;
            break;
        case 'mult':
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
            questionEl.textContent = `Resolva: ${a} × ${b}`;
            correctAnswer = a * b;
            break;
        case 'div':
            b = Math.floor(Math.random() * 9) + 1;
            correctAnswer = Math.floor(Math.random() * 10) + 1;
            a = b * correctAnswer;
            questionEl.textContent = `Resolva: ${a} ÷ ${b}`;
            break;
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(countdown, 1000);
}

// Atualiza o tempo no display
function updateTimer() {
    timerEl.textContent = `⏳ ${remainingTime}s`;
}

// Conta o tempo e encerra a questão se expirar
function countdown() {
    remainingTime--;
    updateTimer();
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        handleAnswer(false);
    }
}

// Trata a resposta do jogador
function handleAnswer(isCorrect) {
    clearInterval(timerInterval);
    if (isCorrect) {
        correctSound.play();
        score += 200;
        gamePaused = false;
    } else {
        wrongSound.play();
        score -= 150;
    }
    scoreEl.textContent = `Pontuação: ${score}`;
    generatePiece();
    generateQuestion();
}

// Função para criar a peça
function createPiece(type) {
    if (type === 'T') return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
    if (type === 'O') return [[2, 2], [2, 2]];
    if (type === 'L') return [[0, 3, 0], [0, 3, 0], [0, 3, 3]];
    if (type === 'J') return [[0, 4, 0], [0, 4, 0], [4, 4, 0]];
    if (type === 'I') return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]];
    if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    if (type === 'Z') return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
}

// Cria a peça e inicializa as variáveis
function generatePiece() {
    const pieces = 'TJLOSZI';
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    player = { matrix: createPiece(randomPiece), pos: { x: 5, y: 0 } };
    nextPiece = randomPiece;
}

// Função para mover a peça para a esquerda
function moveLeft() {
    if (!gamePaused) {
        player.pos.x--;
        if (collision()) player.pos.x++;
    }
}

// Função para mover a peça para a direita
function moveRight() {
    if (!gamePaused) {
        player.pos.x++;
        if (collision()) player.pos.x--;
    }
}

// Função para verificar colisão
function collision() {
    for (let y = 0; y < player.matrix.length; y++) {
        for (let x = 0; x < player.matrix[y].length; x++) {
            if (player.matrix[y][x] !== 0) {
                if (player.pos.x + x < 0 || player.pos.x + x >= arena[0].length || player.pos.y + y >= arena.length || arena[player.pos.y + y][player.pos.x + x] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Função de atualização do jogo
function update() {
    if (!gamePaused && !isPieceFalling) {
        player.pos.y++;
        if (collision()) {
            player.pos.y--;
            merge();
            generatePiece();
        }
    }
    draw();
    requestAnimationFrame(update);
}

// Função para desenhar a matriz
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(player.matrix, player.pos);
}

// Função para desenhar a matriz da peça
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = '#f5f5f5';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Função para mesclar a peça com a arena
function merge() {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[player.pos.y + y][player.pos.x + x] = value;
            }
        });
    });
}

// Função para controlar as setas
document.addEventListener('keydown', (event) => {
    if (event.key ===
