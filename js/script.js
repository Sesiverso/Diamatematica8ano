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
let timeLeft = 30;
let timer;
let correctAnswer = 0;
let isPieceFalling = false;
let dropInterval = 1000;
let lastTime = 0;
let dropCounter = 0;

// --- Questões Matemáticas ---
function generateQuestion() {
    timeLeft = 30;
    updateTimer();
    const types = ['asc', 'desc', 'soma', 'sub', 'mult', 'div'];
    const type = types[Math.floor(Math.random() * types.length)];
    let a, b;

    switch (type) {
        case 'asc':
            a = Math.floor(Math.random() * 50);
            questionEl.textContent = `Complete: ${a}, ${a + 1}, ___, ${a + 3}`;
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

    clearInterval(timer);
    timer = setInterval(countdown, 1000);
}

function countdown() {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
        clearInterval(timer);
        handleAnswer(false);
    }
}

function updateTimer() {
    timerEl.textContent = `⏳ ${timeLeft}s`;
}

submitBtn.addEventListener('click', () => {
    const userAnswer = parseInt(answerEl.value);
    handleAnswer(userAnswer === correctAnswer);
    answerEl.value = '';
});

function handleAnswer(isCorrect) {
    clearInterval(timer);
    if (isCorrect) {
        correctSound.play();
        score += 200;
        isPieceFalling = true;
    } else {
        wrongSound.play();
        score -= 150;
    }
    scoreEl.textContent = `Pontuação: ${score}`;
}

// --- Tetris ---
const arena = createMatrix(12, 20);
const player = { pos: { x: 0, y: 0 }, matrix: null };

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

function createPiece
