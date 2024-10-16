
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

let box = 20;
let snake = [{ x: 7 * box, y: 7 * box }];
let direction = "";
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let level = 1;
let targetScore = 10;
let speed = 90; // Set initial speed to 90 ms
let game;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } while (collision(newFood, snake));
    return newFood;
}

function drawGame() {
    ctx.fillStyle = '#282c34';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#00FF00' : '#ffffff';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'UP') snakeY -= box;
    if (direction === 'DOWN') snakeY += box;
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'RIGHT') snakeX += box;

    // Make the snake pass through walls
    if (snakeX < 0) {
        snakeX = canvas.width - box;
    } else if (snakeX >= canvas.width) {
        snakeX = 0;
    }
    if (snakeY < 0) {
        snakeY = canvas.height - box;
    } else if (snakeY >= canvas.height) {
        snakeY = 0;
    }

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        food = generateFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over!');
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        resetGame();
        return;
    }

    snake.unshift(newHead);
    scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore} | Level: ${level}`;

    if (score >= targetScore) {
        level++;
        targetScore = Math.ceil(targetScore * 1.1) + targetScore; // Increase target score by 110% and round up
        speed += 30; // Slow down the game pace by 30 ms on each level
        clearInterval(game);
        game = setInterval(drawGame, speed);
    }
}

function resetGame() {
    score = 0;
    level = 1;
    targetScore = 10;
    box = 20;
    canvas.width = 300;
    canvas.height = 300;
    speed = 90; // Set initial speed to 90 ms
    snake = [{ x: 7 * box, y: 7 * box }];
    direction = "";
    food = generateFood();
    game = setInterval(drawGame, speed);
}

game = setInterval(drawGame, speed);