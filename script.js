const cards = document.querySelectorAll('.memory-card');
const inputsNumberCards  = document.getElementsByName('cardsNumber');
let lengthCards = '8';
let historyGame =[];
let cardsOrder = [];
let flippedCardsName = [];
let numberOfClicks = 32;

let historyFirstG = [];
let historySecondG = [];

const additional  = document.querySelectorAll('.add');
const addTo12  = document.querySelectorAll('.addTo12');
const addTo16  = document.querySelectorAll('.addTo16');

if(localStorage.getItem('historyGame') !== 'undefined' && localStorage.getItem('historyGame') !== null){
    historyGame = JSON.parse(localStorage.getItem('historyGame'));
    getHistory();
}

if(localStorage.getItem('numberOfCards') !== 'undefined' && localStorage.getItem('numberOfCards') !== null){
    lengthCards = Number(localStorage.getItem('numberOfCards'));
    addCards(localStorage.getItem('numberOfCards'));
    inputsNumberCards.forEach(elem=> {
        if(elem.value == localStorage.getItem('numberOfCards')){
            elem.checked = 'checked';
        }
    })
}

if(localStorage.getItem('cardsOrder') !== 'undefined' && localStorage.getItem('cardsOrder') !== null){
    cardsOrder = JSON.parse(localStorage.getItem('cardsOrder'));
    for(let i=0; i<lengthCards; i++){
        cards[i].style.order = cardsOrder[i];
    }
}else{
    shuffle();
}


class Pair {
    constructor() {
        this.firstCardHistory = '';
        this.secondCardHistory = '';
    }
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let first, second;

const flipCard = e => {
    if (lockBoard) return;

    const target = e.target.parentElement;
    if (target === firstCard) return;
    target.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = target;
        first = target;
    }else{
        secondCard = target;
        second = target;

        checkForMatch();
        if(document.querySelector('#chbGamers').checked !== true && numberOfClicks % 2 === 0){
            initHistory(historyGame);
            localStorage.setItem('historyGame', JSON.stringify(historyGame));

            let ol = document.querySelector('#listHistory');
            getHistory(historyGame, ol);
        }
    }

    if(document.querySelector('#chbGamers').checked){
        let double = firstCard === secondCard;
        numberOfClicks++;
        if(numberOfClicks % 2 === 0 && !double){
            changeGamer();
        }

        if(numberOfClicks % 4 === 0){
            initHistory(historySecondG);
            localStorage.setItem('historySecondG', JSON.stringify(historySecondG));
            let ol = document.querySelector('#listHistorySG');
            getHistory(historySecondG, ol);

        }else{
            if(numberOfClicks % 2 === 0){
                initHistory(historyFirstG);
                localStorage.setItem('historyFirstG', JSON.stringify(historyFirstG));
                let ol = document.querySelector('#listHistoryFG');
                getHistory(historyFirstG, ol);
            }
        }
        if(double) numberOfClicks-=2;
    }
}

function initHistory(history){
    let pair = new Pair();
    pair.firstCardHistory = first.dataset.name;
    pair.secondCardHistory = second.dataset.name;
    history.push(pair);

}

function getHistory(history, ol){
    //let ol = document.querySelector('#listHistory');
    while(ol.firstChild){
        ol.removeChild(ol.firstChild);
    }
    history.forEach(elem=>{
        let li= document.createElement('li');
        li.innerHTML = `${elem.firstCardHistory} - ${elem.secondCardHistory}`;
        ol.append(li);
    })
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    flippedCardsName.push(firstCard.dataset.name);
    localStorage.setItem('flippedCardsName', JSON.stringify(flippedCardsName));

    resetBoard();
    checkEnd();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    hasFlippedCard = lockBoard = false;
    firstCard = secondCard = null;
}

function shuffle() {
    for(let i=0; i<lengthCards; i++){
        let randomIndex = Math.floor(Math.random() * lengthCards);
        cards[i].style.order = randomIndex;
        cardsOrder.push(randomIndex);
    }
    // cards.forEach(card => {
    //     let randomIndex = Math.floor(Math.random() * lengthCards);
    //     card.style.order = randomIndex;
    //     cardsOrder.push(randomIndex);
    // });

    localStorage.setItem('cardsOrder', JSON.stringify(cardsOrder));
};



cards.forEach(card => card.addEventListener('click', flipCard));

function addCards(value){
    if(value === '8'){
        additional.forEach( elem => {
            elem.classList.add('add');
            elem.classList.add('add');
        })
    }
    else if(value === '12'){
        addTo12.forEach( elem => {
            elem.classList.remove('add');
            elem.classList.remove('add');
        })
        addTo16.forEach( elem => {
            elem.classList.add('add');
            elem.classList.add('add');
        })
    }
    else if(value === '16'){
        additional.forEach( elem => {
            elem.classList.remove('add');
            elem.classList.remove('add');
        })
    }
}

const changeNumberCards = e => {
    const target = e.target;
    lengthCards = target.value;
    localStorage.setItem('numberOfCards', target.value);
    reset();
    addCards(target.value);
}

inputsNumberCards.forEach(input => input.addEventListener('change', changeNumberCards));

function reset(){
    cardsOrder.length = 0;
    localStorage.setItem('cardsOrder', undefined);

    const fliped = document.querySelectorAll('.flip');
    fliped.forEach(elem => elem.classList.remove('flip'));
    resetBoard();
    cards.forEach(card => card.addEventListener('click', flipCard));
    setTimeout(shuffle, 500);
    clearHistory();
    localStorage.setItem('historyGame', undefined);

    flippedCardsName.length = 0;
    localStorage.setItem('flippedCardsName', undefined);

    numberOfClicks = 0;
}

document.querySelector('#reset').addEventListener('click', reset);


function clearHistory(){
    historyGame.length = 0;

    let ol = document.querySelector('#listHistory');
    while(ol.firstChild){
        ol.removeChild(ol.firstChild);
    }
}

const showDivHistory = () => {
    let ol = document.querySelector('#listHistory');
    ol.classList.toggle('add');
}

document.querySelector('#chbHistory').addEventListener('change', showDivHistory);

function checkEnd() {
    if(flippedCardsName.length * 2 === Number(lengthCards)) {
        setTimeout(()=>{reset()}, 1500);
    }
}

if(localStorage.getItem('flippedCardsName') !== 'undefined' && localStorage.getItem('flippedCardsName') !== null){
    flippedCardsName = JSON.parse(localStorage.getItem('flippedCardsName'));
    flippedCardsName.forEach(elem =>{
        let flipped = document.querySelectorAll(`[data-name = ${elem}]`);
        flipped.forEach(card=>{
            card.removeEventListener('click', flipCard);
            card.classList.add('flip');
        })
    })
}

function changeGamer(){
    const firstGamer = document.querySelector('.firstGamer');
    const secondGamer = document.querySelector('.secondGamer');
    firstGamer.classList.toggle('currentGamer');
    secondGamer.classList.toggle('currentGamer');
}

function twoGamers(){
    if(document.querySelector('#chbGamers').checked){
        reset();
    }
}

document.querySelector('#chbGamers').addEventListener('change', twoGamers);