// Dependencies.
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', 5000);
app.use('/', express.static(__dirname + '/'));

// Routing
app.get('/:name', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, () => {
  console.log('Starting server on port 5000...');
});

const COUNT_DOWN = 4;
let count = COUNT_DOWN;
// registered players
let interval;
let onlinePlayers = {};
let playingPlayers = {};
let gameStarted = false;

var warArray = [], playerHand = [], compHand = [];

// #region Game Events

io.on('connection', (socket) => {
  
    socket.on('disconnect', () => {
      console.log('disconnect');
      delete onlinePlayers[socket.id];
      if (playingPlayers[socket.id]) {
        // notify player disconnected
        io.sockets.emit('message', `${playingPlayers[socket.id].name} has logged out`);
        resetGameVariables();
      }
      //delete playingPlayers[socket.id];
    });
  
    socket.on('new_player', () => {
      onlinePlayers[socket.id] = {};
    });
  
    socket.on('player_ready', playerName => {
      console.log('player ready', playerName);
      if (!gameStarted) {
        playingPlayers[socket.id] = onlinePlayers[socket.id];
        playingPlayers[socket.id].name = playerName;
        playingPlayers[socket.id].deal = false;
  
        if (Object.keys(playingPlayers).length === 2 && !gameStarted) {
          // all ready, start count down
          fillArray();
          interval = setInterval(countDownTimer, 1000);
        }
      } else {
        socket.emit('message', 'Game had already started!');
      }
    });

    socket.on('deal_request', () => {
      playingPlayers[socket.id].deal = true;
      if (areReadyToDeal()) {
        deal();
        resetDealAttribute();
      }
    });
      
});

// #endregion Game Events

// #region Game Logic

function areReadyToDeal() {
  for (const key of Object.keys(playingPlayers)) {
    if (!playingPlayers[key].deal) {
      return false;
    }
  }
  return true;
}

function resetDealAttribute() {
  for (const key of Object.keys(playingPlayers)) {
    playingPlayers[key].deal = false;    
  }
}

function deal() {
  Object.keys(playingPlayers).forEach((socketId, index) => {
    switch(index) {
      case 0:
        dealCardsToPlayer(socketId, playerHand[0], compHand[0]);
        break;
      case 1:
        dealCardsToPlayer(socketId, compHand[0], playerHand[0]);
        break;
    }
  });

  compare(playerHand[0], compHand[0]);
}

//function to compare both face up cards (or current cards)
function compare(player, comp) {
	
	//if player's card value is higher than the computer's card value, player wins
	if((player % 13) > (comp % 13)) {
		
		//pushes current cards from each hand to the back of the player's hand
		playerHand.push(comp);
		playerHand.push(player);

		//removes current card from the front of each deck
		playerHand.shift();
		compHand.shift();

		//update card counts and check for a winner
		updateCountWrapper();
		checkWin();
	}

	//if computer's card value is higher than the player's card value, computer wins
	else if ((player % 13) < (comp % 13)) {
		
		//pushes current cards from each hand to the back of the computer's hand
		compHand.push(player);
		compHand.push(comp);

		//removes current card from the front of each deck
		compHand.shift();
		playerHand.shift();

		//update card counts and check for a winner
		updateCountWrapper();
		checkWin();
	}

	//if player's current card value is the same as the computer's current card value a "War" (tie) occurs
	else if ((player % 13) === (comp % 13))
		war();
}

function war() {
  fireWarEvent();
  setTimeout(() => {
		//calls function to draw cards from each deck
		warToArray();
	}, 2000);
}

//function to take cards from each deck and put into "war" array
function warToArray() {

	let length = 0;

	//if not able to draw 4 cards, draw as many as possible
	if (playerHand.length < 5 || compHand.length < 5) {

		//if computer has less than 4 cards
		if(playerHand.length > compHand.length) {
			length = compHand.length - 1;
		}

		//if the player hand has less than 4 cards
		else if (playerHand.length < compHand.length) {
			length = playerHand.length - 1;
		}
	}

	//if both decks have greater than four cards
	else {
		length = 3;		
	}

	//take the cards from each deck and push them to the war array
	for (var i = 0; i < length; i++) {
		warArray.push(playerHand[0]);
		playerHand.shift();
		warArray.push(compHand[0]);
		compHand.shift();
  }
  
  Object.keys(playingPlayers).forEach((socketId, index) => {
    switch(index) {
      case 0:
        warToArrayEvent(socketId, playerHand[0], compHand[0], length);
        break;
      case 1:
        warToArrayEvent(socketId, compHand[0], playerHand[0], length);
        break;
    }
  });

	//compare the new current card from each deck
	compareWar(playerHand[0], compHand[0]);
}


//function to compare current cards and allocate the war array correctly
function compareWar(player, comp) {
	
	//if player's War card value is greater than the computer's War card value, player wins the tie
	if((player % 13) > (comp % 13)) {
		
		//pushes entire war array to the back of the player's hand
		playerHand.push.apply(playerHand, warArray);

		//pushes both current cards (War cards) to back of the player's hand
		playerHand.push(comp);
		playerHand.push(player);
		
		//removes current card from both hands
		playerHand.shift();
		compHand.shift();
		
		//resets the war array to empty
		warArray.length = 0;

		//update card count and check for a winner
		updateCountWrapper();
		checkWin();
	}

	//if computer's War card value is greater than the player's War card value, computer wins the tie
	else if ((player % 13) < (comp % 13)) {
		
		//pushes the entire war array to the back of the computer's hand
		compHand.push.apply(compHand, warArray);
		
		//pushes both current cards (War cards) to the back of the computer's hand
		compHand.push(player);
		compHand.push(comp);

		//removes the current cards from each hand
		playerHand.shift();
		compHand.shift();

		//resets the war array to empty
		warArray.length = 0;

		//update card count and check for a winner
		updateCountWrapper();
		checkWin();
	}

	//if player's War card value is the same as the computer's War card value, call for another war
	else if ((player % 13) === (comp % 13))
		war();
}


//function to fill an array with 52 numbers
function fillArray() {
	const deck = [];
	for (let i = 0; i < 52; i++)
		deck[i] = i;

	shuffle(deck);
	splitCards(deck);
}

//function to shuffle deck of cards. 
function shuffle(deck) {
    for(let j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
    return deck;
}

//function to split shuffled deck in half
function splitCards(deck) {
	let i = 0;

	//push a card to each "hand" array
	while (i != deck.length) {
		playerHand.push(deck[i]);
		compHand.push(deck[(i+1)]);
		i+=2;
  }
  
  updateCountWrapper();
}

function updateCountWrapper() {
  Object.keys(playingPlayers).forEach((socketId, index) => {
    switch(index) {
      case 0:
        updateCount(socketId, playerHand.length, compHand.length);
        break;
      case 1:
        updateCount(socketId, compHand.length, playerHand.length);
        break;
    }
  });
}


//function to check if either player is out of cards (being a win for the other player)
function checkWin() {
	
	//if any player is out of cards, computer wins
	if (playerHand.length == 0 || compHand.length === 0) {
    // signal the clients
    Object.keys(playingPlayers).forEach((socketId, index) => {
      switch(index) {
        case 0:
          checkWinEvent(socketId, playerHand.length, compHand.length);
          break;
        case 1:
          checkWinEvent(socketId, compHand.length, playerHand.length);
          break;
      }
    });

    // reset variables
    resetGameVariables();
	}
}

function resetGameVariables() {
  gameStarted = false;
  warArray = [];
  playerHand = [];
  compHand = [];
  playingPlayers = {};
}

function startGame() {
  gameStarted = true;
  const sockets = Object.keys(playingPlayers);
  // send each player the name of his opponent
  startGameEvent(sockets[0], playingPlayers[sockets[1]].name);
  startGameEvent(sockets[1], playingPlayers[sockets[0]].name);
  updateCountWrapper();
}

// #endregion Game Logic


// #region Fire Events

function checkWinEvent(socketId, count, countOther) {
  io.sockets.connected[socketId].emit('finish', count, countOther);
}

function warToArrayEvent(socketId, card, cardOther, length) {
  io.sockets.connected[socketId].emit('war_to_array', card, cardOther, length);
}

function fireWarEvent() {
  io.sockets.emit('war');
}

function dealCardsToPlayer(socketId, card, cardOther) {
  io.sockets.connected[socketId].emit('next_cards', card, cardOther);
}

function updateCount(socketId, count, countOther) {
  io.sockets.connected[socketId].emit('update_count', count, countOther);
}

function startGameEvent(socketId, opponentName) {
  io.sockets.connected[socketId].emit('start', opponentName);
}

countDownTimer = function () {
  count = count - 1;
  io.sockets.emit('count_down', count);
  if (count <= 0) {
    clearInterval(interval);
    count = COUNT_DOWN;
    startGame();
  }
}

// #endregion Fire Events