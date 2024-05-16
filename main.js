import readlineSync from "readline-sync";

//  MEMORY GAME FOR 2 PLAYERS

// Elements

class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
  enterPlayerName() {
    const name = readlineSync.question("Player 1, please enter your name: ");
    return name;
  }
}

class Board {
  constructor([a, b, c, d, e, f]) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  }
}

class Tile {
  constructor(symbol, isRevealed) {
    this.symbol = `[  ${symbol}  ]`;
    this.isRevealed = isRevealed;
  }
}

const symbols = [
  "@",
  "€",
  "$",
  "*",
  "§",
  "%",
  "&",
  "#",
  "?",
  "!",
  "+",
  "~",
  "7",
  "3",
  "9",
];

//  Functionality
const createPlayers = () => {
  const player1Name = readlineSync.question(
    "Player 1, please enter your name: "
  );
  console.log(`Thank you ${player1Name}. Please take a seat!`);
  const player1 = new Player(player1Name, 0);
  const player2Name = readlineSync.question(
    "Player 2, please enter your name: "
  );
  console.log(`Thank you ${player2Name}. Let's play!`);
  const player2 = new Player(player2Name, 0);
  return player1, player2;
};

const shuffleTiles = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRows = (array) => {
  let rows = [];
  for (let i = 0; i < array.length; i += 5) {
    let row = array.slice(i, i + 5);
    rows.push(row);
  }
  return rows;
};

const setNewBoard = () => {
  const unshuffled = [];
  for (let sym of symbols) {
    const tileA = new Tile(sym, false);
    const tileB = new Tile(sym, false);
    unshuffled.push(tileA, tileB);
  }
  const shuffled = shuffleTiles(unshuffled);
  const board = new Board(getRows(shuffled));
  console.log(board);
};

//  Game Flow

const startGame = () => {
  console.clear();
  //createPlayers();
  setNewBoard();
};

startGame();
