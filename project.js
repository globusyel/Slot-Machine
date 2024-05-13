const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const getInitialDeposit = () => {
  while (true) {
    const depositAmount = parseFloat(
      prompt("Enter your initial deposit amount: ")
    );
    if (isNaN(depositAmount) || depositAmount <= 0) {
      console.log("Invalid deposit amount. Please enter a valid amount.");
    } else {
      return depositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = parseInt(
      prompt("Enter the number of lines to bet on (1-3): ")
    );
    if (isNaN(lines) || lines < 1 || lines > 3) {
      console.log(
        "Invalid number of lines. Please enter a number between 1 and 3."
      );
    } else {
      return lines;
    }
  }
};

const getBetAmount = (balance, lines) => {
  while (true) {
    const bet = parseFloat(prompt("Enter your total bet amount: "));
    if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
      console.log("Invalid bet amount. Please enter a valid bet.");
    } else {
      return bet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const calculateWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    if (symbols.every((symbol) => symbol === symbols[0])) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const printSpinResult = (rows) => {
  rows.forEach((row) => console.log(row.join(" | ")));
};

const playGame = () => {
  let balance = getInitialDeposit();

  while (balance > 0) {
    console.log("You have a balance of $" + balance);

    const numberOfLines = getNumberOfLines();
    const bet = getBetAmount(balance, numberOfLines);

    balance -= bet * numberOfLines;

    const reels = spin();
    const rows = transpose(reels);

    printSpinResult(rows);

    const winnings = calculateWinnings(rows, bet, numberOfLines);
    balance += winnings;

    console.log("You won $" + winnings);

    const playAgain = prompt("Do you want to play again? (y/n): ");
    if (playAgain.toLowerCase() !== "y") {
      break;
    }
  }

  console.log("Game over. Your final balance is $" + balance);
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

playGame();
