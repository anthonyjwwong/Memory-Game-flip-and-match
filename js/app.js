//View
'use strict'

const deck = document.querySelector('.deck');

let symbols = ['fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor','fa-anchor', 'fa-cube', 'fa-cube' , 'fa-bicycle',
'fa-bicycle', 'fa-diamond', 'fa-diamond', 'fa-bolt' , 'fa-bolt', 'fa-leaf', 'fa-leaf', 'fa-bomb', 'fa-bomb'];


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let board = {
  createDeck() {
    //Create a variable that holds the symbols array
    let cards = shuffle(symbols);

    //Creates a board
    for (let card of symbols) {
      //Creating a Li and I class to append//
      let cardList = document.createElement('li');
      let cardClass = document.createElement('i');
      //Adding the classes.
      cardList.className += 'card';
      cardClass.className += 'fa ' + card;
      //Finish up the appending
      cardList.appendChild(cardClass);
      deck.appendChild(cardList);
    }
  }
}
//Initialize the deck
board.createDeck();


//Model
let gameStarted = false;
let cards_opened = [];
let card_matched_arr = [];
let moves_made = 0;
let moves = document.querySelector('.moves');
let stars = document.querySelectorAll('.fa-star-o');
let timeShown = document.querySelector('.timeShown');


let game_logic = {
  //Tracker for whether the game has started//
  game_start() {
    if (gameStarted === false) {
      gameStarted = true;
      timerStart();
    }

  },
  //Check for card flipped
  card_flipped(ele) {

    //if none of the cards are opened
      if (cards_opened.length === 0) {
        this.game_start();
        //open the first card on clicked;
        ele.classList.add('open', 'locked');
        //and push it on the cards_opened Array;
        cards_opened.push(ele);

    //else if one card is opened
      } else if (cards_opened.length === 1) {
        //open the card
        ele.classList.toggle('open');
        //push it onto the cards_openedArray;
        cards_opened.push(ele);
        //keep track of the moves made
        moves_made++;
        moves.innerHTML = moves_made;

        //While tracking moves, if moves are pass a certain number, stars decreases//
        if (moves_made > 21 && moves_made < 31) {
          stars[0].classList.remove('fa-star-o')
          stars[0].classList.add('fa-star');
        } else if (moves_made > 30) {
          stars[1].classList.remove('fa-star-o')
          stars[1].classList.add('fa-star');
        }
        //Match the cards
        this.card_matched();
      }

  },
  //checks for card Matched
  card_matched() {
      //if the cards matches
      if (cards_opened[0].lastChild.classList[1] === cards_opened[1].lastChild.classList[1]) {
        //add class match to them both that they match
        cards_opened[0].classList.toggle('match');
        cards_opened[1].classList.toggle('match');
        //push both cards into card_matched array;
        card_matched_arr.push(cards_opened[0]);
        card_matched_arr.push(cards_opened[1]);
        //reset cards_opened;
        cards_opened = [];
        if (card_matched_arr.length === 16) {
          //Pause the time
          timerPause();
          //End Modal pops up
          modalEnd();

          let end_star = document.querySelector('.endStar');
          let modal_moves = document.querySelector('.modalMoves');
          modal_moves.innerHTML = moves.innerHTML;
          timeShown.innerHTML = output.innerHTML;
          //Determines the amount of star awarded
          if (moves_made > 21 && moves_made < 31) {
            end_star.innerHTML = '&#x2606 &#x2606;';
          } else if (moves_made> 30) {
            end_star.innerHTML = '&#x2606';
          } else {
            end_star.innerHTML = '&#x2606 &#x2606 &#x2606'
          }
        }


        //Else if the cards doesn't match
      } else if (cards_opened[0].lastChild.classList[1] !== cards_opened[1].lastChild.classList[1]){
        //set time out for the cards to close after 1.5s
        this.card_not_matched();
  }
},
  //what happens if card doesn't match//
  card_not_matched() {
    //if card doesn't match, flip everything back
    //reset cards_opened ;
    setTimeout(function() {
      cards_opened[0].classList.remove('open', 'locked');
      cards_opened[1].classList.toggle('open');
      cards_opened = [];
    }, 1000);
  },

  //resets everything
  reset() {
    moves_made = 0;
    moves.innerHTML = 0;
    timeReset();
    gameStarted = false;

    for (let i = 0; i < card_matched_arr.length; i++) {
      card_matched_arr[i].classList.remove('open');
      card_matched_arr[i].classList.remove('locked');
      card_matched_arr[i].classList.remove('match');

    }
    card_matched_arr = [];
    stars[0].className = 'fa fa-star-o';
    stars[1].className = 'fa fa-star-o';
  }


}


let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("close");
let endStar = document.querySelector('.endStar');
let modalMoves = document.querySelector('.modalMoves');
let endModal = document.getElementById('endModal');
//Modal pops up when users loads into the game
window.onload = function modalUsed() {
  modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal || event.target == endModal) {
        modal.style.display = 'none';
        endModal.style.display = 'none';
    }
}
//This portion is for the modal that pops up after the game ends.
function modalEnd() {
  endModal.style.display = 'block';
}

/**  TIMER **/
let time = 0;
let running = 0;
let output = document.getElementById('output');

function timerStart() {
  if(running == 0) {
    running = 1;
    increment();
  }
}

function timerPause() {
  running = 0;
}

function timeReset() {
  running =0;
  time = 0;
  output.innerHTML = '00:00:00';
}

function increment() {
  if(running == 1) {
    setTimeout(function(){
      time++;
      let mins = Math.floor(time/10/60);
      let secs = Math.floor(time/10);
      let tenths = time % 10;

      if (mins < 10) {
        mins = '0' + mins;
      }

      if (secs < 10){
        secs= '0' + secs;
      }

    output.innerHTML = mins + ':' + secs + ':' + '0' + tenths;
      increment();
    }, 100);
  }
}


//Octo //EventListeners and etc
let cards_of_deck = document.querySelectorAll('.card');
let reset_button = document.querySelector('.fa-repeat');

for (let cards of cards_of_deck) {
  cards.addEventListener('click', function() {
    game_logic.card_flipped(cards);
  });
}

reset_button.addEventListener('click', function() {
  game_logic.reset();
});
