const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 100, y: 100, size: 20, color: 'blue' };
let enemies = [];
let walls = [];
let question = '';
let correctAnswer = 0;
let timeLeft = 30;
let timerInterval;

// Definição do labirinto fixo
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Função para gerar a pergunta
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

// Exibe a pergunta e as respostas falsas
function displayQuestion() {
    const answers = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 2];
    answers.sort(() => Math.random() - 0.5);
    document.getElementById('question').textContent = `${question} | Respostas: ${answers.join(', ')}`;
}

// Função para movimentar o jogador com base no mouse
function movePlayer(e) {
    let mousePos = getMousePos(e);
    if (canMove(mousePos.x, mousePos.y)) {
        player.x = mousePos.x;
        player.y = mousePos.y;
    }
}

// Calcula a posição do mouse
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

// Função para verificar se o jogador pode se mover
function canMove(x, y) {
    const gridX = Math.floor(x / 50); // Ajuste de acordo com o tamanho da célula
    const gridY = Math.floor(y / 50);
    return maze[gridY] && maze[gridY][gridX] === 0; // Verifica se a célula está vazia
}

// Função para desenhar o jogo
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o labirinto
    drawMaze();

    // Desenha o jogador
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    // Desenha os inimigos
    enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Exibe a pergunta e o tempo restante
    document.getElementById("time").textContent = timeLeft;
}

// Função para desenhar o labirinto
function drawMaze() {
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * 50, y * 50, 50, 50);
            }
        }
    }
}

// Função para criar inimigos (bolinhas vermelhas)
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

// Função para mover os inimigos
function moveEnemies() {
    enemies.forEach(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 5) {
            const speed = 1;
            enemy.x += (dx / dist) * speed;
            enemy.y += (dy / dist) * speed;
        }
    });
}

// Função para verificar colisões com os inimigos
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

// Função para reiniciar o jogo
function resetGame() {
    timeLeft = 30;
    generateQuestion();
    createEnemies();
    startTimer();
}

// Evento de movimentação do mouse
canvas.addEventListener('mousemove', movePlayer);

// Função principal do jogo
function gameLoop() {
    drawGame();
    moveEnemies();
    checkEnemyCollisions();
}

generateQuestion();
createEnemies();
startTimer();

setInterval(gameLoop, 1000 / 60);

    checkCollisions();
    checkEnemyCollisions();
}

setInterval(gameLoop, 1000 / 60);
