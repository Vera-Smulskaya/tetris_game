const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O", "J", "L", "I", "S", "Z", "T"];
const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

function converPositionToIndex(row, column) {
  return Math.floor(row * PLAYFIELD_COLUMNS + column);
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

let playfield;
let tetromino;

function generatePlayField() {
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }

  playfield = new Array(PLAYFIELD_ROWS)
    .fill()
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));
}

function generateTetromino() {
  const name = getRandomElement(TETROMINO_NAMES);
  const matrix = TETROMINOES[name];
  const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);

  tetromino = {
    name,
    matrix,
    row: 3,
    column,
  };
}

function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  generateTetromino();
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll(".grid div");

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      if (playfield[row][column] == 0) continue;

      const name = playfield[row][column];
      const cellIndex = converPositionToIndex(row, column);

      cells[cellIndex].classList.add(name);
    }
  }
}

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      // result working of function rotateMatrix():
      // const cellIndex = converPositionToIndex(
      //   tetromino.row + row,
      //   tetromino.column + column
      // );
      // cells[cellIndex].innerHTML = showRotated[row][column];

      if (!tetromino.matrix[row][column]) continue;
      const cellIndex = converPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      cells[cellIndex].classList.add(name);
    }
  }
}

function draw() {
  cells.forEach((cell) => cell.removeAttribute("class"));
  drawPlayField();
  drawTetromino();
}
let showRotated = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  showRotated = rotateMatrix(tetromino.matrix);
  tetromino.matrix = rotatedMatrix;
  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

draw();

function rotate() {
  rotateTetromino();
  draw();
}

document.addEventListener("keydown", onKeyDown);
function onKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      rotate();
      break;
    case "ArrowDown":
      moveTetrominoDown();
      break;
    case "ArrowLeft":
      moveTetrominoLeft();
      break;
    case "ArrowRight":
      moveTetrominoRight();
      break;
  }
  draw();
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  }
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      // if (tetromino.matrix[row][column]) continue;
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutsideOfGameboard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.column + column < 0 ||
      tetromino.column + column >= PLAYFIELD_COLUMNS ||
      tetromino.row + row >= playfield.length)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playfield[tetromino.row + row][tetromino.column + column]
  );
}
