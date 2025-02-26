// Aguardar o carregamento completo do DOM
// Aguardar o carregamento completo do DOM
window.onload = function() {
  const canvas = document.getElementById('gameCanvas');
  
  // Verifica se o elemento canvas foi encontrado
  if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Definição de peças e variáveis
    const pieceWidth = 30;
    const pieceHeight = 30;
    let currentPiece = { x: 4, y: 0, shape: generatePiece() };
    let score = 0;
    const scoreElement = document.getElementById('score');

    // Função para gerar peças aleatórias (apenas uma peça simples para exemplo)
    function generatePiece() {
      return [[1]];  // Forma de peça 1x1 para simplificação
    }

    // Função para gerar questões matemáticas
    let answerOptions = [];  // Defina answerOptions fora de qualquer função para acessá-la globalmente

    function generateQuestion() {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operation = Math.random() > 0.5 ? '+' : '-';
      const currentQuestion = `${num1} ${operation} ${num2}`;
      const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;

      // Geração de alternativas
      answerOptions = [correctAnswer, correctAnswer + 1, correctAnswer - 1, Math.floor(Math.random() * 20)];
      answerOptions = shuffle(answerOptions);
      document.getElementById('question').textContent = `Qual é o resultado de: ${currentQuestion}`;

      // Retorna o correto para ser usado na função checkAnswer
      return correctAnswer;
    }

    // Função para embaralhar as alternativas
    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    // Função para verificar a resposta
    function checkAnswer(selected) {
      const correctAnswer = generateQuestion();  // Chama a função para obter a resposta correta
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa o canvas antes de desenhar a nova peça
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
    
    // A lógica para os botões de movimento
    document.querySelector("button[onclick='movePiece(\'left\')']").addEventListener("click", function() {
      movePiece('left');
    });

    document.querySelector("button[onclick='movePiece(\'right\')']").addEventListener("click", function() {
      movePiece('right');
    });

    document.querySelector("button[onclick='movePiece(\'down\')']").addEventListener("click", function() {
      movePiece('down');
    });
  } else {
    console.error('Canvas não encontrado!');
  }
};

