const board = document.querySelector(".board");
const boardLetters = document.querySelector(".letters");
const boardNumbers = document.querySelector(".numbers");
let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
let possibleClick = ["pawn", "rook", "knight", "bishop", "queen", "king"];
let FindDataSet = ["b", "r", "k", "p"];
let detectRook = ["x", "y", "z", "x"];
let GlobalColisionSelector = "";
let CalculateXXaxis = -1;
let ChessBoard = 8;
let widthX = 9;
let widthY = 8;
let ChessBack = 8;
let count = 8;
let DetectQueen = false;
let index = 0;
let num = 1;
let ChessWidth = 8;
let black = false;
const table = [];
let TakeColiderId;

const CreateChessControls = () => {
  for (let i = 0; i < ChessBack; i++) {
    let letter = document.createElement("li");
    letter.textContent = letters[i];
    boardLetters.appendChild(letter);
    let numbers = document.createElement("li");
    numbers.textContent = num++;
    boardNumbers.appendChild(numbers);
  }
};

CreateChessControls();

const CreateChessBoard = () => {
  for (let i = 1; i <= ChessBoard * ChessBoard; i++) {
    const square = document.createElement("div");
    square.id = i;
    square.dataset.id = 1;
    if (black) {
      square.classList.add("square", "black");
      index++;
      black = !black;
    } else {
      square.classList.add("square", "white");
      index++;
      black = !black;
    }
    table.push(square);
    board.appendChild(square);
    if (index === 8) {
      black = !black;
      index = 0;
    }
  }
};
CreateChessBoard();

const ChessPawns = () => {
  let Pawns = table.filter(
    (table) =>
      (table.id >= 49 && table.id <= 56) || (table.id >= 9 && table.id <= 16)
  );
  let King = table.filter(
    (item) => parseFloat(item.id) === 61 || parseFloat(item.id) === 5
  );
  let KingII = table.filter(
    (item) => parseFloat(item.id) === 4 || parseFloat(item.id) === 60
  );
  const SetBlackClass = table.filter((item) => item.id >= 1 && item.id <= 16);

  let knight = table.filter(
    (item) =>
      parseFloat(item.id) === 2 ||
      parseFloat(item.id) === 7 ||
      parseFloat(item.id) === 58 ||
      parseFloat(item.id) === 63
  );

  let Tower = table.filter(
    (item) =>
      parseFloat(item.id) === 1 ||
      parseFloat(item.id) === 8 ||
      parseFloat(item.id) === 57 ||
      parseFloat(item.id) === 64
  );
  let Follower = table.filter(
    (item) =>
      parseFloat(item.id) === 3 ||
      parseFloat(item.id) === 6 ||
      parseFloat(item.id) === 59 ||
      parseFloat(item.id) === 62
  );

  SetBlackClass.forEach((block) => {
    block.classList.add("a");
  });

  knight.forEach((block, i) => {
    block.dataset.k = i;
    block.classList.add("knight");
  });

  Follower.forEach((block, i) => {
    block.dataset.b = i;
    block.classList.add("bishop");
  });

  KingII.forEach((block) => {
    block.classList.add("queen");
  });

  Tower.forEach((block, i) => {
    block.dataset.r = i;
    block.classList.add("rook", `${detectRook[i]}`);
  });

  Pawns.forEach((block, i) => {
    block.dataset.p = i;
    block.classList.add("pawn");
  });

  King.forEach((block) => {
    block.classList.add("king");
  });
};

ChessPawns();

const Play = (current) => {};

table.forEach((block) =>
  block.addEventListener("click", (block) => Play(block))
);
