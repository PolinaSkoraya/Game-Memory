const cards = document.querySelectorAll('.memory-card');
const inputsNumberCards  = document.getElementsByName('cardsNumber');
let lengthCards = '8';
let historyGame =[];
let cardsOrder = [];
let flippedCardsName = [];
let numberOfClicks = 64;

let historyFirstG = [];
let historySecondG = [];

const additional  = document.querySelectorAll('.add');
const addTo12  = document.querySelectorAll('.addTo12');
const addTo16  = document.querySelectorAll('.addTo16');

const firstGamer = document.querySelector('.firstGamer');
const secondGamer = document.querySelector('.secondGamer');

const divWin1 = document.querySelector('#win1');
const divWin2 = document.querySelector('#win2');
let w1 = 0;
let w2 = 0;

if(localStorage.getItem('historyGame') !== 'undefined' && localStorage.getItem('historyGame') !== null){
    historyGame = JSON.parse(localStorage.getItem('historyGame'));
    let ol = document.querySelector('#listHistory');
    getHistory(historyGame, ol);
}

if(localStorage.getItem('historyFirstG') !== 'undefined' && localStorage.getItem('historyFirstG') !== null){
    historyFirstG = JSON.parse(localStorage.getItem('historyFirstG'));
    let ol = document.querySelector('#listHistoryFG');
    getHistory(historyFirstG, ol);
}

if(localStorage.getItem('historySecondG') !== 'undefined' && localStorage.getItem('historySecondG') !== null){
    historySecondG = JSON.parse(localStorage.getItem('historySecondG'));
    let ol = document.querySelector('#listHistorySG');
    getHistory(historySecondG, ol);
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

if(localStorage.getItem('twoGamersMode') === 'true'){
    document.querySelector('#chbHistory').disabled = true;
    document.querySelector('#chbGamers').checked = 'checked';
    document.querySelector('.twoGamers').classList.remove('addVisibl');
    if(localStorage.getItem('currentGamer') === '2'){
        changeGamer();
        numberOfClicks-=2;
    }
    w1 = localStorage.getItem('wins1');
    w2 = localStorage.getItem('wins2');
    divWin1.innerHTML = `${w1}`;
    divWin2.innerHTML = `${w2}`;
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
    localStorage.setItem('historyFirstG', undefined);
    localStorage.setItem('historySecondG', undefined);

    flippedCardsName.length = 0;
    localStorage.setItem('flippedCardsName', undefined);

    numberOfClicks = 0;
    //const secondGamer = document.querySelector('.secondGamer');
    if(secondGamer.classList.contains('currentGamer')){
        changeGamer();
    }

    divWin1.innerHTML = `${w1}`;
    divWin2.innerHTML = `${w2}`;
}

document.querySelector('#reset').addEventListener('click', reset);

function clearHistory(){
    historyGame.length = 0;
    let ol = document.querySelector('#listHistory');
    while(ol.firstChild){
        ol.removeChild(ol.firstChild);
    }

    historyFirstG.length = 0;
    let ol1 = document.querySelector('#listHistoryFG');
    while(ol1.firstChild){
        ol1.removeChild(ol1.firstChild);
    }
    historySecondG.length = 0;
    let ol2 = document.querySelector('#listHistorySG');
    while(ol2.firstChild){
        ol2.removeChild(ol2.firstChild);
    }
}

const showDivHistory = () => {
    let ol = document.querySelector('#listHistory');
    document.querySelector('#chbHistory').checked ? ol.classList.remove('add') : ol.classList.add('add');
}

document.querySelector('#chbHistory').addEventListener('change', showDivHistory);



function checkEnd() {
    if(flippedCardsName.length * 2 === Number(lengthCards)) {
        console.log('hi');

        if(localStorage.getItem('twoGamersMode') === 'true'){
            historyFirstG.length > historySecondG.length ? w1++ : w2++;
            localStorage.setItem('wins1', `${w1}`);
            localStorage.setItem('wins2', `${w2}`);
            divWin1.innerHTML = `${w1}`;
            divWin2.innerHTML = `${w2}`;
            console.log(w1);
            console.log(w2);
        }
        setTimeout(()=>{
            reset()
        }, 1500);
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

        firstGamer.classList.toggle('currentGamer');
        secondGamer.classList.toggle('currentGamer');
        firstGamer.classList.contains('currentGamer')? localStorage.setItem('currentGamer', '1'):localStorage.setItem('currentGamer', '2')

}

function twoGamers(){
    if(document.querySelector('#chbGamers').checked){
        document.querySelector('.twoGamers').classList.remove('addVisibl');
        document.querySelector('#chbHistory').disabled = true;
        localStorage.setItem('twoGamersMode', 'true');
        reset();
    }else{
        document.querySelector('.twoGamers').classList.add('addVisibl');
        document.querySelector('#chbHistory').disabled = false;
        localStorage.setItem('twoGamersMode', 'false');
        reset();
    }
}

document.querySelector('#chbGamers').addEventListener('change', twoGamers);

function resetWins(){
    w1 = 0;
    w2 = 0;
    localStorage.setItem('wins1', '0');
    localStorage.setItem('wins2', '0');
    divWin1.innerHTML = `${w1}`;
    divWin2.innerHTML = `${w2}`;
}

document.querySelector('#resWins').addEventListener('click', resetWins);