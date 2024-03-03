document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');
    const obstacles = document.getElementById('obstacles');

    let playerLeft = 50;
    let playerBottom = 300;
    let isJumping = false;
    let gameSpeed = 3;
    let gameInterval;
    let rotationAngle = 0; // Track total rotation angle

    function jump() {
        if (!isJumping) {
            isJumping = true;
            rotationAngle += 90; // Increase rotation angle by 90 degrees
            player.style.transition = 'transform 0.5s ease'; // Apply transition for smooth rotation
            player.style.transform = `rotate(${rotationAngle}deg)`; // Apply rotation
            let jumpHeight = 350; // Adjusted jump height (you can tweak this value as needed)
            let jumpIncrement = 10; // Adjusted jump increment (you can tweak this value as needed)
            let jumpInterval = setInterval(() => {
                if (jumpHeight > 0) {
                    playerBottom += jumpIncrement; // Adjusted jump speed
                    player.style.bottom = playerBottom + 'px';
                    jumpHeight -= jumpIncrement; // Decrement jump height
                } else {
                    clearInterval(jumpInterval);
                    let fallInterval = setInterval(() => {
                        if (playerBottom > 300) {
                            playerBottom -= 10; // Adjusted fall speed
                            player.style.bottom = playerBottom + 'px';
                        } else {
                            clearInterval(fallInterval);
                            isJumping = false;
                        }
                    }, 20);
                }
            }, 20);
        }
    }

    document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
            jump();
        }
    });

    function movePlayer() {
        playerLeft += gameSpeed;
        player.style.left = playerLeft + 'px';

        // Check if player reaches the end of the level
        if (playerLeft >= gameContainer.offsetWidth - player.offsetWidth) {
            endLevel();
        }
    }

    function endLevel() {
        clearInterval(gameInterval); // Stop the game loop
        alert('Congratulations! You have reached the end of the level.');
        restartGame();
    }

    function restartGame() {
        playerLeft = 50;
        playerBottom = 300;
        player.style.left = playerLeft + 'px';
        player.style.bottom = playerBottom + 'px';
    
        // Remove existing spikes
        obstacles.innerHTML = '';
    
        // Generate new spikes
        generateObstacle();
    
        // Clear existing game interval before starting a new one
        clearInterval(gameInterval);
    
        // Start the game loop
        gameInterval = setInterval(gameLoop, 20);
    }

    function generateObstacle() {
        const obstacle = document.createElement('img');
        obstacle.src = 'images/spike.png'; // Corrected the path to the spike image
        obstacle.classList.add('obstacle', 'spike');
        obstacle.style.left = gameContainer.offsetWidth + 'px';

        obstacles.appendChild(obstacle);
    }

    function moveObstacles() {
        const obstaclesList = document.querySelectorAll('.obstacle');
        obstaclesList.forEach(obstacle => {
            const obstacleLeft = parseInt(obstacle.style.left);
            obstacle.style.left = obstacleLeft - gameSpeed + 'px';

            if (obstacleLeft < 0) {
                obstacles.removeChild(obstacle);
            }

            const playerRect = player.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (playerRect.right > obstacleRect.left &&
                playerRect.left < obstacleRect.right &&
                playerRect.bottom > obstacleRect.top &&
                playerRect.top < obstacleRect.bottom) {
                restartGame();
            }
        });
    }

    function gameLoop() {
        movePlayer();
        moveObstacles();
    }

    // Generate the first obstacle immediately when the game starts
    generateObstacle();

    // Start the game loop
    gameInterval = setInterval(gameLoop, 20);

    // Generate obstacles at intervals
    setInterval(generateObstacle, 4000);
});
