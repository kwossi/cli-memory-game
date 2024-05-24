import readlineSync from "readline-sync";
import chalk from "chalk";

//  MEMORY GAME FOR 2 PLAYERS
// Colors

let color1 = "#3EB489";
let color2 = "#C71585";
let color3 = "#FFD700";
let color4 = "#32012F";

//  Classes

class Player {
  constructor(name, score = 0) {
    this.name = name;
    this.score = score;
  }

  scoreOne() {
    this.score++;
  }

  static createPlayer(which) {
    let name = readlineSync.question(
      chalk.hex(color1)(`\t${which}, please enter your name: `)
    );
    console.log(chalk.hex(color3)(`\tThank you ${name}! Please take a seat!`));
    return new Player(name);
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
      chalk.hex(color3)(
        `\t\t   ` + this.a.map((_, index) => index + 1).join(`\t   `) + `\n`
      )
    );
    for (const [key, value] of Object.entries(this)) {
      console.log(
        chalk.hex(color3)(
          `\t${key.toUpperCase()}:\t${value
            .map((item) => item.display)
            .join(" ")}\n`
        )
      );
    }
  }

  static shuffleTiles(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static getRows(array) {
    let rows = [];
    for (let i = 0; i < array.length; i += 5) {
      let row = array.slice(i, i + 5);
      rows.push(row);
    }
    return rows;
  }

  static setNewBoard() {
    const unshuffled = [];
    for (let sym of SYMBOLS) {
      const tileA = new Tile(sym);
      const tileB = new Tile(sym);
      unshuffled.push(tileA, tileB);
    }
    const shuffled = Board.shuffleTiles(unshuffled);
    const board = new Board(Board.getRows(shuffled));
    return board;
  }
}

class Tile {
  constructor(symbol, covered = chalk.bgHex(color1).hex(color3)("[     ]")) {
    this.symbol = chalk.bgHex(color2).hex(color3)(`[  ${symbol}  ]`);
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
    this.player1 = Player.createPlayer("Player 1");
    this.player2 = Player.createPlayer("Player 2");
    this.board = Board.setNewBoard();
    this.turnCount = 0;
    this.currentPlayer = this.updateCurrentPlayer();
  }

  //   Set up
  static welcomeScreen() {
    console.clear();
    console.log(
      chalk.hex(color3)(
        `\tWelcome to \n\t${chalk.bgHex(color1)(
          `                                  `
        )}\n\t${chalk.bgHex(color2)(
          `                     ${chalk.hex(color1)("PIXEL PAIRS")}  `
        )}\n\n\t\tA memory game for\n\t\t${chalk.bgHex(color1)(
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

  static showRules() {
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

  //   game play functions
  showScore() {
    console.log(
      chalk.hex(color4)(
        `\n\t\t${chalk.bgHex(color1)(
          "Score:                                 "
        )}\n\t\t${chalk.bgHex(color2)(
          "                                       "
        )}\n\t\t${chalk.bgHex(color3)(this.player1.name)} ${chalk.white(
          this.player1.score
        )}\t\t${chalk.bgHex(color3)(this.player2.name)} ${chalk.white(
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
    return this.player1.score >= this.player2.score
      ? this.player1.name
      : this.player2.name;
  }

  congratWinner() {
    console.clear();
    console.log(chalk.hex(color1)(`\t\t\tGAME OVER`));
    this.showScore();
    console.log(
      chalk.hex(color1)(
        `\n\n\t\tCongratulations\n\n\t\t${chalk.hex(color4).bgHex(color3)(
          this.getWinner()
        )}\n\n\t\tYou won the game!\n\n`
      )
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
    if (input.length > 2) {
      console.log(chalk.hex(color3)(`\tInput too long. Try again!`));
      return false;
    } else if (this.board?.[row]?.[+col - 1]) {
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

  static playGame() {
    Game.welcomeScreen();
    Game.showRules();
    const game = new Game();
    readlineSync.question(chalk.hex(color1)(`\tContinue`));
    while (game.player1.score + game.player2.score < 15) {
      game.oneTurn();
    }
    game.congratWinner();
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
Game.playGame();
