import readlineSync from "readline-sync";
import chalk from "chalk";

//  MEMORY GAME FOR 2 PLAYERS

// Elements

class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
  scoreOne() {
    this.score++;
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
  constructor(symbol, isRevealed, covered = chalk.bgYellow("[     ]")) {
    this.symbol = chalk.bgGreen(`[  ${symbol}  ]`);
    this.display = covered;
    this.isRevealed = isRevealed;
    this.covered = covered;
  }
  revealTile() {
    this.display = this.symbol;
  }
  coverTile() {
    this.display = this.covered;
  }
  tileFound() {
    this.isRevealed = true;
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
  const players = [player1, player2];
  return players;
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
  return board;
};

const showBoard = (board, player1, player2) => {
  console.log(
    `\t   1\t   2\t   3\t   4\t   5\n\n
    A:\t${board.a[0].display} ${board.a[1].display} ${board.a[2].display} ${board.a[3].display} ${board.a[4].display}\n
    B:\t${board.b[0].display} ${board.b[1].display} ${board.b[2].display} ${board.b[3].display} ${board.b[4].display}\n
    C:\t${board.c[0].display} ${board.c[1].display} ${board.c[2].display} ${board.c[3].display} ${board.c[4].display}\n
    D:\t${board.d[0].display} ${board.d[1].display} ${board.d[2].display} ${board.d[3].display} ${board.d[4].display}\n
    E:\t${board.e[0].display} ${board.e[1].display} ${board.e[2].display} ${board.e[3].display} ${board.e[4].display}\n
    F:\t${board.f[0].display} ${board.f[1].display} ${board.f[2].display} ${board.f[3].display} ${board.f[4].display}\n\n
    Score:\t${player1.name}: ${player1.score}\t ${player2.name}: ${player2.score}`
  );
};

// Game Play

const getCurrentPlayer = (turnCount, player1, player2) => {
  return turnCount % 2 === 0 ? player1 : player2;
};

const getTile = (tile, board) => {
  const [row, col] = tile.split("");
  return board[row][+col - 1];
};

const checkForMatch = (tileA, tileB, currentPlayer, turnCount) => {
  if (tileA.symbol === tileB.symbol) {
    console.log(
      `It's a match!! ${currentPlayer.name} scores + 1 and goes again!`
    );
    currentPlayer.scoreOne();
  } else {
    console.log(`Sorry, no match :( NEXXXTTT!!! `);
    tileA.coverTile();
    tileB.coverTile();
    turnCount++;
  }
  return turnCount;
};

const OneTurn = (board, turnCount, player1, player2) => {
  console.clear();
  showBoard(board, player1, player2);
  let currentPlayer = getCurrentPlayer(turnCount, player1, player2);

  //   choose Tile a
  let currentTileA = readlineSync.question(
    `It's ${currentPlayer.name}'s turn. Choose your first tile ( eg. a5): `
  );
  currentTileA = getTile(currentTileA, board);
  currentTileA.revealTile();
  console.clear();
  showBoard(board, player1, player2);

  //   choose Tile B
  let currentTileB = readlineSync.question(
    `Now, ${currentPlayer.name}, choose your second tile ( eg. c2): `
  );
  currentTileB = getTile(currentTileB, board);
  currentTileB.revealTile();
  console.clear();
  showBoard(board, player1, player2);

  //   Check for Match
  turnCount = checkForMatch(
    currentTileA,
    currentTileB,
    currentPlayer,
    turnCount
  );
  readlineSync.question(`Press enter for next round!`);
  return turnCount;
};

const gamePlay = (board, player1, player2, turnCount) => {
  do {
    turnCount = OneTurn(board, turnCount, player1, player2);
  } while (player1.score + player2.score < 15);
  return player1.score > player2.score ? player1 : player2;
};

//  Game Flow

const startGame = () => {
  console.clear();
  const [player1, player2] = createPlayers();
  const board = setNewBoard();
  let turnCount = 0;
  let winner = gamePlay(board, player1, player2, turnCount);
  console.log(
    `The final score is:\n${player1.name}: ${player1.score} vs. ${player2.name}: ${player2.score}\nCongratulations ${winner.name}! You won the game!`
  );
};

startGame();
