/*
	game.js
	Ron Ginat
	Modified 13/07/2019
	War functionality
*/
const socket = io();

let playing = false, opponet = "";

function registerPlayer() {
	socket.emit('new_player', 'anon');
}

//function to take top card off of each deck and put into card slot
function deal() {
	
	//if a card is already in the slot, removes card. Also shows "New Game" button if hidden
	$('.playerCard').html("");
	$('.compCard').html("");
	//$('.newGame').show();

	$('.deal').attr("disabled", true);
	$('.deal').css("background-color", "#A1A1A1");
	socket.emit('deal_request');
}

function displayNextCards(myCard, opponentCard) {

	//creates an image element for the current card in each hand
	var img = document.createElement('img');
	var img2 = document.createElement('img');

	img.src = ("img/cards/" + myCard + ".png");
	img2.src = ("img/cards/" + opponentCard + ".png");

	//adds card image to the card slot of the game board
	$('.playerCard').append(img).animateCss("flipInYRev");
	$('.compCard').append(img2).animateCss("flipInY");

	//calls compare function to compare current cards
	compare(myCard, opponentCard);
}


//function to compare both face up cards (or current cards)
function compare(player, comp) {
	
	//if player's card value is higher than the computer's card value, player wins
	if((player % 13) > (comp % 13)) {
	
		//updates result div of the game board
		$('.result').html("You win!").animateCss("flipInX");

		setTimeout(function() {
			moveCards('player');
		}, 1500);

	}

	//if computer's card value is higher than the player's card value, computer wins
	else if ((player % 13) < (comp % 13)) {
		
		//update the results div of the game table
		$('.result').html(`${opponet} wins!`).animateCss("flipInX");

		setTimeout(function() {
			moveCards('comp');
		}, 1500);

	}

	//if player's current card value is the same as the computer's current card value a "War" (tie) occurs
	else if ((player % 13) === (comp % 13))
		war();
}

//function to move cards to a winners deck (animation)
function moveCards(winner) {

	if (winner == "player") {
		console.log("moving left");
		$(".playerCard img").css('position', 'relative').animate({ left: '-2000px' }, function() { $(this).hide(); });
		$(".compCard img").css('position', 'relative').animate({ left: '-2000px' }, function() { $(this).hide(); });
	}
	else if (winner == "comp") {
		console.log("moving right");
		$(".playerCard img").css('position', 'relative').animate({ left: '2000px' }, function() { $(this).hide(); });
		$(".compCard img").css('position', 'relative').animate({ left: '2000px' }, function() { $(this).hide(); });
	}
	else if (winner == "playerWar") {
		$("#warArea img").css("position", "relative").animate({ left: '-2000px' }, function() { $("#warArea img").hide(); });
	}
	else if (winner == "compWar") {
		$("#warArea img").css("position", "relative").animate({ left: '2000px' }, function() { $("#warArea img").hide(); });
	}
}


//function to handle "war" instances or "ties"
function war() {
	
	//show "war" animation
	$('#warAnimation').css("display", "table");

	$("#warText").animateCss("lightSpeedIn", function() {
		$("#warText").animateCss("lightSpeedOut");
	});

}


//function to take cards from each deck and put into "war" array
function warToArray(myCard, opponentCard, length) {
	let cardStr = "";

	for (let i = 0; i < length; i++) {
		cardStr += '<img src="img/cardback.jpg">';
	}

	//set up the War visual with relevant cards
	$(".playerWarFinal").html("<img src='img/cards/"+ myCard +".png'>").animateCss("flipInYRev");
	$(".playerWarCards").html(cardStr);
	$(".compWarCards").html(cardStr);
	$(".compWarFinal").html("<img src='img/cards/"+ opponentCard +".png'>").animateCss("flipInY");

	//compare the new current card from each deck
	compareWar(myCard, opponentCard);
}


//function to compare current cards and allocate the war array correctly
function compareWar(player, comp) {
	
	//if player's War card value is greater than the computer's War card value, player wins the tie
	if((player % 13) > (comp % 13)) {
	
		//updates result section of the game board
		$('.result').html("You win!");

		setTimeout(function() {
			moveCards("playerWar");
			moveCards("player");
		}, 3000);

		setTimeout(function() {
			$("#warArea").hide();
		}, 3500);

	}

	//if computer's War card value is greater than the player's War card value, computer wins the tie
	else if ((player % 13) < (comp % 13)) {
		
		//update result section of the game board
		$('.result').html(`${opponet} wins!`);

		setTimeout(function() {
			moveCards("compWar");
			moveCards("comp");
		}, 3000);

		setTimeout(function() {
			$("#warArea").hide();
		}, 3500);

	}

	//if player's War card value is the same as the computer's War card value, call for another war
	else if ((player % 13) === (comp % 13))
		war();
}


//function to check if either player is out of cards (being a win for the other player)
function checkWin(myCount, opponentCount) {
	
	//if player is out of cards, computer wins
	if (myCount == 0) {
		$(".result").html(`${opponet} wins the game :(`).animateCss("flipInX");

		//resets the card and deck image to make it seem like the player is out of cards
		$('.playerCard').html("");
		$('.playerDeck').html("");

		//hides the "deal" button, forces player to only start a new game
		$('.deal').hide();
		$('.newGame').show();
	}

	//if computer is out of cards, player wins
	else if (opponentCount == 0) {
		
		$(".result").html("You won the game! :)").animateCss("flipInX");

		//resets the card and deck image to make it seem like the computer is out of cards.
		$('.compCard').html("");
		$('.compDeck').html("");

		//hides the "deal" button, forces the player to only start a new game
		$('.deal').hide();
		$('.newGame').show();
	}
}

//function that hides the "how to play" screen and shows the game board
function playClick() {
	hideAll();
	$("#header").show().addClass("animated fadeInDown");
	$("#countDown").show().addClass("animated fadeInDown");
	$("#count_down").html("Wait for other player...");
	const name = window.location.pathname ? window.location.pathname.split('/')[1] : "opponent";
	socket.emit('player_ready', name);
}

function startGame() {
	$("#gameboard").show();
	playing = true;
}

//function to update the card count after every "deal" finishes
function updateCount(count, countOther) {
	$('.playCount').html("Your cards: " + count);
	$('.compCount').html(`${opponet}'s cards: ` + countOther);
}

//simple function to hide big page elements, usually followed by showing other specific elements
function hideAll() {
	$("#jumbotron").hide();
	$("#gameboard").hide();
	$("#howToPlay").hide();
	$("#header").hide();
	$(".newGame").hide();
}

window.onload = function() {
	registerPlayer(); // register with server

	preloadImages();

	hideAll();
	$("#jumbotron").show();
	$("#howToPlay").show();

	$("#year").html(new Date().getFullYear());
};

//custom function, used with animate.css to quickly add and then remove animation classes (once animation is finished)
//found here: https://github.com/daneden/animate.css
$.fn.extend({
	animateCss: function(animationName, callback) {
		var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
	}
});

//function to preload images into the browser cache for quicker loading during play
function preloadImages() {
	for (var i = 0; i < 52; i++) {
		var img = new Image();
		img.src = 'img/cards/'+i+'.png';
	}
}

// #region Socket Events

socket.on('start', opponetName => {
	// start the game
	opponet = opponetName;
	$('.result').html("");	
    startGame();
});

socket.on('count_down', count => {
    if (count === 0) {
		$("#count_down").html("");
		$("#countDown").hide();
    } else {
		$("#count_down").html("game starts in " + count);
    }
});

socket.on('update_count', (myCount, opponentCount) => {
	//update card counts and check for a winner
	updateCount(myCount, opponentCount);
});

socket.on('next_cards', (myCard, opponentCard) => {
	displayNextCards(myCard, opponentCard);
	$('.deal').attr("disabled", false);
	$('.deal').css("background-color", "#DDDDDD");
});

// fires when both deals are the same number
socket.on('war', war);

// fires with delay after 'war' event
//keeps animation going for 2 seconds, then removes the 'war' class and hides the animation
socket.on('war_to_array', (myTopCard, opponentTopCard, length) => {
	$('#warAnimation').hide();
	$("#warText").removeClass("lightSpeedOut");

	$("#warArea").show();
	
	//calls function to draw cards from each deck
	warToArray(myTopCard, opponentTopCard, length);
});

socket.on('finish', (myCount, opponentCount) => {
	checkWin(myCount, opponentCount);
});

socket.on('message', message => {
	console.log(message);
	if (!alert(message)) {
		location.reload();
	}
});

// #endregion Socket Events