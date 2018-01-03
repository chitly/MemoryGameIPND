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

$('.deck').on('click', '.card', evt => {
    var cardDom = $(evt.target);
    if(cardDom.hasClass('fa')) {
        cardDom = cardDom.parent();
    }
    if(cardDom.hasClass('match') || cardDom.hasClass('wrong')) {
        return;
    }

    cardDom.toggleClass('open show');
    cardDom.hasClass('open show') ? countOpenedCards++ : countOpenedCards--;
    if(countOpenedCards === 0) {
        openedCard = null;
    } else if(countOpenedCards === 1) {
        openedCard = cardDom;
    } else {
        checkEqualCards(openedCard, cardDom);
        countOpenedCards = 0;
        openedCard = null;
    }
});

function checkEqualCards(cardDom1, cardDom2) {
    var card1 = cardDom1.find('i');
    var card2 = cardDom2.find('i');
    if(card1.attr('class') === card2.attr('class')){
        console.log('equal');
        cardDom1.attr('class','card open match');
        cardDom2.attr('class','card open match');
    } else {
        console.log('not equal');
        cardDom1.attr('class','card open wrong');
        cardDom2.attr('class','card open wrong');
        setTimeout(()=>{
            cardDom1.attr('class','card');
            cardDom2.attr('class','card');
        },500);
    }
}