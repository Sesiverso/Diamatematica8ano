const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const cellSize = 25; // Tamanho de cada célula do labirinto
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let pacMan = { x: 1, y: 1, radius: 10, color: "yellow" };
let questionText = '';
let answer = 0;
let items = [];
let enemies = [];

// Definição do labirinto como uma matriz
const maze = [
    // 0: caminho, 1: parede
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Função para desenhar o labirinto
function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Função para desenhar o Pac-Man
function drawPacMan() {
    ctx.beginPath();
    ctx.arc(pacMan.x * cellSize + cellSize / 2, pacMan.y * cellSize + cellSize / 2, pacMan.radius, 0, Math.PI * 2);
    ctx.fillStyle = pacMan.color;
    ctx.fill();
    ctx.closePath();
}

// Função para desenhar itens (respostas corretas)
function drawItems() {
    items.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x * cellSize + cellSize / 2, item.y * cellSize + cellSize / 2, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
    });
}

// Função para desenhar inimigos
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x * cellSize + cellSize / 2, enemy.y
::contentReference[oaicite:0]{index=0}
 
