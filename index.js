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
    1;
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

const GlobalCheck = (AbleToMoveBlock) => {
  return AbleToMoveBlock[0].classList.contains("a") && AbleToMoveBlock[1]
    ? AbleToMoveBlock[1].classList.contains("a")
    : "" || AbleToMoveBlock[0].classList.contains("a");
};

const CheckPawnTwo = (
  blockUpOne,
  blockUpTwo,
  AttackLeft,
  AttackRight,
  block
) => {
  if (DetectCollision(blockUpOne)) {
    blockUpTwo.classList.remove("WhiteRoad");
    blockUpOne.classList.remove("WhiteRoad");
  } else {
    blockUpOne.classList.add("WhiteRoad");
  }

  if (DetectCollision(blockUpTwo) || DetectCollision(blockUpOne)) {
    blockUpTwo.classList.remove("WhiteRoad");
  } else {
    blockUpTwo.classList.add("WhiteRoad");
  }

  DetectAttackForPawns(AttackLeft, AttackRight, block);
};

const CheckPawnOne = (
  blockUpOne,
  blockUpTwo,
  AttackLeft,
  AttackRight,
  block
) => {
  if (DetectCollision(blockUpOne)) {
    blockUpTwo.classList.remove("WhiteRoad");
    blockUpOne.classList.remove("WhiteRoad");
  } else {
    blockUpOne.classList.add("WhiteRoad");
  }

  DetectAttackForPawns(AttackLeft, AttackRight, block);
};

const CheckCollision = (block) => {
  let {
    Up,
    UpLeft,
    UpRight,
    Right,
    Left,
    Down,
    DownRight,
    DownLeft,
  } = GlobalAxis(block);

  Detect(Up, UpLeft, UpRight, Right, Left, Down, DownRight, DownLeft, block);
};

const PawnBlockDetection = (block) => {
  let blockUpOne = CheckA(block)
    ? table[parseFloat(block.id) - 1 + 8]
    : table[parseFloat(block.id) - 1 - 8];
  let blockUpTwo = CheckA(block)
    ? table[parseFloat(block.id) - 1 + 16]
    : table[parseFloat(block.id) - 1 - 16];

  //Attack
  let AttackLeft = CheckA(block)
    ? table[parseFloat(block.id) - 2 + 8]
    : table[parseFloat(block.id) - 2 - 8];

  let AttackRight = CheckA(block)
    ? table[parseFloat(block.id) + 8]
    : table[parseFloat(block.id) - 8];

  return { blockUpOne, blockUpTwo, AttackLeft, AttackRight };
};

const GlobalAxis = (block) => {
  let Up = CheckA(block)
    ? table[parseFloat(block.id) - 1 + 8]
    : table[parseFloat(block.id) - 1 - 8];

  let UpLeft = CheckA(block)
    ? table[parseFloat(block.id) - 1 + 7]
    : table[parseFloat(block.id) - 1 - 7];

  let UpRight = CheckA(block)
    ? table[parseFloat(block.id) - 1 + 9]
    : table[parseFloat(block.id) - 1 - 9];

  let Right = CheckA(block)
    ? table[parseFloat(block.id) - 1 + 1]
    : table[parseFloat(block.id) - 1 + 1];

  let Left = CheckA(block)
    ? table[parseFloat(block.id) - 1 - 1]
    : table[parseFloat(block.id) - 1 - 1];

  let Down = CheckA(block)
    ? table[parseFloat(block.id) - 1 - 8]
    : table[parseFloat(block.id) - 1 + 8];

  let DownRight = CheckA(block)
    ? table[parseFloat(block.id) - 1 - 7]
    : table[parseFloat(block.id) - 1 + 7];

  let DownLeft = CheckA(block)
    ? table[parseFloat(block.id) - 1 - 9]
    : table[parseFloat(block.id) - 1 + 9];
  return { Up, UpLeft, UpRight, Right, Left, Down, DownRight, DownLeft };
};

const Detect = (
  Up,
  UpLeft,
  UpRight,
  Right,
  Left,
  Down,
  DownRight,
  DownLeft,
  block
) => {
  DetectCollision(Up) ? DetectAttack(Up, block) : Up.classList.add("WhiteB");

  DetectCollision(UpLeft)
    ? DetectAttack(UpLeft, block)
    : UpLeft.classList.add("WhiteB");

  DetectCollision(UpRight)
    ? DetectAttack(UpRight, block)
    : UpRight.classList.add("WhiteB");

  DetectCollision(Right)
    ? DetectAttack(Right, block)
    : Right.classList.add("WhiteB");

  DetectCollision(Left)
    ? DetectAttack(Left, block)
    : Left && Left.classList.add("WhiteB");

  if (Down) {
    DetectCollision(Down)
      ? DetectAttack(Down, block)
      : Down.classList.add("WhiteB");
  }
  if (DownRight) {
    DetectCollision(DownRight)
      ? DetectAttack(DownRight, block)
      : DownRight.classList.add("WhiteB");
  }
  if (DownLeft) {
    DetectCollision(DownLeft)
      ? DetectAttack(DownLeft, block)
      : DownLeft.classList.add("WhiteB");
  }

  if (Right.id % ChessWidth === 2) {
    UpLeft.classList.remove("WhiteB");
    UpRight.classList.remove("WhiteB");
    Left && Left.classList.remove("WhiteB");
    DownRight && DownRight.classList.remove("WhiteB");
  }

  if (Right.id % ChessWidth === 1) {
    Right.classList.remove("WhiteB");
    DownLeft && DownLeft.classList.remove("WhiteB");
    DownRight && DownRight.classList.remove("WhiteB");
    UpRight.classList.remove("WhiteB");
    UpLeft.classList.remove("WhiteB");
  }
};

const KnightCollision = (block) => {
  let knightTopLeft = CheckA(block)
    ? table[block.id - 2 + 16]
    : table[block.id - 3 - 15];

  let knightTopRight = CheckA(block)
    ? table[block.id - 1 + 17]
    : table[block.id - 1 - 15];

  let knightleft = CheckA(block)
    ? table[block.id - 1 + 6]
    : table[block.id - 1 - 10];

  let knightright = CheckA(block)
    ? table[block.id - 1 - 17]
    : table[block.id - 1 - 6];

  let knightBackLeft = CheckA(block)
    ? table[block.id - 1 - 10]
    : table[block.id - 1 + 6];

  let knightBackRight = CheckA(block)
    ? table[block.id - 1 + 10]
    : table[block.id - 1 + 10];

  let knightLeft = CheckA(block)
    ? table[block.id - 1 - 15]
    : table[block.id - 1 + 15];

  let knightRight = CheckA(block)
    ? table[block.id - 1 - 6]
    : table[block.id - 1 + 17];

  DetectCollision(knightTopLeft)
    ? DetectAttack(knightTopLeft, block)
    : knightTopLeft && knightTopLeft.classList.add("WhiteY");

  DetectCollision(knightTopRight)
    ? DetectAttack(knightTopRight, block)
    : knightTopRight && knightTopRight.classList.add("WhiteY");

  DetectCollision(knightleft)
    ? DetectAttack(knightleft, block)
    : knightleft && knightleft.classList.add("WhiteY");

  DetectCollision(knightright)
    ? DetectAttack(knightright, block)
    : knightright && knightright.classList.add("WhiteY");

  DetectCollision(knightBackRight)
    ? DetectAttack(knightBackRight, block)
    : knightBackRight && knightBackRight.classList.add("WhiteY");

  DetectCollision(knightLeft)
    ? DetectAttack(knightLeft, block)
    : knightLeft && knightLeft.classList.add("WhiteY");

  DetectCollision(knightTopRight)
    ? DetectAttack(knightTopRight, block)
    : knightTopRight && knightTopRight.classList.add("WhiteY");

  DetectCollision(knightBackLeft)
    ? DetectAttack(knightBackLeft, block)
    : knightBackLeft && knightBackLeft.classList.add("WhiteY");

  DetectCollision(knightRight)
    ? DetectAttack(knightRight, block)
    : knightRight && knightRight.classList.add("WhiteY");

  DetectWalls(
    block,
    knightBackRight,
    knightright,
    knightRight,
    knightTopRight,
    knightleft,
    knightBackLeft,
    knightLeft,
    knightTopLeft
  );
};

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

const FilterXaxis = (block, id) => {
  let CalculateX = parseFloat(block.id) % ChessWidth;
  let FilterX = table.filter(
    (item) => parseFloat(item.id) % ChessBoard >= 0 && parseFloat(item.id) >= id
  );
  FilterX.length = widthX - CalculateX;

  let Collision = new Set();
  let CollisionX2 = new Set();

  let FilterX2 = table.filter(
    (item) =>
      parseFloat(item.id) +
        (parseFloat(block.id) % ChessWidth) +
        CalculateXXaxis +
        ChessBoard >=
        id && parseFloat(item.id) <= id
  );

  for (let value of FilterX) {
    DetectBlockCollisionForPawns(value, block, Collision);
  }

  DetectAttack([...Collision][0] && [...Collision][0], block);

  let Find = table.filter((item) => {
    let ItemID = parseFloat(item.id);
    let collision = parseFloat([...Collision][0] && [...Collision][0].id);

    return (
      (ItemID % ChessBoard >= 0 && ItemID >= id && ItemID <= collision) ||
      ([...Collision].length === 0 && ItemID >= id)
    );
  });
  Find.length = widthX - CalculateX;

  let FilterXX = table.filter(
    (item) =>
      parseFloat(item.id) +
        (parseFloat(block.id) % ChessWidth) +
        CalculateXXaxis >=
        id && parseFloat(item.id) <= id
  );

  for (let value of FilterX2) {
    DetectCollisionForUpPawns(value, block, CollisionX2);
  }

  DetectAttack(
    [...CollisionX2].reverse()[0] && [...CollisionX2].reverse()[0],
    block
  );

  for (let value of FilterXX) {
    DetectCollisionForUpPawns(value, block, CollisionX2);
  }

  let Reverse =
    [...CollisionX2].reverse()[0] && [...CollisionX2].reverse()[0].id;

  let FindX2 = table.filter((item) => {
    let ItemId = parseFloat(item.id);

    return (
      (ItemId + (parseFloat(id) % ChessWidth) + CalculateXXaxis >= id &&
        ItemId >= parseFloat(Reverse) &&
        ItemId <= id) ||
      ([...CollisionX2].length === 0 &&
        ItemId + (parseFloat(block.id) % ChessWidth) + CalculateXXaxis >= id &&
        ItemId <= id)
    );
  });

  let FindXX2 = table.filter((item) => {
    let ItemId = parseFloat(item.id);

    return (
      (ItemId + (parseFloat(id) % ChessWidth) + CalculateXXaxis + ChessBoard >=
        id &&
        ItemId >= parseFloat(Reverse) &&
        ItemId <= id) ||
      ([...CollisionX2].length === 0 &&
        ItemId +
          (parseFloat(block.id) % ChessWidth) +
          CalculateXXaxis +
          ChessBoard >=
          id &&
        ItemId <= id)
    );
  });

  return { FindX2, FindXX2, Find };
};

const FilterYaxis = (block) => {
  let Collision = new Set();
  let CollisionX2 = new Set();

  let filterCollision = table.filter((item) => {
    let ItemId = parseFloat(item.id);
    let BlockId = block.id;

    return (
      ItemId % 8 === (parseFloat(BlockId) % ChessWidth) + CalculateXXaxis + 1 &&
      ItemId >= BlockId
    );
  });

  let FilterCollisionUp = table.filter((item) => {
    let ItemId = parseFloat(item.id);
    let BlockId = block.id;

    return (
      ItemId % 8 === (parseFloat(BlockId) % ChessWidth) + CalculateXXaxis + 1 &&
      ItemId <= BlockId
    );
  });

  for (let value of filterCollision) {
    DetectBlockCollisionForPawns(value, block, Collision);
  }

  DetectAttack([...Collision][0] && [...Collision][0], block);

  for (let value of FilterCollisionUp) {
    DetectCollisionForUpPawns(value, block, CollisionX2);
  }

  DetectAttack(
    [...CollisionX2].reverse()[0] && [...CollisionX2].reverse()[0],
    block
  );

  let filterY = table.filter((item) => {
    let collision =
      [...CollisionX2].reverse()[0] && [...CollisionX2].reverse()[0].id;
    let ItemId = parseFloat(item.id);
    let BlockId = block.id;

    return (
      (ItemId % 8 ===
        (parseFloat(collision) % ChessWidth) + CalculateXXaxis + 1 &&
        ItemId > collision &&
        ItemId < BlockId) ||
      ([...CollisionX2].length === 0 &&
        ItemId % 8 ===
          (parseFloat(BlockId) % ChessWidth) + CalculateXXaxis + 1 &&
        ItemId <= BlockId)
    );
  });

  let FilterYY = table.filter((item) => {
    let collision = [...Collision][0] && [...Collision][0].id;
    let ItemId = parseFloat(item.id);
    let BlockId = block.id;

    return (
      (ItemId % 8 ===
        (parseFloat(collision) % ChessWidth) + CalculateXXaxis + 1 &&
        ItemId < collision &&
        ItemId > BlockId) ||
      ([...Collision].length === 0 &&
        ItemId % 8 ===
          (parseFloat(BlockId) % ChessWidth) + CalculateXXaxis + 1 &&
        ItemId >= BlockId)
    );
  });

  return { filterY, FilterYY };
};

const CreateYAxisForQueen = (block) => {
  let { SetCalculateB, setB, SetCalculateA, setA, DetectQueen } = GlobalDetect(
    block
  );

  //!bottom
  let HalfXXYAxis = table.filter(
    (item) =>
      parseFloat(item.id) % 7 === (block.id % 7) - CalculateXXaxis - 1 &&
      block.id % ChessWidth !== 64 &&
      parseFloat(item.id) >= block.id
  );

  for (let i = 0; i < HalfXXYAxis.length; i++) {
    let check = parseFloat(HalfXXYAxis[i].id);

    if (check % ChessBoard === 1) {
      SetCalculateA = HalfXXYAxis[i].id;
      HalfXXYAxis[i].dataset.s = HalfXXYAxis[i].id;
    }

    if (!HalfXXYAxis[i].dataset.s) {
      setA.add(HalfXXYAxis[i]);
    }
  }
  //!TOP
  let HalfXYAxis = table.filter((item) => {
    return (
      parseFloat(item.id) % 7 === (block.id % 7) - CalculateXXaxis - 1 &&
      block.id % ChessWidth !== 0 &&
      parseFloat(item.id) <= block.id
    );
  });

  for (let i = 0; i < HalfXYAxis.length; i++) {
    let check = parseFloat(HalfXYAxis[i].id);

    if (check % ChessBoard <= 0 && check !== 1) {
      SetCalculateB = HalfXYAxis[i].id;
      HalfXYAxis[i].dataset.n = HalfXYAxis[i].id;
    }

    if (!HalfXYAxis[i].dataset.n) {
      setB.add(HalfXYAxis[i]);
    }
  }
  //BOTOM

  let BL = block;
  DetectYPartTwoQueenCollision(SetCalculateA, BL, DetectQueen, setA);

  //UP
  DetectYQueenCollision(SetCalculateB, BL, DetectQueen, setB);
};

const DetectYPartTwoQueenCollision = (
  SetCalculateA,
  block,
  DetectQueen,
  setA
) => {};

const DetectYQueenCollision = (SetCalculateB, block, DetectQueen, setB) => {};

const CreateXAxisForQueen = (block) => {};

const DetectYPartTwoQueenCollision = (
  SetCalculateA,
  block,
  DetectQueen,
  setA
) => {
  let queen = block.classList.contains("queen");
  DetectQueen = queen ? true : false;
  let CollisionX2 = new Set();
  let Collision = new Set();

  let FindDataSetS = table.filter(
    (item) => parseFloat(item.id) === parseFloat(SetCalculateA)
  );

  if (FindDataSetS.length > 0) {
    let Find = table.filter(
      (item) =>
        parseFloat(item.id) >= block.id &&
        parseFloat(item.id) % 7 === (block.id % 7) - CalculateXXaxis - 1 &&
        block.id % ChessWidth !== 64 &&
        parseFloat(item.id) <= parseFloat(FindDataSetS[0].id) &&
        parseFloat(item.id) >= block.id
    );

    for (let value of Find) {
      DetectBlockCollisionForPawns(value, block, Collision);
    }

    DetectAttack([...Collision][0] && [...Collision][0], block);

    let DetectCollision = table.filter((item) => {
      let ItemId = parseFloat(item.id);
      let collision = parseFloat([...Collision][0] && [...Collision][0].id);

      let BlockId = block.id;
      let DataSet = parseFloat(FindDataSetS[0].id);

      return (
        (ItemId % 7 === (BlockId % 7) - CalculateXXaxis - 1 &&
          BlockId % ChessWidth !== 64 &&
          ItemId <= collision &&
          ItemId >= BlockId) ||
        ([...Collision].length === 0 &&
          ItemId % 7 === (BlockId % 7) - CalculateXXaxis - 1 &&
          BlockId % ChessWidth !== 64 &&
          ItemId <= DataSet &&
          ItemId >= BlockId)
      );
    });

    DetectCollision.forEach((block) => {
      UpdateQueenColors(block, DetectQueen);
    });
  } else {
    let DataSet = [...setA];

    for (let value of DataSet) {
      DetectCollisionForUpPawns(value, block, CollisionX2);
    }

    DetectAttack([...CollisionX2][0] && [...CollisionX2][0], block);

    let DetectSetCollision = table.filter((item) => {
      let ItemId = parseFloat(item.id);
      let collision = parseFloat([...CollisionX2][0] && [...CollisionX2][0].id);
      let BlockId = parseFloat(block.id);

      return (
        (ItemId % 7 === (collision % 7) - CalculateXXaxis - 1 &&
          ItemId > BlockId &&
          ItemId < collision) ||
        (CollisionX2.size === 0 &&
          ItemId % 7 === (BlockId % 7) - CalculateXXaxis - 1 &&
          BlockId % ChessWidth !== 64 &&
          ItemId >= BlockId)
      );
    });

    DetectSetCollision.forEach((block) =>
      UpdateQueenColors(block, DetectQueen)
    );
  }
};

const GlobalDetect = (block) => {
  let queen = block.classList.contains("queen");
  let SetCalculateA = "";
  let SetCalculateB = "";
  let setA = new Set();
  let setB = new Set();
  DetectQueen = queen ? true : false;

  return { SetCalculateB, setB, SetCalculateA, setA, DetectQueen };
};

const UpdateQueenColors = (block, DetectQueen) => {
  if (DetectCollision(block)) {
    DetectQueen
      ? block.classList.remove("WhiteN")
      : block.classList.remove("WhiteR");
  } else {
    DetectQueen ? block.classList.add("WhiteN") : block.classList.add("WhiteR");
  }
};

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
