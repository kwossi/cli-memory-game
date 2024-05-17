import readlineSync from "readline-sync";
import chalk from "chalk";

//  MEMORY GAME FOR 2 PLAYERS

//  Classes

class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
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
  showBoard() {
    console.log(
      `\t\t   1\t   2\t   3\t   4\t   5\n\n
      A:\t${this.a[0].display} ${this.a[1].display} ${this.a[2].display} ${this.a[3].display} ${this.a[4].display}\n
      B:\t${this.b[0].display} ${this.b[1].display} ${this.b[2].display} ${this.b[3].display} ${this.b[4].display}\n
      C:\t${this.c[0].display} ${this.c[1].display} ${this.c[2].display} ${this.c[3].display} ${this.c[4].display}\n
      D:\t${this.d[0].display} ${this.d[1].display} ${this.d[2].display} ${this.d[3].display} ${this.d[4].display}\n
      E:\t${this.e[0].display} ${this.e[1].display} ${this.e[2].display} ${this.e[3].display} ${this.e[4].display}\n
      F:\t${this.f[0].display} ${this.f[1].display} ${this.f[2].display} ${this.f[3].display} ${this.f[4].display}\n`
    );
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

class Game {
  constructor() {
    this.player1 = this.createPlayer("Player 1");
    this.player2 = this.createPlayer("Player 2");
    this.board = this.setNewBoard();
    this.turnCount = 0;
    this.currentPlayer = this.updateCurrentPlayer();
    this.playGame = this.playGame();
  }
  //   Set up
  createPlayer(which) {
    let name = readlineSync.question(`${which}, please enter your name: `);
    console.log(`Thank you ${name}! Please take a seat!`);
    return new Player(name);
  }

  shuffleTiles(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getRows(array) {
    let rows = [];
    for (let i = 0; i < array.length; i += 5) {
      let row = array.slice(i, i + 5);
      rows.push(row);
    }
    return rows;
  }

  setNewBoard() {
    const unshuffled = [];
    for (let sym of SYMBOLS) {
      const tileA = new Tile(sym, false);
      const tileB = new Tile(sym, false);
      unshuffled.push(tileA, tileB);
    }
    const shuffled = this.shuffleTiles(unshuffled);
    const board = new Board(this.getRows(shuffled));
    return board;
  }

  //   game play functions
  showScore() {
    console.log(
      `Score:\n\n${this.player1.name}: ${this.player1.score}\t${this.player2.name}: ${this.player2.score}\n\n`
    );
  }

  displayAll() {
    console.clear();
    this.board.showBoard();
    this.showScore();
  }

  getWinner() {
    return this.player1.score > this.player2.score
      ? this.player1.name
      : this.player2.name;
  }

  congratWinner() {
    console.log(
      `The final score is:\n${this.player1.name}: ${this.player1.score} vs. ${
        this.player2.name
      }: ${
        this.player2.score
      }\nCongratulations ${this.getWinner()}! You won the game!`
    );
  }

  // turn functions
  updateCurrentPlayer() {
    return this.turnCount % 2 === 0 ? this.player1 : this.player2;
  }

  updateTurnCount() {
    return this.turnCount++;
  }

  verifyTile(tile) {
    if (tile && tile.display !== "\x1B[43m[     ]\x1B[49m") {
      readlineSync.question(`Already revealed. Choose a different tile!`);
    } else {
      return tile.display === "\x1B[43m[     ]\x1B[49m";
    }
  }

  getTile(input) {
    const [row, col] = input.split("");
    if (this.board?.[row]?.[+col - 1]) {
      return this.board[row][+col - 1];
    } else {
      console.log(`Invalid input. Try again!`);
      return false;
    }
  }

  getInputs() {
    let currentTileA;
    let currentTileB;
    do {
      currentTileA = this.getTile(
        readlineSync.question(
          `It's ${this.currentPlayer.name}'s turn. Choose your first tile ( eg. a5): `
        )
      );
    } while (!currentTileA || !this.verifyTile(currentTileA));
    currentTileA.revealTile();
    this.displayAll();
    do {
      currentTileB = this.getTile(
        readlineSync.question(
          `${this.currentPlayer.name}, please choose your second tile ( eg. c2): `
        )
      );
      if (currentTileA === currentTileB) {
        readlineSync.question(`Already revealed. Choose a different tile!`);
      }
    } while (!this.verifyTile(currentTileB) || currentTileA === currentTileB);
    currentTileB.revealTile();
    this.displayAll();
    return [currentTileA, currentTileB];
  }

  checkForMatch(currentTiles) {
    if (currentTiles[0].symbol === currentTiles[1].symbol) {
      readlineSync.question(
        `It's a match!! ${this.currentPlayer.name} scores + 1 and goes again!`
      );
      this.currentPlayer.scoreOne();
    } else {
      readlineSync.question(`Sorry, no match :( Next Player!`);
      currentTiles[0].coverTile();
      currentTiles[1].coverTile();
      this.updateTurnCount();
    }
  }

  // game flow
  oneTurn() {
    this.displayAll();
    this.currentPlayer = this.updateCurrentPlayer();
    readlineSync.question(`Ready ${this.currentPlayer.name}? Press enter`);
    this.displayAll();
    let currentTiles = this.getInputs();
    this.checkForMatch(currentTiles);
  }

  playGame() {
    while (this.player1.score + this.player2.score < 15) {
      this.oneTurn();
    }
    this.congratWinner();
  }
}

//  Symbols for the memory tiles. Can be changed but not in number.
const SYMBOLS = [
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

console.clear();
const game = new Game();
