document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div')); // place all 200 div elements into array
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const scoreLabel = document.getElementById('score-label');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = ['#e76f51', '#e63946', '#7400b8', '#2a9d8f', '#457b9d'];


    // The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const zTetromino = [
        [width * 2, width * 2 + 1, width + 1, width + 2],
        [0, width, width + 1, width * 2 + 1],
        [width * 2, width * 2 + 1, width + 1, width + 2],
        [0, width, width + 1, width * 2 + 1],
    ];

    const tTetromino = [
        [width, width + 1, 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width + 1, width, width * 2 + 1],
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ];

    const theTetrominoes = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino,
    ];

    let currentPosition = 4;
    let currentRotation = 0;

    // Draw a random Tetromino shape
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // Draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor =
                colors[random];
        });
    }

    // Undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // Assign functions to key codes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    // Move down function
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Freeze Tetromino
    function freeze() {
        if (
            current.some(index =>
                squares[currentPosition + index + width].classList.contains(
                    'taken'
                )
            )
        ) {
            current.forEach(index =>
                squares[currentPosition + index].classList.add('taken')
            );

            // Start a new Tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // Move the Tetromino left, unless it is at the edge or there is a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(
            index => (currentPosition + index) % width === 0
        );

        if (!isAtLeftEdge) currentPosition -= 1;

        if (
            current.some(index =>
                squares[currentPosition + index].classList.contains('taken')
            )
        ) {
            currentPosition += 1;
        }
        draw();
    }

    // Move the Tetromino right, unless it is at the edge or there is a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(
            index => (currentPosition + index) % width === width - 1
        );

        if (!isAtRightEdge) currentPosition += 1;

        if (
            current.some(index =>
                squares[currentPosition + index].classList.contains('taken')
            )
        ) {
            currentPosition -= 1;
        }
        draw();
    }

    ///FIX ROTATION OF TETROMINOS A THE EDGE
    function isAtRight() {
        return current.some(
            index => (currentPosition + index + 1) % width === 0
        );
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0);
    }

    function checkRotatedPosition(P) {
        P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
        if ((P + 1) % width < 4) {
            //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
            if (isAtRight()) {
                //use actual position to check if it's flipped over to right side
                currentPosition += 1; //if so, add one to wrap it back around
                checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
            }
        } else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1;
                checkRotatedPosition(P);
            }
        }
    }

    // Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            // if current rotation = 4, make it go back to 0
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        checkRotatedPosition();
        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    // The Tetrominos without rotations
    const upNextTetrominos = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
    ];

    // Display the shape in the mini-grid display
    function displayShape() {
        // Remove any trace of a Tetromino form on the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor =
                colors[nextRandom];
        });
    }

    // Start Button event listener
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

    // Add Score function
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [
                i,
                i + 1,
                i + 2,
                i + 3,
                i + 4,
                i + 5,
                i + 6,
                i + 7,
                i + 8,
                i + 9,
            ];

            if (
                row.every(index => squares[index].classList.contains('taken'))
            ) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // Game Over function
    function gameOver() {
        if (
            current.some(index =>
                squares[currentPosition + index].classList.contains('taken')
            )
        ) {
            scoreLabel.innerHTML = 'Game Over';
            clearInterval(timerId);
        }
    }
});
