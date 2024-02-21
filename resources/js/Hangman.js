class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.word = ""; // Current word to guess
    this.guesses = []; // Array to store guessed letters
    this.isOver = false; // Flag to indicate if the game is over
    this.didWin = false; // Flag to indicate if the player won
    this.maxWrongGuesses = 6; // Maximum allowed wrong guesses
    this.wrongGuesses = 0; // Counter for wrong guesses
  }

  /**
   * This function takes a difficulty string as a parameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://it3049c-hangman.fly.dev?difficulty=easy
   * To get an medium word: https://it3049c-hangman.fly.dev?difficulty=medium
   * To get an hard word: https://it3049c-hangman.fly.dev?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
  getRandomWord(difficulty) {
    return fetch(
      `https://it3049c-hangman.fly.dev?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is received from the API.
   */
  start(difficulty, next) {
    this.clearCanvas();
    this.drawBase();
    this.guesses = [];
    this.isOver = false;
    this.didWin = false;
    this.wrongGuesses = 0;
    this.getRandomWord(difficulty).then((word) => {
      this.word = word.toUpperCase(); // Convert word to uppercase for consistency
      next();
    });
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    if (!letter || !/[a-zA-Z]/.test(letter) || letter.length !== 1) {
      throw new Error("Invalid guess");
    }

    letter = letter.toUpperCase();

    if (this.guesses.includes(letter)) {
      throw new Error("Letter already guessed");
    }

    this.guesses.push(letter);

    if (!this.word.includes(letter)) {
      this.onWrongGuess();
    } else {
      this.checkWin();
    }
  }

  checkWin() {
    const remaining = this.word.split('').filter(letter => !this.guesses.includes(letter)).length;
    if (remaining === 0) {
      this.didWin = true;
      this.isOver = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    this.wrongGuesses++;
    if (this.wrongGuesses === this.maxWrongGuesses) {
      this.isOver = true;
    }

    switch (this.wrongGuesses) {
      case 1:
        this.drawHead();
        break;
      case 2:
        this.drawBody();
        break;
      case 3:
        this.drawLeftArm();
        break;
      case 4:
        this.drawRightArm();
        break;
      case 5:
        this.drawLeftLeg();
        break;
      case 6:
        this.drawRightLeg();
        this.isOver = true;
        this.didWin = false;
        break;
      default:
        break;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the un-guessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    return this.word.split('').map(letter => this.guesses.includes(letter) ? letter : '_').join(' ');
  }

  /**
   * This function returns a string of all the previous guesses, separated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    return `(Guesses: ${this.guesses.join(', ')})`;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    this.ctx.beginPath();
    this.ctx.arc(250, 70, 20, 0, Math.PI * 2); // Head
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.fillRect(245, 90, 10, 80); // Body
  }

  drawLeftArm() {
    this.ctx.beginPath();
    this.ctx.moveTo(245, 100);
    this.ctx.lineTo(220, 140);
    this.ctx.stroke(); // Left arm
  }

  drawRightArm() {
    this.ctx.beginPath();
    this.ctx.moveTo(255, 100);
    this.ctx.lineTo(280, 140);
    this.ctx.stroke(); // Right arm
  }

  drawLeftLeg() {
    this.ctx.beginPath();
    this.ctx.moveTo(245, 170);
    this.ctx.lineTo(220, 220);
    this.ctx.stroke(); // Left leg
  }

  drawRightLeg() {
    this.ctx.beginPath();
    this.ctx.moveTo(255, 170);
    this.ctx.lineTo(280, 220);
    this.ctx.stroke(); // Right leg
  }

}
