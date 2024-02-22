const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ["O"];

const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
};

function converPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
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

function generateTetramino() {
  const name = TETROMINO_NAMES[0];
  const matrix = TETROMINOES[name];

  const tetromino = {
    name,
    matrix,
    row: 3,
    column: 4,
  };
}

generatePlayField();
generateTetramino();

const cells = document.querySelectorAll(".grid div");

function drawPlayField() {
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
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
      const cellIndex = converPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );

      cells[cellIndex].classList.add(name);
    }
  }
}

drawTetromino();
drawPlayField();

document.addEventListener("keydown", onKeyDown);
function onKeyDown(event) {
  switch (event.key) {
    case "ArrowDown":
      moveTetrominoDown();
      break;
  }
}

function moveTetrominoDown() {
  tetromino.row += 1;
  drawTetromino();
}
