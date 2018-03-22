// global variables
var winCount = 0;
var loseCount = 0;
var timeBetween;

var hangman = {
names:["ajak", "blackheart", "chameleon", "debrii", "echo",
"famine", "gamora", "hellcat", "imperfects", "jigsaw", "kingpin", "lake",
"maddog", "nextwave", "orphan", "pandemic", "quasimodo", "random", "tattoo",
"sunspot", "ultimatum", "vindicator", "warstar", "yellowjacket", "zzzax" ], 

letters:["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n",
"o", "p", "q", "r", "s", "t","u", "v", "w", "x", "y", "z"],

lives: 10,
userInputs: [],
userInput: "",
computerName: "",
nameWithMatchedLetters: "",
computerNameLength: 0,
matchedLettersCount: 0,
gameOver:false,
winOrLose:false,


init: function() {
  this.lives = 10;
  this.userInputs = [];
  this.matchedLettersCount = 0;
  this.userInput = "";
  this.nameWithMatchedLetters = "";
  this.computerName = this.guessAName();
  this.computerNameLength = this.calculateNameLength();
  this.gameOver=false;
  this.winOrLose=false;    

  var initialNameToPrint = this.createInitialNameToPrint();
  this.printName(initialNameToPrint);

  // set elements
  document.querySelector("#loadingMessage").innerHTML = "";
  document.querySelector("#lives").innerHTML = this.lives;
  document.querySelector("#winCount").innerHTML = winCount;
  document.querySelector("#loseCount").innerHTML = loseCount;
  document.querySelector("#winLose").style.display = 'inline-block';
  document.querySelector("#hangman-img").src = 'assets/images/start.png';
  document.querySelector("#guesses").innerHTML=(this.userInputs);
},
    // proceed to hangman rules if user input is an alphabet
    startGame: function() {
      if (this.gameOver === false && this.isAlphabet()) {
          this.checkRules();
      }
    },

  // validate against game rules
  checkRules: function() {
      if (!this.checkInputAlreadyTried()) { // if letter is not tried
          this.pushToTriedValues(); // array for tried values
          this.printUserTriedInputs(); // prit user input

          if (!this.checkNameContainsUserInput()) { // if user entered letter is not in the name
              this.printLivesLeft();
              this.showHangmanImage();
              this.winLoseCountGameEnd(); //if lives zero set winCount                
              this.startNewOnGameOver();

          } else { // if user entered letter is in the name
              this.createNameWithMatchedLetters();
              this.winLoseCountGameEnd(); // if user answer is correct
              this.startNewOnGameOver();
              document.querySelector("#name").innerHTML = this.nameWithMatchedLetters;
          }
      }
  },

  // generate name randomly   
  guessAName: function() {
      var computerRandomNumber = Math.floor(Math.random() * this.names.length);
      return this.names[computerRandomNumber];
      console.log(this.computerName);
  },

    //check if input is a letter
    isAlphabet: function() {
    var pattern = /[a-z]/i;
    return this.userInput.match(pattern);
    },

  //calculate name length
  calculateNameLength: function() {
      return this.computerName.length;
  },

  // create string with all dashes to print on initial load
  createInitialNameToPrint: function() {
      var name = "";
      for (var i = 0; i < this.computerNameLength; i++) {
          name += '_ ';
      }
      this.nameWithMatchedLetters = name;
      return name;
  },

  // check to see if user already tried the input
  checkInputAlreadyTried: function() {
      if (this.userInputs.length !== 0) {
          var result = this.userInputs.indexOf(this.userInput) < 0 ? false : true;
          return result;
      } else {
          return false;
      }
  },

  // array for tried values
  pushToTriedValues: function() {
      this.userInputs.push(this.userInput);
      document.querySelector("#guesses").innerHTML=(this.userInputs);
  },

  //check if name contains the letter user entered
  checkNameContainsUserInput: function() {
      var contains = false;
      for (var i = 0; i < this.computerNameLength; i++) {
          if (this.computerName.charAt(i).toLowerCase() == this.userInput) {
              contains = true;
          }
      }
      return contains;
  },

  //replace dashes with letters
  createNameWithMatchedLetters: function() {
      for (var i = 0; i < this.computerNameLength; i++) {
          if (this.computerName.charAt(i).toLowerCase() == this.userInput) {
              if (i === 0) {
                  this.nameWithMatchedLetters = this.nameWithMatchedLetters.substring(0, i * 2) +
                      this.userInput.toLowerCase() + this.nameWithMatchedLetters.substring((i * 2 + 1));
              } else {
                  this.nameWithMatchedLetters = this.nameWithMatchedLetters.substring(0, i * 2) +
                      this.userInput.toLowerCase() + this.nameWithMatchedLetters.substring((i * 2 + 1));
              }
              this.matchedLettersCount++;
          }
      }
  },

  // print name
  printName: function(name) {
      document.querySelector("#name").innerHTML = name;
  },

  // print number of lives left
  printLivesLeft: function() {
      this.lives--;
      document.querySelector("#lives").innerHTML = this.lives;
  },

  // print users inputs
  printUserTriedInputs:function(){
    return this.userInputs;
  },

  // increment win/lose count by one
  winLoseCountGameEnd: function() {
      if (this.lives === 0) {
          loseCount++;
          this.gameOver = true;
          this.winOrLose = false;
      }

      if (this.matchedLettersCount == this.computerNameLength) {
          winCount++;
          this.winOrLose = true;
          this.gameOver = true;
      }
  },

  // creates new game
  startNewOnGameOver: function() {
    if (this.gameOver === true) {
        var status = "";
        document.querySelector("#winLose").style.display = 'none';

        if (this.winOrLose) {
            status += '<div class="message">You Won !!!</div>';
        } else {
            status += '<div class="message">You Lost !!!</div>';
        }
        status += '<div class="load">New Word will load in 4 seconds. ';

        document.querySelector("#loadingMessage").innerHTML = status;
        timeBetween = setTimeout(this.loadGame.bind(this), 4000);
    }
},

    // load new game
    loadGame: function() {
    this.init();
    },

  // shows hangman images
  showHangmanImage: function() {
      if (this.lives != 10) {
          document.querySelector("#hangman-img").src = "assets/images/hangman-" + (9 - this.lives) + ".png";
      } else {
          document.querySelector("#hangman-img").src = "assets/images/start.png";
      }
  },

}

// event listener
window.onload = function(event) {
      hangman.init();

      document.onkeyup = function(e) {
          hangman.userInput = String.fromCharCode(e.keyCode).toLowerCase();
          console.log(hangman.userInput);
          hangman.startGame();
      }        
  } //End window onload
;
