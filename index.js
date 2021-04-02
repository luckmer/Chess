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

  let knight = table.filter((item) => {
    let ItemId = parseFloat(item.id);
    return ItemId === 2 || ItemId === 7 || ItemId === 58 || ItemId === 63;
  });

  let Tower = table.filter((item) => {
    let ItemId = parseFloat(item.id);
    return ItemId === 1 || ItemId === 8 || ItemId === 57 || ItemId === 64;
  });
  let Follower = table.filter((item) => {
    let ItemId = parseFloat(item.id);
    return ItemId === 3 || ItemId === 6 || ItemId === 59 || ItemId === 62;
  });

  SetBlackClass.forEach((block) => {
    block.classList.add("a");
  });

  knight.forEach((block, i) => {
    block.dataset.k = i;
    block.classList.add(block.classList.contains("a") ? "K" : "k");
    block.classList.add("knight");
  });

  Follower.forEach((block, i) => {
    block.dataset.b = i;
    block.classList.add(block.classList.contains("a") ? "B" : "b");
    block.classList.add("bishop");
  });

  KingII.forEach((block) => {
    block.classList.add(block.classList.contains("a") ? "Q" : "q");
    block.classList.add("queen");
  });

  Tower.forEach((block, i) => {
    block.dataset.r = i;
    block.classList.add(block.classList.contains("a") ? "R" : "r");
    block.classList.add("rook", `${detectRook[i]}`);
  });

  Pawns.forEach((block, i) => {
    block.dataset.p = i;
    block.classList.add(block.classList.contains("a") ? "P" : "p");
    block.classList.add("pawn");
  });

  King.forEach((block) => {
    block.classList.add(block.classList.contains("a") ? "I" : "i");
    block.classList.add("king");
  });
};

ChessPawns();

const Play = (current) => {
  let block = current.target;

  possibleClick.forEach((move) => {
    if (block.classList.contains(`${move}`)) {
      let Current = document.getElementsByClassName("AbleToMove");
      if (Current.length === 1) {
        table.forEach((block) => {
          block.classList.remove("WhiteRoad");
          block.classList.remove("WhiteX1");
          block.classList.remove("WhiteF");
          block.classList.remove("WhiteY");
          block.classList.remove("WhiteB");
          block.classList.remove("WhiteQ");
          block.classList.remove("WhiteR");
          block.classList.remove("WhiteN");
          block.classList.remove("Attack");
        });
        Current[0].classList.remove("AbleToMove");
      }
      block.classList.add("AbleToMove");
    }
  });

  let AbleToMoveBlock = table.filter((item) =>
    item.classList.contains("AbleToMove")
  );

  if (AbleToMoveBlock) {
    GlobalPawnClick = block;

    let {
      blockUpOne,
      blockUpTwo,
      AttackLeft,
      AttackRight,
    } = PawnBlockDetection(block);

    if (block.classList.contains("pawn")) {
      if (parseFloat(block.dataset.id) === 1) {
        CheckPawnOne(blockUpOne, blockUpTwo, AttackLeft, AttackRight, block);
        CheckPawnTwo(blockUpOne, blockUpTwo, AttackLeft, AttackRight, block);
      } else {
        CheckPawnOne(blockUpOne, blockUpTwo, AttackLeft, AttackRight, block);
      }
    }

    if (block.classList.contains("king")) {
      CheckCollision(block);
    }

    if (block.classList.contains("knight")) {
      KnightCollision(block);
    }

    if (block.classList.contains("queen")) {
      let id = block.id;
      CreateXAxisForQueen(block);
      CreateYAxisForQueen(block);
      ControlXaxis(block, id);
      ControlYaxis(block);
    }

    if (block.classList.contains("bishop")) {
      CreateXAxisForQueen(block);
      CreateYAxisForQueen(block);
    }

    if (block.classList.contains("rook")) {
      let id = block.id;
      ControlXaxis(block, id);
      ControlYaxis(block);
    }

    TakeColiderId = AbleToMoveBlock[0] && AbleToMoveBlock[0].classList[4];

    AbleToMoveBlock = CreateRook(block, AbleToMoveBlock);

    AbleToMoveBlock = CreateQueen(block, AbleToMoveBlock);

    AbleToMoveBlock = CreateBishop(block, AbleToMoveBlock);

    AbleToMoveBlock = CreateKnight(block, AbleToMoveBlock);

    AbleToMoveBlock = CreateKing(block, AbleToMoveBlock);

    AbleToMoveBlock = ControlUserPawns(block, AbleToMoveBlock);
  }
};

const CreateRook = (block, AbleToMoveBlock) => {
  if (block.classList.contains("WhiteX1")) {
    let DataSet = parseFloat(AbleToMoveBlock[0].dataset.r);

    table[block.id - 1].dataset.r = DataSet;

    DeleteDoubleBlockCopy(AbleToMoveBlock);
    if (GlobalCheck(AbleToMoveBlock)) {
      for (let i = 0; i < detectRook.length; i++) {
        block.classList.add("a", "rook", `${TakeColiderId}`);
      }
    }

    AbleToMoveBlock = [];
    table[block.id - 1].classList.add("rook");

    table.forEach((block) => {
      block.classList.remove("WhiteX1");
    });

    block.classList.add(block.classList.contains("a") ? "R" : "r");

    DeleteAttack();
  }
  return AbleToMoveBlock;
};

const CreateKing = (block, AbleToMoveBlock) => {
  if (block.classList.contains("WhiteB")) {
    DeleteDoubleBlockCopy(AbleToMoveBlock);

    if (GlobalCheck(AbleToMoveBlock)) {
      table[block.id - 1].classList.add("a", "I", "king");
      AbleToMoveBlock = [];
    }

    table[block.id - 1].classList.add("i", "king");

    if (block.classList.contains("king")) {
      table.forEach((block) => block.classList.remove("WhiteB"));
    }

    DeleteAttack();
  }
  return AbleToMoveBlock;
};

const CreateKnight = (block, AbleToMoveBlock) => {
  if (block.classList.contains("WhiteY")) {
    let DataSet = parseFloat(AbleToMoveBlock[0].dataset.k);

    DeleteDoubleBlockCopy(AbleToMoveBlock);

    table[block.id - 1].dataset.k = DataSet;

    if (GlobalCheck(AbleToMoveBlock)) {
      table[block.id - 1].classList.add("a", "knight");
      AbleToMoveBlock = [];
    }

    table[block.id - 1].classList.add("knight");
    table.forEach((block) => {
      block.classList.remove("WhiteY");
    });

    block.classList.add(block.classList.contains("a") ? "K" : "k");

    DeleteAttack();
  }
  return AbleToMoveBlock;
};

const CreateBishop = (block, AbleToMoveBlock) => {
  if (
    block.classList.contains("WhiteR") &&
    !block.classList.contains("queen")
  ) {
    let DataSet = parseFloat(AbleToMoveBlock[0].dataset.b);

    DeleteDoubleBlockCopy(AbleToMoveBlock);

    table[block.id - 1].dataset.b = DataSet;

    if (GlobalCheck(AbleToMoveBlock)) {
      table[block.id - 1].classList.add("a", "B", "bishop");
    }

    AbleToMoveBlock = [];
    table[block.id - 1].classList.add("b", "bishop");

    table.forEach((block) => block.classList.remove("WhiteR"));

    DeleteAttack();
  }
  return AbleToMoveBlock;
};

const CreateQueen = (block, AbleToMoveBlock) => {
  if (
    block.classList.contains("WhiteF") ||
    block.classList.contains("WhiteN")
  ) {
    DeleteDoubleBlockCopy(AbleToMoveBlock);

    if (GlobalCheck(AbleToMoveBlock)) {
      table[block.id - 1].classList.add("a", "Q", "queen");
    }

    AbleToMoveBlock = [];

    table[block.id - 1].classList.add("q", "queen");
    table.forEach((block) => {
      block.classList.remove("WhiteR");
      block.classList.remove("WhiteF");
      block.classList.remove("WhiteN");
    });

    DeleteAttack();
  }
  return AbleToMoveBlock;
};

const ControlUserPawns = (block, AbleToMoveBlock) => {
  if (block.classList.contains("WhiteRoad")) {
    let DataSet = parseFloat(AbleToMoveBlock[0].dataset.p);

    DeleteDoubleBlockCopy(AbleToMoveBlock);

    table[block.id - 1].dataset.p = DataSet;

    if (GlobalCheck(AbleToMoveBlock)) {
      table[block.id - 1].classList.add("a", "pawn");
      AbleToMoveBlock = [];
    }

    table[block.id - 1].classList.add("pawn");

    if (block.classList.contains("pawn")) {
      table.forEach((block) => {
        block.classList.remove("WhiteRoad");
      });
    }
    block.dataset.id = 0;
    block.classList.add(block.classList.contains("a") ? "P" : "p");

    DeleteAttack();
  }
  AbleToMoveBlock = [];
  return AbleToMoveBlock;
};

const DeleteTheSameBlock = (block) => {
  possibleClick.forEach((move) => {
    if (block.classList.contains(`${move}`)) {
      let Current = document.getElementsByClassName("AbleToMove");
      if (Current.length === 1) {
        table.forEach((block) => {
          block.classList.remove("WhiteRoad");
          block.classList.remove("WhiteX1");
          block.classList.remove("WhiteF");
          block.classList.remove("WhiteY");
          block.classList.remove("WhiteB");
          block.classList.remove("WhiteQ");
          block.classList.remove("WhiteR");
          block.classList.remove("WhiteN");
          block.classList.remove("Attack");
        });
        Current[0].classList.remove("AbleToMove");
      }
      block.classList.add("AbleToMove");
    }
  });
};

const ControlXaxis = (block, id) => {
  let { FindX2, FindXX2, Find } = FilterXaxis(block, id);

  FindX2.forEach((block) => {
    DetectQueenClick(block);
  });

  if (parseFloat(block.id) % ChessWidth !== 0) {
    Find.forEach((block) => {
      DetectQueenClick(block);
    });
  } else {
    FindXX2.forEach((block) => {
      DetectQueenClick(block);
    });
  }
};

const ControlYaxis = (block) => {
  let { filterY, FilterYY } = FilterYaxis(block);
  let queen = block.classList.contains("queen");
  DetectQueen = queen ? true : false;

  FilterYY.forEach((block) => {
    DetectQueenClick(block);
  });

  filterY.forEach((block) => {
    DetectQueenClick(block);
  });
};

const GlobalCheck = (AbleToMoveBlock) => {};

const CheckPawnTwo = (blockUpTwo, blockUpOne) => {};

const CheckPawnOne = (blockUpOne, blockUpTwo) => {};

const CheckCollision = (block) => {};

const PawnBlockDetection = (block) => {};

const GlobalAxis = (block) => {};

const Detect = (
  Up,
  UpLeft,
  UpRight,
  Right,
  Left,
  Down,
  DownRight,
  DownLeft
) => {};

const KnightCollision = (block) => {};

const DetectWalls = (
  block,
  knightBackRight,
  knightright,
  knightTopRight,
  knightleft,
  knightBackLeft,
  knightLeft,
  knightTopLeft
) => {};

const FilterXaxis = (block, id) => {};

const FilterYaxis = (block) => {};

const CreateYAxisForQueen = (block) => {};

const DetectYPartTwoQueenCollision = (
  SetCalculateA,
  block,
  DetectQueen,
  setA
) => {};

const DetectYQueenCollision = (SetCalculateB, block, DetectQueen, setB) => {};

const CreateXAxisForQueen = (block) => {};

const DetectFirstQueenCollision = (
  block,
  SetCalculateA,
  setA,
  DetectQueen
) => {};

const GlobalDetect = (block) => {};

const UpdateQueenColors = (block, DetectQueen) => {};

const DeleteDoubleBlockCopy = (AbleToMoveBlock) => {};

const DetectCollisionForUpPawns = (value, block, CollisionX2) => {};

const DetectBlockCollisionForPawns = (value, block, Collision) => {};

const DetectCopy = (value) => {};

const DetectCollision = (block) => {};

const DetectQueenClick = (block) => {
  let queen = block.classList.contains("queen");
  DetectQueen = queen ? true : false;

  if (DetectCollision(block)) {
    DetectQueen
      ? block.classList.remove("WhiteF")
      : block.classList.remove("WhiteX1");
  } else {
    DetectQueen
      ? block.classList.add("WhiteF")
      : block.classList.add("WhiteX1");
  }
};

const CheckA = (block) => block.classList.contains("a");

table.forEach((block) =>
  block.addEventListener("click", (block) => Play(block))
);
