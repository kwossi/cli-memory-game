import readlineSync from "readline-sync";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";

//  MEMORY GAME FOR 2 PLAYERS
// test mode, change line  20 to 0

// Colors

let color1 = "#3EB489"; //former magenta :> mint
let color2 = "#C71585"; // former yellow :> purple
let color3 = "#FFD700"; // former cyan :> yellow
let color4 = "#32012F"; // dark purple for text

//  Classes

class Player {
  constructor(name) {
    this.name = name;
    this.score = 7.5;
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
      chalk.hex(color3)(`\t\t   1\t   2\t   3\t   4\t   5\n\n
      A:\t${this.a[0].display} ${this.a[1].display} ${this.a[2].display} ${this.a[3].display} ${this.a[4].display}\n
      B:\t${this.b[0].display} ${this.b[1].display} ${this.b[2].display} ${this.b[3].display} ${this.b[4].display}\n
      C:\t${this.c[0].display} ${this.c[1].display} ${this.c[2].display} ${this.c[3].display} ${this.c[4].display}\n
      D:\t${this.d[0].display} ${this.d[1].display} ${this.d[2].display} ${this.d[3].display} ${this.d[4].display}\n
      E:\t${this.e[0].display} ${this.e[1].display} ${this.e[2].display} ${this.e[3].display} ${this.e[4].display}\n
      F:\t${this.f[0].display} ${this.f[1].display} ${this.f[2].display} ${this.f[3].display} ${this.f[4].display}\n`)
    );
  }
}

class Tile {
  constructor(symbol, covered = chalk.bgHex(color1)("[     ]")) {
    this.symbol = chalk.bgHex(color2)(`[  ${symbol}  ]`);
    this.isRevealed = false;
    this.display = covered;
    this.covered = covered;
  }
  showTile() {
    this.display = this.symbol;
    this.isRevealed = true;
  }
  coverTile() {
    this.display = this.covered;
    this.isRevealed = false;
  }
}

class Game {
  constructor() {
    this.welcome = this.welcomeScreen();
    this.rules = this.showRules();
    this.player1 = this.createPlayer("Player 1");
    this.player2 = this.createPlayer("Player 2");
    this.board = this.setNewBoard();
    this.turnCount = 0;
    this.currentPlayer = this.updateCurrentPlayer();
    this.playGame = this.playGame();
  }

  //   Set up
  welcomeScreen() {
    console.clear();
    console.log(
      chalk.hex(color3)(
        `\tWelcome to \n\t${chalk.bgHex(color1)(
          `                                  `
        )}\n\t${chalk.bgHex(color2)(
          `                       ${chalk.hex(color1)("MEMOR-ICE")}  `
        )}\n\t\tThe coolest memory game for\n\t\t${chalk.bgHex(color1)(
          `                                                       `
        )}\n\t\t${chalk.bgHex(color2)(
          `                                           ${chalk.hex(color1)(
            "2 PLAYERS."
          )}  `
        )}\n`
      )
    );
    readlineSync.question(`\t\t\t${chalk.hex(color1)("Press enter to play!")}`);
  }

  showRules() {
    console.clear();
    console.log(
      chalk.hex(color4)(
        `\t${chalk.bgHex(color1)(
          "       • R U L E S •                    "
        )}\n\t${chalk.bgHex(color2)(
          "                                        "
        )}\n\n${chalk.bgHex(color3)(
          `\t• Players take turns flipping over two cards, \n\tone at a time, trying to find a matching pair.\n\n\t• If you find a matching pair, you score a point \n\tand go again!\n\n\t• The player with the most points wins!`
        )}\n\n`
      )
    );
    readlineSync.question(chalk.hex(color1)(`\t\t\tUnderstood!`));
    console.clear();
  }

  createPlayer(which) {
    let name = readlineSync.question(
      chalk.hex(color1)(`\t${which}, please enter your name: `)
    );
    console.log(chalk.hex(color3)(`\tThank you ${name}! Please take a seat!`));
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
      const tileA = new Tile(sym);
      const tileB = new Tile(sym);
      unshuffled.push(tileA, tileB);
    }
    const shuffled = this.shuffleTiles(unshuffled);
    const board = new Board(this.getRows(shuffled));
    return board;
  }

  //   game play functions
  showScore() {
    console.log(
      chalk.hex(color4)(
        `\n\n\t${chalk.bgHex(color1)(
          "Score:                       "
        )}\n\t${chalk.bgHex(color2)(
          "                             "
        )}\n\t${chalk.bgHex(color3)(this.player1.name)} ${chalk.white(
          this.player1.score
        )}\t${chalk.bgHex(color3)(this.player2.name)} ${chalk.white(
          this.player2.score
        )}\n\n`
      )
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
    let winner = this.getWinner();
    console.log(
      chalk.hex(color1)(
        `\tThe final score is:\n\t${this.player1.name}: ${this.player1.score} vs. ${this.player2.name}: ${this.player2.score}\n\tCongratulations`
      ) +
        `\n\t\t` +
        chalkAnimation.rainbow(winner) +
        chalk.hex(color1)`\n\tYou won the game!`
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
    if (tile && tile.isRevealed) {
      readlineSync.question(
        chalk.hex(color3)(`\tAlready revealed. Choose a different tile!`)
      );
    } else {
      return tile && tile.isRevealed !== true;
    }
  }

  getTile(input) {
    const [row, col] = input.split("");
    if (this.board?.[row]?.[+col - 1]) {
      return this.board[row][+col - 1];
    } else {
      console.log(chalk.hex(color3)(`\tInvalid input. Try again!`));
      return false;
    }
  }

  getInputs() {
    let currentTileA;
    let currentTileB;
    do {
      currentTileA = this.getTile(
        readlineSync.question(
          chalk.hex(color1)(
            `\tIt's ${chalk.hex(color4).bgHex(color3)(
              this.currentPlayer.name
            )}'s turn. Choose your first tile ( eg. a5): `
          )
        )
      );
    } while (!currentTileA || !this.verifyTile(currentTileA));
    currentTileA.showTile();
    this.displayAll();
    do {
      currentTileB = this.getTile(
        readlineSync.question(
          chalk.hex(color1)(
            `\t${chalk.hex(color4).bgHex(color3)(
              this.currentPlayer.name
            )}, please choose your second tile ( eg. c2): `
          )
        )
      );
      if (currentTileA === currentTileB) {
        readlineSync.question(`\tAlready chosen. Choose a different tile!`);
      }
    } while (!this.verifyTile(currentTileB) || currentTileA === currentTileB);
    currentTileB.showTile();
    this.displayAll();
    return [currentTileA, currentTileB];
  }

  checkForMatch(currentTiles) {
    if (currentTiles[0].symbol === currentTiles[1].symbol) {
      readlineSync.question(
        chalk.hex(color1)(
          `\tIt's a match!! ${chalk.hex(color4).bgHex(color3)(
            this.currentPlayer.name
          )} scores + 1 and goes again!`
        )
      );
      this.currentPlayer.scoreOne();
    } else {
      readlineSync.question(
        chalk.hex(color1)(`\tSorry, no match :( Next Player!`)
      );
      currentTiles[0].coverTile();
      currentTiles[1].coverTile();
      this.updateTurnCount();
    }
  }

  // game flow
  oneTurn() {
    this.displayAll();
    this.currentPlayer = this.updateCurrentPlayer();
    readlineSync.question(
      chalk.hex(color1)(
        `\tReady ${chalk.hex(color4).bgHex(color3)(
          this.currentPlayer.name
        )}? Press enter! `
      )
    );
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
