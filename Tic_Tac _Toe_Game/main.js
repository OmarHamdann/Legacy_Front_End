var GAME = GAME || {
  gameInPlay: false,
  winCombos: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [7, 5, 3],
  ],
  timeOuts: [],
  initializeVars: function () {
    this.numFilledIn = 0;
    this.currentBoard = {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
    };
  },
  initializeGame: function () {
    GAME.initializeVars();
    GAME.display.drawBoard();
    $(".game-choice button").click(function () {
      GAME.secondPlayer = GAME.game.gameSelection(this);
      GAME.display.hideGameChoice();
      GAME.display.showGameStarter(GAME.secondPlayer);
      $(".game-starter .choose-x, .game-starter .choose-o")
        .off()
        .click(GAME.game.firstGame);

      $(".back-button").on("click", function () {
        GAME.display.hideGameStarter();
        GAME.display.showGameChoice();
      });
    });
    $(".hard-reset").on("click", GAME.game.resetGame);
  },
};

/*=========================
      Display functions
==========================*/
GAME.display = {
  hideGameStarter: function () {
    $(".game-starter").fadeOut();
  },

  showGameStarter: function (isTwoPlayer) {
    var message;
    message = "Would you like to be X or O?";

    GAME.timeOuts.push(
      setTimeout(function () {
        $(".game-starter").fadeIn(500).children("p").text(message);
      }, 700)
    );
  },

  showGameChoice: function () {
    $(".game-choice").fadeIn(600);
  },

  hideGameChoice: function () {
    $(".game-choice").fadeOut(600);
  },

  showPlayerOnePrompt: function () {
    if (GAME.secondPlayer) {
      $(".player-one-turn p").text("Go Player 1!");
    } else {
      $(".player-one-turn p").text("Your turn!");
    }
    $(".player-one-turn").animate({ top: "-45px" }, 500);
  },

  hidePlayerOnePrompt: function () {
    $(".player-one-turn").animate({ top: "0" }, 500);
  },

  showPlayerTwoPrompt: function () {
    if (GAME.secondPlayer) {
      $(".player-two-turn p").text("Go Player 2!");
    } else {
      $(".player-two-turn p").text("Computer's turn");
    }
    $(".player-two-turn").animate({ top: "-45px" }, 500);
  },

  hidePlayerTwoPrompt: function () {
    $(".player-two-turn").animate({ top: "0" }, 500);
  },

  showDrawMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $(".draw-message").fadeIn(500);
      }, 1500)
    );
  },

  hideDrawMessage: function () {
    $(".draw-message").fadeOut(1000);
  },

  showLoseMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $(".lose-message").fadeIn(500);
      }, 1500)
    );
  },

  hideLoseMessage: function () {
    $(".lose-message").fadeOut(1000);
  },

  showWinMessage: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        $(".win-message")
          .fadeIn(500)
          .children("p")
          .text("Player " + GAME.turn + " wins!! :D ");
      }, 1500)
    );
  },

  hideWinMessage: function () {
    $(".win-message").fadeOut(1000);
  },

  drawBoard: function () {
    GAME.timeOuts.push(
      setTimeout(function () {
        var c = document.getElementById("myCanvas");
        var canvas = c.getContext("2d");
        canvas.lineWidth = 1;
        canvas.strokeStyle = "#fff";
        //vertical lines
        canvas.beginPath();
        canvas.moveTo(100, 0);
        canvas.lineTo(100, 146.5);
        canvas.closePath();
        canvas.stroke();
        canvas.beginPath();
        canvas.moveTo(200, 0);
        canvas.lineTo(200, 146.5);
        canvas.closePath();
        canvas.stroke();

        // horizontal lines
        canvas.lineWidth = 0.5;

        canvas.beginPath();
        canvas.moveTo(4, 48.5);
        canvas.lineTo(296, 48.5);
        canvas.closePath();
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo(4, 98.5);
        canvas.lineTo(296, 98.5);
        canvas.closePath();
        canvas.stroke();
      }, 1500)
    );
  },

  resetSquares: function () {
    $(".boxes").html("");
    for (var i = 1; i <= 9; i++) {
      var box =
        '<li class="' + i + '"><i class="letter"><span></span></i></li>';
      $(box).appendTo($(".boxes"));
    }
  },
};

/*=========================
      Game Logic
==========================*/
GAME.game = {
  whoStarts: function () {
    var random = Math.floor(Math.random() * 2 + 1);
    return random;
  },
  gameSelection: function (item) {
    if ($(item).text() === "One Player") {
      // returns what secondPlayer value to set
      return false;
    } else {
      return true;
    }
  },
  firstGame: function () {
    GAME.playerOneSymbol = $(this).text();
    GAME.playerTwoSymbol = GAME.playerOneSymbol == "X" ? "O" : "X";
    GAME.turn = GAME.game.whoStarts();
    GAME.display.hideGameStarter();
    $("#myCanvas").animate({ opacity: "1" }, 1200);
    $(".hard-reset").fadeIn(600);
    GAME.display.resetSquares();
    GAME.game.play();
  },
  play: function () {
    GAME.gameInPlay = true;
    $(".boxes li").on("click", function () {
      GAME.game.playerTurn(this);
    });

    GAME.timeOuts.push(
      setTimeout(function () {
        if (GAME.turn === 1) {
          GAME.display.showPlayerOnePrompt();
        } else if (GAME.turn === 2) {
          GAME.display.showPlayerTwoPrompt();
        }
      }, 1500),
      setTimeout(function () {
        if (GAME.turn === 2 && !GAME.secondPlayer) {
          GAME.game.computerPlay();
        }
      }, 1200)
    );
  },
  playerTurn: function (square) {
    var symbol = GAME.turn === 1 ? GAME.playerOneSymbol : GAME.playerTwoSymbol;
    var box = $(square).children("i").children("span");
    if (
      box.text() === "" &&
      GAME.gameInPlay &&
      (GAME.turn === 1 || (GAME.turn === 2 && GAME.secondPlayer))
    ) {
      box.text(symbol);
      var number = $(square).attr("class");
      GAME.game.updateSquare(number, symbol);
      GAME.game.endTurn(symbol);
    }
  },
  computerPlay: function () {
    var computer = GAME.computer;
    //test computer move suggestion
    var boxNumber;
    if (computer.computerWhichMove(GAME.game) && GAME.turn === 2) {
      boxNumber = computer.computerWhichMove(GAME.game);
      var currentBox = $("." + boxNumber).children("i");

      var symbol = GAME.playerTwoSymbol;

      GAME.timeOuts.push(
        setTimeout(function () {
          currentBox.children("span").text(symbol);
          GAME.game.updateSquare(boxNumber, GAME.playerTwoSymbol);
          GAME.game.endTurn(symbol);
        }, 1000)
      );
    }
  },
  endTurn: function (symbol) {
    GAME.numFilledIn = GAME.numFilledIn + 1;
    if (GAME.gameInPlay) {
      if (GAME.game.checkWin(symbol)[0]) {
        if (GAME.secondPlayer) {
          GAME.display.showWinMessage();
        } else {
          GAME.turn === 1
            ? GAME.display.showWinMessage()
            : GAME.display.showLoseMessage();
        }
        GAME.gameInPlay = false;
        GAME.game.showWinningCombination();
        GAME.display.hidePlayerOnePrompt();
        GAME.display.hidePlayerTwoPrompt();
        GAME.game.reset();
      }
      // stop if it is a draw
      else if (GAME.numFilledIn >= 9) {
        GAME.gameInPlay = false;
        GAME.display.hidePlayerOnePrompt();
        GAME.display.hidePlayerTwoPrompt();
        GAME.display.showDrawMessage();
        GAME.turn = GAME.game.whoStarts();
        GAME.game.reset();
      } else {
        if (GAME.turn === 1) {
          GAME.display.hidePlayerOnePrompt();
          GAME.display.showPlayerTwoPrompt();
          GAME.turn = 2;
          // call computer turn if no second player
          if (!GAME.secondPlayer) {
            GAME.game.computerPlay();
          }
        } else if (GAME.turn === 2) {
          GAME.display.showPlayerOnePrompt();
          GAME.display.hidePlayerTwoPrompt();
          GAME.turn = 1;
        }
      }
    }
  },
  updateSquare: function (number, symbol) {
    GAME.currentBoard[number] = symbol;
  },
  checkWin: function (symbol) {
    var currentBoard = GAME.currentBoard;
    var wins = GAME.winCombos;
    var winningCombo = [];
    var winner = wins.some(function (combination) {
      var winning = true;
      for (var i = 0; i < combination.length; i++) {
        if (currentBoard[combination[i]] !== symbol) {
          winning = false;
        }
      }
      if (winning) {
        winningCombo = combination;
      }
      return winning;
    });
    return [winner, winningCombo];
  },
  showWinningCombination: function () {
    var symbol = GAME.turn === 1 ? GAME.playerOneSymbol : GAME.playerTwoSymbol;
    var combo = GAME.game.checkWin(symbol)[1];
    for (var i = 0; i < combo.length; i++) {
      var currentBox = "." + combo[i];
      // Black box and rotating test for winning combo
      $(currentBox)
        .children("i")
        .addClass("win")
        .children("span")
        .addClass("rotate");
    }
  },
  reset: function () {
    GAME.initializeVars();

    GAME.timeOuts.push(
      setTimeout(function () {
        GAME.display.hideDrawMessage();
        GAME.display.hideLoseMessage();
        GAME.display.hideWinMessage();
        $(".boxes li").fadeOut();
      }, 5000),
      setTimeout(function () {
        GAME.display.resetSquares();
        $(".boxes li").fadeIn();
        GAME.numFilledIn = 0;
      }, 6000),
      //Make sure time for next timeout is long enough
      //to not cause problems after first game
      setTimeout(function () {
        GAME.gameInPlay = true;
        GAME.game.play();
      }, 6000)
    );
  },
  resetGame: function () {
    $("#myCanvas").css("opacity", "0");
    $(".hard-reset").fadeOut();
    GAME.display.resetSquares();
    GAME.initializeVars();
    GAME.gameInPlay = false;
    GAME.playerOneSymbol = null;
    GAME.playerTwoSymbol = null;
    GAME.timeOuts.forEach(function (timer) {
      clearTimeout(timer);
    });
    $(".draw-message, .win-message, .lose-message").hide();
    GAME.display.hidePlayerOnePrompt();
    GAME.display.hidePlayerTwoPrompt();
    GAME.display.showGameChoice();
  },
};

/* End Game Logic */

/*================================
    Computer Move Decisions
=================================*/

GAME.computer = {
  computerWhichMove: function () {
    var move = this.winOrBlockChoice("win")[0];
    if (!move) {
      move = this.winOrBlockChoice("block")[0];
      console.log(this.winOrBlockChoice("block"));
    }
    if (!move) {
      move = this.doubleThreatChoice("win");
    }
    if (!move) {
      move = this.doubleThreatChoice("block");
    }
    if (!move) {
      move = this.firstPlay();
    }
    if (!move) {
      move = this.playCenter();
    }
    if (!move) {
      move = this.emptyCorner();
    }
    if (!move) {
      move = this.emptySide();
    }
    move = (move && GAME.currentBoard[move]) === "" ? move : false;
    return move;
  },

  winOrBlockChoice: function (choiceType, board) {
    var board = board || GAME.currentBoard;
    if (choiceType === "win") {
      var currentSymbol = GAME.playerTwoSymbol;
      var opponentSymbol = GAME.playerOneSymbol;
    } else if (choiceType === "block") {
      var currentSymbol = GAME.playerOneSymbol;
      var opponentSymbol = GAME.playerTwoSymbol;
    } else {
      return;
    }
    var moves = [];
    GAME.winCombos.forEach(function (combo) {
      var notFound = [];
      var notPlayer = true;
      for (var i = 0; i < combo.length; i++) {
        if (board[combo[i]] !== currentSymbol) {
          if (board[combo[i]] === opponentSymbol) {
            notPlayer = false;
          } else {
            notFound.push(combo[i]);
          }
        }
      }
      if (notFound.length === 1 && notPlayer) {
        var move = notFound[0];
        moves.push(move);
      }
    });
    return moves;
  },

  doubleThreatChoice: function (choiceType) {
    // use winChoice function to test a spot for double threat
    var board = GAME.currentBoard;
    var move;

    if (choiceType === "win") {
      var currentSymbol = GAME.playerTwoSymbol;
      var opponentSymbol = GAME.playerOneSymbol;
    } else if (choiceType === "block") {
      var currentSymbol = GAME.playerOneSymbol;
      var opponentSymbol = GAME.playerTwoSymbol;
    }

    // forced diagonal win on 4th move prevention
    if (board[5] === currentSymbol && GAME.numFilledIn === 3) {
      if (
        (board[1] === opponentSymbol && board[9] === opponentSymbol) ||
        (board[3] === opponentSymbol && board[7] === opponentSymbol)
      ) {
        // Play an edge to block double threat
        move = this.emptySide();
      }
    }

    if (!move && board[5] === opponentSymbol && GAME.numFilledIn === 2) {
      move = this.diagonalSecondAttack();
    }

    if (!move) {
      // clone current board;
      var testBoard = $.extend({}, board);
      for (var i = 1; i <= 9; i++) {
        testBoard = $.extend({}, board);
        if (testBoard[i] === "") {
          testBoard[i] = currentSymbol;
          if (this.winOrBlockChoice(choiceType, testBoard).length >= 2) {
            move = i;
          }
        }
      }
    }
    return move || false;
  },

  diagonalSecondAttack: function () {
    var board = GAME.currentBoard;
    var comp = GAME.playerTwoSymbol;
    var corners = [1, 3, 7, 9];
    for (var i = 0; i < corners.length; i++) {
      if (board[corners[i]] === comp) {
        return 10 - corners[i];
      }
    }
  },

  firstPlay: function () {
    var board = GAME.currentBoard;
    var corners = [1, 3, 7, 9];
    var move;
    if (GAME.numFilledIn === 1) {
      // player plays center
      if (board[5] === GAME.playerOneSymbol) {
        var cornerNum = Math.floor(Math.random() * 4 + 1);
        move = [1, 3, 7, 9][cornerNum];
      }
      //player plays corner, play opposite corner
      else {
        for (var i = 0; i < corners.length; i++) {
          if (GAME.currentBoard[corners[i]] === GAME.playerOneSymbol) {
            move = 5;
          }
        }
      }
    } else if (GAME.numFilledIn === 0) {
      var cornerNum = Math.floor(Math.random() * corners.length + 1);
      move = corners[cornerNum];
    }
    return move ? move : false;
  },

  playCenter: function () {
    if (GAME.currentBoard[5] === "") {
      return 5;
    }
  },
  emptyCorner: function () {
    var board = GAME.currentBoard;
    var corners = [1, 3, 7, 9];
    var move;
    for (var i = 0; i < corners.length; i++) {
      if (board[corners[i]] === "") {
        move = corners[i];
      }
    }
    return move || false;
  },

  emptySide: function () {
    var sides = [2, 4, 6, 8];
    for (var i = 0; i < sides.length; i++) {
      if (GAME.currentBoard[sides[i]] === "") {
        return sides[i];
      }
    }
    return false;
  },
};

/* End Computer Move Decisions */

$(document).ready(function () {
  GAME.initializeGame();
});

/* end game initialization */
