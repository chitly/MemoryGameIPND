// Start the game after loaded html file.
$(startGame);

var timer;

function startGame() {
    /*
     * Create a list that holds all of your cards
     */
    var cards = [
        'diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb',
        'diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'
    ];

    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */
    cards = shuffle(cards);
    cards.forEach(card => {
        var cardDom = $('<li class="card"></li>');
        cardDom.append($(`<i class="fa fa-${card}"></i>`));
        $('.deck').append(cardDom);
    });

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    /*
     * set up the event listener for a card. If a card is clicked:
     *  - display the card's symbol (put this functionality in another function that you call from this one)
     *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
     *  - if the list already has another card, check to see if the two cards match
     *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
     *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
     *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
     *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
     */
    var countOpenedCards = 0;
    var openedCard = null;
    var matchPairCards = 0;
    var moves = 0;
    var stars = 3;

    /* 
     * Add onclick for each card in deck can open the card.
     * After that, check the 2 cards are open. If yes, check equal for both cards.
     */
    $('.deck').on('click', '.card', evt => {
        var cardDom = $(evt.target);
        if (cardDom.hasClass('fa')) {
            cardDom = cardDom.parent();
        }
        if (cardDom.hasClass('open')) {
            return;
        }

        cardDom.addClass('open show');
        countOpenedCards++;

        if (countOpenedCards === 1) {
            openedCard = cardDom;
        } else {
            checkEqualCards(openedCard, cardDom);
            countOpenedCards = 0;
            openedCard = null;
        }
    });

    /* 
     * Check 2 cards are same type or not same.
     * if same increase the value of match pair card by 1
     * After that, update the card dom, the add move and check won game.
     */
    function checkEqualCards(cardDom1, cardDom2) {
        var card1 = cardDom1.find('i');
        var card2 = cardDom2.find('i');
        if (card1.attr('class') === card2.attr('class')) {
            cardDom1.attr('class', 'card open match');
            cardDom2.attr('class', 'card open match');
            matchPairCards++;
        } else {
            cardDom1.attr('class', 'card open wrong');
            cardDom2.attr('class', 'card open wrong');
            setTimeout(() => {
                cardDom1.attr('class', 'card');
                cardDom2.attr('class', 'card');
            }, 500);
        }
        addMove();
        checkWonGame();
    }

    /* 
     * Add move after clicked 2 cards and decresed the star if moves equal 10 or 15.
     * After that, update the screen.
     */
    function addMove() {
        var moveDom = $('.moves');
        var starDom = $('.stars');
        moves++;
        moveDom.text(moves);
        if (moves === 10 || moves === 15) {
            stars--;
            starDom.find('.fa-star').last().attr('class', 'fa fa-star-o');
        }
    }

    /* 
     * Check match pair cards equals 8? If equals, end game.
     * The end game have to stop the timer and show the won game screen
     * After that add the time, moves, stars to won game screen.
     * Finally, add the play again button that clicked to restart the game.
     */
    function checkWonGame() {
        var wonGameDom = $('.won-game');
        var containerDom = $('.container');
        var timeSec;
        var restartButton;
        if (matchPairCards === 8) {
            clearInterval(timer);
            timeSec = $('.timer').text();
            wonGameDom.append(`<div class="container">` +
                `<div class="fa fa-check-circle-o fa-5x check"></div>` +
                `<header><h1>Congratulations! You Won in ${timeSec} Seconds!</h1></header>` +
                `<p>With ${moves} Moves and ${stars} Stars.</p>` +
                `<p>Woooooo!</p></div>`);
            restartButton = $('<a class="button">Play again!</a>');
            restartButton.click(evt =>{
                $('.restart').click();
                containerDom.removeClass('hide');
                wonGameDom.find('*').remove();
            });
            wonGameDom.find('.container').append(restartButton);
            wonGameDom.removeClass('hide');
            containerDom.addClass('hide');
        }
    }

    // Create the timer
    timer = setInterval(function () {
        var timerDom = $('.timer');
        timerDom.text(Number(timerDom.text()) + 1);
    }, 1000);
}

/* 
 * Add onclick event to restart button
 * This function will set move to zero then change stars back to full stars.
 * Clear all dom in class deck and reset timer.
 * Finally start game again.
 */
$('.restart').click(evt => {
    var moveDom = $('.moves');
    var starDom = $('.stars');
    var deckDom = $('.deck');
    var timerDom = $('.timer');

    moveDom.text(0);
    starDom.find('.fa-star-o').attr('class', 'fa fa-star');
    deckDom.find('*').remove();
    deckDom.off('click');
    clearInterval(timer);
    timerDom.text(0);
    startGame();
});