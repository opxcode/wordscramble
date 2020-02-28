  //1.Create objects

  //1.1 pick random dice and side on gridgame
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  //English 25 dice ver: https://boardgames.stackexchange.com/questions/29264/boggle-what-is-the-dice-configuration-for-boggle-in-various-languages
  const dice = [
    ['Q', 'B', 'Z', 'J', 'X', 'K'],
    ['T', 'O', 'U', 'O', 'T', 'O'],
    ['O', 'V', 'W', 'R', 'G', 'R'],
    ['O', 'V', 'W', 'R', 'G', 'R'],
    ['A', 'A', 'A', 'F', 'S', 'R'],
    ['A', 'U', 'M', 'E', 'E', 'G'],
    ['H', 'H', 'L', 'R', 'D', 'O'],
    ['N', 'H', 'D', 'T', 'H', 'O'],
    ['L', 'H', 'N', 'R', 'O', 'D'],
    ['A', 'F', 'A', 'I', 'S', 'R'],
    ['Y', 'I', 'F', 'A', 'S', 'R'],
    ['T', 'E', 'L', 'P', 'C', 'I'],
    ['S', 'S', 'N', 'S', 'E', 'U'],
    ['R', 'I', 'Y', 'P', 'R', 'H'],
    ['D', 'O', 'R', 'D', 'L', 'N'],
    ['C', 'C', 'W', 'N', 'S', 'T'],
    ['T', 'T', 'O', 'T', 'E', 'M'],
    ['S', 'C', 'T', 'I', 'E', 'P'],
    ['E', 'A', 'N', 'D', 'N', 'N'],
    ['M', 'N', 'N', 'E', 'A', 'G'],
    ['U', 'O', 'T', 'O', 'W', 'N'],
    ['A', 'E', 'A', 'E', 'E', 'E'],
    ['Y', 'I', 'F', 'P', 'S', 'R'],
    ['E', 'E', 'E', 'E', 'M', 'A'],
    ['I', 'T', 'I', 'T', 'I', 'E'],
    ['E', 'T', 'I', 'L', 'I', 'C']
  ];
  //array to store selected dice
  let diceArray = []
  //store selected dice
  const generateLetters = () => {
    let diceIndex = getRandomInt(dice.length - 1);
    let diceSelected = dice[diceIndex];
    let letter = diceSelected[getRandomInt(5)];
    diceArray.push(diceSelected);
    dice.splice(diceIndex, 1);
    return letter;
  }
  //1.2 gamegrid
  //Function to select size of gamegrid
  //Default size: 4X4

  const createGameGrid = (width, height) => {
    //create squares in grid
    //starting position
    let row = 1
    let col = 1
    for (i = 0; i < width * height; i++) {
      let $square = $("<div>");
      //add styling
      //bootstrap badge badge-dark
      $square.addClass("square badge badge-dark");
      let squareid = ("r" + row + "c" + col);
      $square.attr("id", squareid);
      //create div to store text;
      let $txtbox = $("<div>");
      //add styling
      $txtbox.addClass("letters");
      //add random letters
      $txtbox.text(generateLetters());
      //append squares
      $square.append($txtbox);
      $("#gamegrid").append($square);
      col += 1;
      if (col == width + 1) {
        row += 1;
        col = 1;
      }

    }
  };

  $(() => {
    //displaygrid
    createGameGrid(4, 4);
  });
  //Point system
  //object
  let point = {
    wordLength: {
      //Tier1
      1: "0",
      2: "1", //-1
      3: "2", //-1
      4: "4", //+0
      //Tier2
      5: "6", //+1
      6: "8", //+2
      //Tier3
      7: "12", //+5
      8: "14", //+6
      9: "16", //+7
      //Tier4
      10: "20", //+10
      11: "23", //+12
      12: "26", //+14
      13: "29", //+16
      14: "32", //+18
      15: "35", //+20
      16: "38", //+22
    }
  };

//storage of highscore

let highscore1 = localStorage.getItem('highscore1');
let player1 = localStorage.getItem('player1');
let highscore2 = localStorage.getItem('highscore2');
let player2 = localStorage.getItem('player2');
let highscore3 = localStorage.getItem('highscore3');
let player3 = localStorage.getItem('player3');
if(highscore1 === null){
  localStorage.setItem('highscore1','0');
  localStorage.setItem('player1','');
}
if(highscore2 === null){
  localStorage.setItem('highscore2','0');
  localStorage.setItem('player2','');
}
if(player3 === null){
  localStorage.setItem('highscore3','');
  localStorage.setItem('player3','');
}

  // console.log(diceArray);
  // console.log(dice);

  //2.Game Functions

  //2.1 Array to store selection
  let wordArray = [];
  let divArray = [];
  let playerWords = [];
  let playerScore = 0;


  //2.2 Convert Array to string
  let word = "";

  const formWord = (array) => {
    word = array.join('');
    return word;
  };

  function checkDictionary(inputText) {
    //console.log(inputText);
    return new Promise(function(resolve, reject) {
      let isWord = "";
      let method = "lookup";
      //TODO: API does not look at tenses of word
      let finalString = "https://dictionary.yandex.net/api/v1/dicservice.json/" +
        method + "?key=dict.1.1.20191009T115409Z.ea7b02076aabe05b.f10e337203eb2b12ffcc41b5f89a27c44d90e5cb&lang=en-en&text=" + inputText;
      if (inputText != "") {
        $.ajax({
          url: finalString
        }).then(
          (data) => {
            if ((data.def.length) > 0) {
              isWord = "Y";
              //console.log(isWord);
              resolve(isWord);
              // return isWord;
            } else {
              isWord = "N";
              resolve(isWord);
              // return isWord;
            }
          })
      }
    });
  }
  //2.3 Game function of selecting adjacent and non repeated squares
  const addinWordArray = (letter, id) => {
    let prevId = divArray[divArray.length - 1];
    //add first selection
    if (divArray.length == 0) {
      divArray.push(id);
      wordArray.push(letter);
    } else {
      //check if div already selected
      if (divArray.indexOf(id) === -1 &&
        //adjacent div logic
        //row
        (id.substring(1, 2) == (prevId.substring(1, 2) * 1 + 1) ||
          id.substring(1, 2) == (prevId.substring(1, 2) * 1 - 1) ||
          id.substring(1, 2) == (prevId.substring(1, 2) * 1)) &&
        //col
        (id.substring(3) == (prevId.substring(3) * 1 + 1) ||
          id.substring(3) == (prevId.substring(3) * 1 - 1) ||
          id.substring(3) == (prevId.substring(3) * 1))) {

        divArray.push(id);
        wordArray.push(letter);
      }
    }
  };


document.getElementsByClassName('letters').ontouchstart= () => {
    if (document.getElementById('pause').innerText === "||") {
      isDown = true; // When mouse goes down, set isDown to true
      event.currentTarget.parentElement.classList.remove("badge-dark");
      event.currentTarget.parentElement.classList.add("badge-info");
      let letter = event.currentTarget.innerText;
      let selectedid = event.currentTarget.parentElement.getAttribute("id");
      console.log(letter);
      addinWordArray(letter, selectedid);
      document.getElementById('word').classList.remove("wordwrong");
      document.getElementById('word').classList.remove("wordcorrect");
      document.getElementById('word').classList.add("wordtype");
      document.getElementById('word').innerText = formWord(wordArray);
      console.log(wordArray);
    }
  };

      document.getElementsByClassName('letters').ontouchmove= (event) => {
        if (isDown && document.getElementById('pause').innerText === "||") { // Only active if mouse is down
          let letter = event.currentTarget.innerText;
          let selectedid = event.currentTarget.parentElement.getAttribute("id");
          //Bootstrap style
          event.currentTarget.parentElement.classList.remove("badge-dark");
          event.currentTarget.parentElement.classList.add("badge-info");
          console.log(letter);
          addinWordArray(letter, selectedid);
          document.getElementById('word').innerText = formWord(wordArray);
          console.log(wordArray);
        }
      };

      document.getElementsByClassName('letters').ontouchend = function() {
          if (document.getElementById('pause').innerText === "||") {
            isDown = false; // When mouse goes up, set isDown to false
            let newWord = formWord(wordArray);
            console.log(newWord);
            document.getElementsByClassName('square').classList.remove("badge-info badge-dark");
            document.getElementsByClassName('square').classList.add("badge-dark");
            //clear arrays after input word
            wordArray = [];
            divArray = [];
            let isWordPromise = checkDictionary(newWord);
            isWordPromise.then(isWord => {
              if (isWord == "Y" && playerWords.indexOf(newWord) == -1 && newWord.length > 1) {
                playerWords.push(newWord);
                let newWordLength = newWord.length;
                let score = (point.wordLength[newWordLength]) * 1;
                playerScore += score;
                document.getElementById('word').classList.remove("wordtype");
                document.getElementById('word').classList.add("wordcorrect");

              document.getElementById('score').innerText= playerScore;

                  document.getElementById('score').animate({
                  height: '+=10px',
                  width: '+=40px'
                });
                  document.getElementById('score').animate({
                  height: '-=10px',
                  width: '-=40px'
                });
                console.log(playerWords);
                console.log(playerScore);
              } else {
                document.getElementById('word').classList.remove("wordtype");
                document.getElementById('word').classList.add("wordwrong");
              }
            });
          }
          document.getElementById('inputword').innerText =playerWords;

        }
      ;
  $(() => {
    //start jquery
    //eventlistener for squares to select letters and form word
    //2.4a Click/Drag - Desktop
    let isDown = false; // Tracks status of mouse button
    $(".letters").mousedown(() => {
      if ($("#pause").text() === "||") {
        isDown = true; // When mouse goes down, set isDown to true
        $(event.currentTarget).parent().removeClass("badge-dark");
        $(event.currentTarget).parent().addClass("badge-info");
        let letter = $(event.currentTarget).text();
        let selectedid = $(event.currentTarget).parent().attr("id");
        console.log(letter);
        addinWordArray(letter, selectedid);
        $("#word").removeClass("wordwrong");
        $("#word").removeClass("wordcorrect");
        $("#word").addClass("wordtype");
        $("#word").text(formWord(wordArray));
        console.log(wordArray);
      }
    })

    $(".letters").mouseover((event) => {
      if (isDown && $("#pause").text() === "||") { // Only active if mouse is down
        let letter = $(event.currentTarget).text();
        let selectedid = $(event.currentTarget).parent().attr("id");
        //Bootstrap style
        $(event.currentTarget).parent().removeClass("badge-dark");
        $(event.currentTarget).parent().addClass("badge-info");
        console.log(letter);
        addinWordArray(letter, selectedid);
        $("#word").text(formWord(wordArray));
        console.log(wordArray);
      }
    });

    $(".square").mouseup(function() {
        if ($("#pause").text() === "||") {
          isDown = false; // When mouse goes up, set isDown to false
          let newWord = formWord(wordArray);
          console.log(newWord);
          $(".square").removeClass("badge-info badge-dark ");
          $(".square").addClass("badge-dark");
          //clear arrays after input word
          wordArray = [];
          divArray = [];
          let isWordPromise = checkDictionary(newWord);
          isWordPromise.then(isWord => {
            if (isWord == "Y" && playerWords.indexOf(newWord) == -1 && newWord.length > 1) {
              playerWords.push(newWord);
              let newWordLength = newWord.length;
              let score = (point.wordLength[newWordLength]) * 1;
              playerScore += score;
              $("#word").removeClass("wordtype");
              $("#word").addClass("wordcorrect");
              $("#score").text(playerScore);
              $("#score").animate({
                height: '+=10px',
                width: '+=40px'
              });
              $("#score").animate({
                height: '-=10px',
                width: '-=40px'
              });
              console.log(playerWords);
              console.log(playerScore);
            } else {
              $("#word").removeClass("wordtype");
              $("#word").addClass("wordwrong");
            }
          });
        }
        $("#inputword").text(playerWords);
      }
    );

        //2.4b  KeyPress - Mobile
    // Tracks status of mouse button

    //2.4c  KeyPress - Desktop
    //select words


    let keyAllocation4x4 = {
      51: "r1c1", //3
      52: "r1c2", //4
      53: "r1c3", //5
      54: "r1c4", //6
      69: "r2c1", //e
      82: "r2c2", //r
      84: "r2c3", //t
      89: "r2c4", //y
      68: "r3c1", //d
      70: "r3c2", //f
      71: "r3c3", //g
      72: "r3c4", //h
      67: "r4c1", //c
      86: "r4c2", //v
      66: "r4c3", //b
      78: "r4c4" //n
    };

    $(document).on("keyup", (event) => {
      if ($("#pause").text() === "||") {
        let keycode = event.keyCode;
        let selectedid = keyAllocation4x4[keycode];
        //$(keyAllocation4x4[keycode]).attr("id");
        let letter = $("#" + selectedid).children().text();
        console.log(letter);
        if (selectedid !== undefined) {
          $("#" + selectedid).removeClass("badge-dark");
          $("#" + selectedid).addClass("badge-info");
          $("#word").removeClass("wordwrong");
          $("#word").removeClass("wordcorrect");
          $("#word").addClass("wordtype");
          console.log(letter);
          addinWordArray(letter, selectedid);
          $("#word").text(formWord(wordArray));
        }
      }
    });

    //input words for validation on center
    $(document).on("keyup", (event) => {
      if (event.keyCode == "13" && $("#pause").text() === "||") {
        $(".square").removeClass("badge-info badge-dark ");
        $(".square").addClass("badge-dark");
        formWord(wordArray);
        //clear arrays after input word
        let newWord = formWord(wordArray);
        console.log(newWord);
        $("#word").text(newWord);
        //clear arrays after input word
        wordArray = [];
        divArray = [];
        let isWordPromise = checkDictionary(newWord);
        isWordPromise.then(isWord => {
          if (isWord == "Y" && playerWords.indexOf(newWord) == -1 && newWord.length > 1) {
            playerWords.push(newWord);
            let newWordLength = newWord.length;
            let score = (point.wordLength[newWordLength]) * 1;
            playerScore += score;
            $("#word").removeClass("wordtype");
            $("#word").addClass("wordcorrect");
            $("#score").text(playerScore);
            $("#score").animate({
              height: '+=10px',
              width: '+=40px'
            });
            $("#score").animate({
              height: '-=10px',
              width: '-=40px'
            });
            console.log(playerWords);
            console.log(playerScore);
          } else {
            $("#word").removeClass("wordtype");
            $("#word").addClass("wordwrong");
          }
        })
      }
    });

    //2.5 Timer
    let time = 2*60;
    let timeLimit = time;
    let countlimit = time + 1;
    let count = 0;

    let countDown = () => {
      if (timeLimit >= 0) {
        let min = Math.floor(timeLimit / 60);
        if (min.toString().length < 2) {
          min = "0" + min
        };
        let sec = timeLimit % 60;
        if (sec.toString().length < 2) {
          sec = "0" + sec
        };
        $("#timeLimit").text(min + ":" + sec);
        timeLimit--;
        count++;
      }
      if (count >= countlimit) {
        $(".mainContainer").remove()
        $(".gameinfo").remove()
        let $div = $("<div>");
        let $div2 = $("<div>");
        let $div3 = $("<div>");
        let $div4 = $("<div>");
        let $div5 = $("<div>");
          let $div6 = $("<div>");
            let $div7 = $("<div>");
        let $button = $("<button>");
        $div.addClass("grid badge grid ");
        highscore1 = (localStorage.getItem('highscore1'))*1;
        highscore2 = (localStorage.getItem('highscore2'))*1;
        highscore3 = (localStorage.getItem('highscore3'))*1;
        player1 = localStorage.getItem('player1');
        player2 = localStorage.getItem('player2');
        player3 = localStorage.getItem('player3');
       let playername = window.location.search.slice(1).split("=")[1];
        if(playerScore>highscore1){
            localStorage.setItem('highscore1',playerScore);
            localStorage.setItem('player1',playername);
              localStorage.setItem('highscore2',highscore1);
              localStorage.setItem('player2',player1);
              localStorage.setItem('highscore3',highscore2);
              localStorage.setItem('player3',player2);
            $div2.text("New High Score:" + playerScore);
          }
        else{$div2.text("Score:" + playerScore)};
        $div2.addClass("gamescore");
        $div.append($div2);
        $button.addClass("btn restart");
        $button.text("Restart");
        $button.click(function() {
          location.reload(true)
        });
        $div4.text("High Scores");
        $div.append($div4);
        highscore1 = (localStorage.getItem('highscore1'))*1;
        highscore2 = (localStorage.getItem('highscore2'))*1;
        highscore3 = (localStorage.getItem('highscore3'))*1;
        player1 = localStorage.getItem('player1');
        player2 = localStorage.getItem('player2');
        player3 = localStorage.getItem('player3');
        $div5.text(player1 + ":"+highscore1 )
        $div6.text(player2 + ":"+highscore2 )
        $div7.text(player3 + ":"+highscore3 )
        $div.append($div5)
        $div.append($div6)
        $div.append($div7)
        $div3.addClass("restart");
        $div3.append($button);
        $('body').append($div);
        $('body').append($div3);
        clearInterval(setTimer);
      }
    };

    let setTimer = setInterval(countDown, 1000);

    $("#pause").click(
      (event) => {
        let togText = $(event.currentTarget).text();
        if (togText === "||") {
          clearInterval(setTimer);
          $(event.currentTarget).text("|>");
        }
        if (togText === "|>") {
          setTimer = setInterval(countDown, 1000);
          $(event.currentTarget).text("||");
        }
      }
    );
  });
