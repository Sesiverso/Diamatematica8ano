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
let prizeCubes = []; // Array para os cubos

// Definição do labirinto fixo (maior e mais detalhado)
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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

    // Gerando os cubos com as respostas
    generateCubes();
    displayQuestion();
}

// Exibe a pergunta
function displayQuestion() {
    document.getElementById('question').textContent = `Pergunta: ${question}`;
}

// Função para gerar os cubos de resposta
function generateCubes() {
    prizeCubes = [];
    
    // Gerar cubos com respostas
    for (let i = 0; i < 5; i++) {
        let answer = i === 0 ? correctAnswer : Math.floor(Math.random() * 50); // Apenas um cubo terá a resposta correta
        let cube = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 30,
            text: answer,
            correct: answer === correctAnswer // Indica se a resposta é correta
        };
        prizeCubes.push(cube);
    }
}

// Função para movimentar o jogador com base no mouse
function movePlayer(e) {
    let mousePos = getMousePos(e);
    
    // Verifica se a nova posição do mouse é válida (sem atravessar paredes)
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
    
    // Verifica se a célula está vazia (0) ou se há uma parede (1)
    return maze[gridY] && maze[gridY][gridX] === 0; // Retorna 'true' apenas se o caminho estiver livre
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

    // Desenha os cubos de resposta
    drawPrizeCubes();

    // Desenha os inimigos
    enemies.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });

    // Exibe a pergunta
    document.getElementById("question").textContent = `Pergunta: ${question}`;
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

// Função para desenhar os cubos com as respostas
function drawPrizeCubes() {
    prizeCubes.forEach(cube => {
        ctx.fillStyle = cube.correct ? 'green' : 'red'; // Verde para a resposta correta, vermelho para as erradas
        ctx.fillRect(cube.x, cube.y, cube.size, cube.size);
        ctx.fillStyle = 'black';
        ctx.font = "16px Arial";
        ctx.fillText(cube.text, cube.x + 5, cube.y + cube.size / 2);
    });
}

// Função para verificar colisão com os cubos
function checkCubeCollisions() {
    prizeCubes.forEach(cube => {
        const dx = player.x - (cube.x + cube.size / 2);
        const dy = player.y - (cube.y + cube.size / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < player.size + cube.size / 2) {
            if (cube.correct) {
                alert("Você ganhou!");
                // Reiniciar o jogo ou passar para o próximo nível
                generateQuestion(); // Reinicia a pergunta
            } else {
                alert("Resposta errada! Comece de novo.");
                // Reiniciar o jogo
                player.x = 100;
                player.y = 100;
                generateQuestion(); // Reinicia a pergunta
            }
        }
    });
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

// Loop principal do jogo
function gameLoop() {
    drawGame();
    moveEnemies();
    checkCubeCollisions();
}

// Função de inicialização
function init() {
    generateQuestion(); // Inicializa a primeira pergunta
    createEnemies(); // Cria os inimigos
    setInterval(gameLoop, 1000 / 60); // Atualiza o jogo a 60fps
}

// Inicia o jogo
init();

