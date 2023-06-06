const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Create the pong paddle
const paddleWidth = 10, paddleHeight = 100;
const player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "#00ff00", dy: 4 };
const computer = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: "#ff0000", dy: 4 };

// Create the pong ball
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speed: 4, dx: 4, dy: 4, color: "#ffffff" };

// Set the initial speed
let speed = 1;

// Move the paddles
function movePaddle(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  player.y += (mouseY - (player.y + player.height / 2)) * 0.1; // Smoothly follow the mouse

  // Ensure the paddles stay within the canvas
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Collision detection
function collisionDetection(ball, paddle) {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  paddle.top = paddle.y;
  paddle.bottom = paddle.y + paddle.height;
  paddle.left = paddle.x;
  paddle.right = paddle.x + paddle.width;

  return ball.right > paddle.left && ball.bottom > paddle.top && ball.left < paddle.right && ball.top < paddle.bottom;
}

// Update the canvas
function update() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the paddles
  context.fillStyle = player.color;
  context.fillRect(player.x, player.y, player.width, player.height);

  context.fillStyle = computer.color;
  context.fillRect(computer.x, computer.y, computer.width, computer.height);

  // Move the ball
  ball.x += ball.dx * speed;
  ball.y += ball.dy * speed;

  // Draw the ball
  context.fillStyle = ball.color;
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();

  // Move the paddles
  canvas.addEventListener("mousemove", movePaddle);

  // AI movement for the computer's paddle
  const computerLevel = 0.1;
  computer.y += (ball.y - (computer.y + computer.height / 2)) * computerLevel;

  // Ensure the paddles stay within the canvas
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

  if (computer.y < 0) computer.y = 0;
  if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;

  // Collision detection with paddles
  if (collisionDetection(ball, player) || collisionDetection(ball, computer)) {
    ball.dx *= -1;
  }

  // Handle ball hitting top/bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Draw the score
  context.fillStyle = "#ffffff";
  context.font = "24px Arial";
  context.fillText("Speed: " + speed, canvas.width / 2 - 40, 30);

  // Request animation frame
  requestAnimationFrame(update);
}

// Start the game
update();