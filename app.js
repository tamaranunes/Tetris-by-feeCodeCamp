document.addEventListener('DOMContentLoaded', () => {
  const rules = document.querySelector('#rules')
  const rulesBtn = document.querySelector('#rules-button')
  const closeBtn = document.querySelector('#closeBtn')
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const restartBtn = document.querySelector('#restart-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    '#fde482', // orange or yellow
    '#fe948d', // red
    '#be9ddf', // purple
    '#80b7a2',
    '#7eb8da' // blue
  ]

  // The Rules

  rulesBtn.addEventListener('click', () => {
    rules.style.display = 'block'
  })

  closeBtn.addEventListener('click', () => {
    rules.style.display = 'none'
  })

  // The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  // Starting position of first square
  let currentPosition = 4
  let currentRotation = 0

  console.log(theTetrominoes[0][0])

  // Randomly select a Tetromino and its first roatation
  let random = Math.floor(Math.random() * theTetrominoes.length)

  // Tetromino first rotation
  let current = theTetrominoes[random][currentRotation] // access first tetromino in Array and it's first rotation

  // Draw the tertomino - for each item/index in the current position in the array
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  // Undraw the Tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // Make the tetromino move down every second
  // timerId = setInterval(moveDown, 1000)

  // Assign functions to keycodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // Move down function
  function moveDown () {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // Freeze function to stop the tetrominoes from going past the bottom EDGE
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Move the tetromino left, unless it is at the edge or there is a blockage
  function moveLeft () {
  // Undraw any tetromino and start on a clean space
    undraw()
    // If you divide the width into the square of the tetromino then it should have no remainders then statement is true
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    // Only move left if not at left edge
    if (!isAtLeftEdge) currentPosition -= 1
    // If a tetromino goes into a space where another tetromino is we want to push it back a space
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  // Move the tetromino right, unless it is at the edge or there is a blockage
  function moveRight () {
  // Undraw any tetromino and start on a clean space
    undraw()
    // If you divide the width into the square of the tetromino then it should have no remainders then statement is true
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    // Only move left if not at left edge
    if (!isAtRightEdge) currentPosition += 1
    // If a tetromino goes into a space where another tetromino is we want to push it back a space
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // Rotate the tetromino
  function rotate () {
    undraw()
    currentRotation++
    // If the current rotation gets to 4, make it go back to 0
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // Show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // The Tetrominoes without roatation
  const upNextTetriminoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
  ]

  // Display the shape in the mini-grid display
  function displayShape () {
    // Remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetriminoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // Start and Pause Button
  // Add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // Start and Pause Button
  restartBtn.addEventListener('click', () => {
    location.reload()
  })

  // Add scoreDisplay
  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // Gameover
  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'END'
      clearInterval(timerId)
    }
  }
})
