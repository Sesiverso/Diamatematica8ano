const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let player = { x: 50, y: 50, size: 20, color: 'blue' };
let enemies = [];
let walls = [];
let question = '';
let correctAnswer = 0;
let score = 0;
let timeLeft = 30;
let timerInterval;

// Função para gerar o labirinto
function generateWalls() {
    walls = [];
    for (let i = 0; i < 5; i++) {
        let wall = {
            x: Math.random() * (canvas.width - 100),
            y: Math.random() * (canvas.height - 100),
            width: 100 + Math.random() * 150,
            height: 20 + Math.random() * 100
        };
        walls.push(wall);
    }
}

// Função para gerar a pergunta e suas opções
function generateQuestion() {
    const operations = ['+', '-', '*', '/'];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const op = operations[Math.floor(Math.random() * operations.length)];

    if (op === '/') {
        correctAnswer = num1 * num2;  // Garante que a divisão seja exata
        question = `${num1 * num2} ÷ ${num2}`;
    } else {
        correctAnswer = eval(`${num1} ${op} ${num2}`);
        question = `${num1} ${op} ${num2}`;
    }
    displayQuestion();
}

// Exibe a pergunta e respostas falsas
function displayQuestion() {
    const answers = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 2];
    answers.sort(() => Math.random() - 0.5);
    document.getElementById('question').textContent = `${question} | Respostas: ${answers.join(', ')}`;
}

// Função para movimentar o jogador
function movePlayer(e) {
    let mousePos = getMousePos(e);
    player.x = mousePos.x;
    player.y = mousePos.y;
}

// Calcula a posição do mouse
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// Função para desenhar o jogo
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha as paredes
    walls.forEach(wall => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });

    // Desenha o jogador
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    // Desenha os inimigos (bolinhas vermelhas)
    enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenha a pergunta
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
        resetGame();
    }
}

// Função para criar os inimigos
function createEnemies() {
    enemies = [];
    for (let i = 0; i < 3; i++) {
        let enemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
        enemies.push(enemy);
    }
}

// Função para verificar colisões com paredes
function checkCollisions() {
    walls.forEach(wall => {
        if (player.x > wall.x && player.x < wall.x + wall.width && player.y > wall.y && player.y < wall.y + wall.height) {
            resetGame();
        }
    });
}

// Função para verificar colisões com inimigos
function checkEnemyCollisions() {
    enemies.forEach(enemy => {
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < player.size + 10) {
            resetGame();
        }
    });
}

// Função de temporizador
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            resetGame();
        }
    }, 1000);
}

// Função de reiniciar o jogo
function resetGame() {
    clearInterval(timerInterval);
    timeLeft = 30;
    generateWalls();
    generateQuestion();
    createEnemies();
    startTimer();
}

// Inicia o jogo
generateWalls();
generateQuestion();
createEnemies();
startTimer();

// Evento de movimentação do mouse
canvas.addEventListener('mousemove', movePlayer);

// Função principal do jogo
function gameLoop() {
    drawGame();
    checkCollisions();
    checkEnemyCollisions();
}

setInterval(gameLoop, 1000 / 60);
