const cards = document.querySelectorAll('.memory-card');
const inputsNumberCards  = document.getElementsByName('cardsNumber');
let lengthCards = '8';
let historyGame =[];
let cardsOrder = [];
let flippedCardsName = [];
let numberOfClicks = 64;

const additional  = document.querySelectorAll('.addCards');
const addTo12  = document.querySelectorAll('.addTo12');
const addTo16  = document.querySelectorAll('.addTo16');

class Gamer{
    constructor(selectorDivGamer, selectorDivWinGamer){
        this.history = [];
        this.wins = 0;
        this.divGamer = document.querySelector(selectorDivGamer);
        this.divWin = document.querySelector(selectorDivWinGamer);
    }
    getDivGamer(){
        return this.divGamer;
    }
    getGamerHistory(){
        return this.history;
    }
    getDivWin(){
        return this.divWin;
    }
    getWins(){
        return this.wins;
    }
    resetGamerWins(){
        this.wins = 0;
        this.divWin.innerHTML = `${this.wins}`;
    }
    getLengthHist(){
        return this.history.length;
    }
    incrementWins(){
        this.wins++;
    }
    clearGamerHistory(){
        this.history.length = 0;
    }
    getGamerData(){
        return {
            'history': this.history,
            'wins': this.wins
        }
    }
    showWins(){

    }
}

let gamer1;
let gamer2;

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

if(localStorage.getItem('historyGame') !== 'undefined' && localStorage.getItem('historyGame') !== null){
    historyGame = JSON.parse(localStorage.getItem('historyGame'));
    let ol = document.querySelector('#listHistory');
    showHistory(historyGame, ol);
}

if(localStorage.getItem('numberOfCards') !== 'undefined' && localStorage.getItem('numberOfCards') !== null){
    lengthCards = Number(localStorage.getItem('numberOfCards'));
    addCards(localStorage.getItem('numberOfCards'));
    inputsNumberCards.forEach(elem=> {
        if(elem.value.toString() === localStorage.getItem('numberOfCards')){
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
    if(localStorage.getItem('gamer1') !== 'undefined' && localStorage.getItem('gamer1') !== null){
        let Gamer1Data = JSON.parse(localStorage.getItem('gamer1'));
        gamer1 = new Gamer('.firstGamer','#win1');
        gamer1.history = Gamer1Data.history;
        gamer1.wins = Gamer1Data.wins;
        let ol = document.querySelector('#listHistoryFG');
        showHistory(gamer1.history, ol);
        gamer1.getDivWin().innerHTML = `${gamer1.wins}`;
    }
    if(localStorage.getItem('gamer2') !== 'undefined' && localStorage.getItem('gamer2') !== null){
        let Gamer2Data = JSON.parse(localStorage.getItem('gamer2'));
        gamer2 = new Gamer('.secondGamer','#win2');
        gamer2.history = Gamer2Data.history;
        gamer2.wins = Gamer2Data.wins;
        let ol = document.querySelector('#listHistorySG');
        showHistory(gamer2.history, ol);
        gamer2.getDivWin().innerHTML = `${gamer2.wins}`;
    }

    document.querySelector('#chbHistory').disabled = true;
    document.querySelector('#chbGamers').checked = 'checked';
    document.querySelector('.twoGamers').classList.remove('addVisibl');
    if(localStorage.getItem('currentGamer') === '2'){
        changeGamer();
        numberOfClicks-=2;
    }
}

const flipCard = e => {
    if (lockBoard) return;

    const target = e.target.parentElement;
    if (target === firstCard) return;
    target.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = target;
        first = target;
    } else {
        secondCard = target;
        second = target;

        checkForMatch();
        if (document.querySelector('#chbGamers').checked !== true && numberOfClicks % 2 === 0) {
            initHistory(historyGame);
            localStorage.setItem('historyGame', JSON.stringify(historyGame));

            let ol = document.querySelector('#listHistory');
            showHistory(historyGame, ol);
        }
    }

    if (document.querySelector('#chbGamers').checked) {
        let double = firstCard === secondCard;
        numberOfClicks++;
        if (numberOfClicks % 2 === 0 && !double) {
            changeGamer();
        }

        if (numberOfClicks % 4 === 0) {
            initHistory(gamer2.getGamerHistory());
            let ol = document.querySelector('#listHistorySG');
            showHistory(gamer2.getGamerHistory(), ol);

        } else {
            if (numberOfClicks % 2 === 0) {
                initHistory(gamer1.getGamerHistory());
                let ol = document.querySelector('#listHistoryFG');
                showHistory(gamer1.getGamerHistory(), ol);
            }
        }
        if (double) numberOfClicks -= 2;
        localStorage.setItem('gamer1', JSON.stringify(gamer1.getGamerData()));
        localStorage.setItem('gamer2', JSON.stringify(gamer2.getGamerData()));
    }
}

function initHistory(history){
    let pair = new Pair();
    pair.firstCardHistory = first.dataset.name;
    pair.secondCardHistory = second.dataset.name;
    history.push(pair);
}

function showHistory(history, ol){
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
            elem.classList.add('addCards');
            //elem.classList.add('add');
        })
    }
    else if(value === '12'){
        addTo12.forEach( elem => {
            elem.classList.remove('addCards');
            //elem.classList.remove('add');
        })
        addTo16.forEach( elem => {
            elem.classList.add('addCards');
           //elem.classList.add('add');
        })
    }
    else if(value === '16'){
        additional.forEach( elem => {
            elem.classList.remove('addCards');
           //elem.classList.remove('add');
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

    if(localStorage.getItem('twoGamersMode') === 'true'){
        if(gamer2.getDivGamer().classList.contains('currentGamer')) {
            changeGamer();
        }

        localStorage.setItem('gamer1', JSON.stringify(gamer1.getGamerData()));
        localStorage.setItem('gamer2', JSON.stringify(gamer2.getGamerData()));
    }
}

document.querySelector('#reset').addEventListener('click', reset);

function clearHistory(){
    historyGame.length = 0;
    let ol = document.querySelector('#listHistory');
    while(ol.firstChild){
        ol.removeChild(ol.firstChild);
    }

    if(localStorage.getItem('twoGamersMode') === 'true'){
        gamer1.clearGamerHistory(); //historyFirstG.length = 0;
        gamer2.clearGamerHistory(); //historySecondG.length = 0;
        let ol1 = document.querySelector('#listHistoryFG');
        while(ol1.firstChild){
            ol1.removeChild(ol1.firstChild);
        }
        let ol2 = document.querySelector('#listHistorySG');
        while(ol2.firstChild){
            ol2.removeChild(ol2.firstChild);
        }
    }
}

const showDivHistory = () => {
    let ol = document.querySelector('#listHistory');
    document.querySelector('#chbHistory').checked ? ol.classList.remove('add') : ol.classList.add('add');
}

document.querySelector('#chbHistory').addEventListener('change', showDivHistory);

function checkEnd() {
    if(flippedCardsName.length * 2 === Number(lengthCards)) {
        if(localStorage.getItem('twoGamersMode') === 'true'){
            gamer1.getLengthHist() > gamer2.getLengthHist() ? gamer1.incrementWins() : gamer2.incrementWins();
            localStorage.setItem('gamer1', JSON.stringify(gamer1.getGamerData())); // localStorage.setItem('wins1', `${w1}`);
            localStorage.setItem('gamer2', JSON.stringify(gamer2.getGamerData())); // localStorage.setItem('wins2', `${w2}`);
            gamer1.getDivWin().innerHTML = `${gamer1.getWins()}`;
            gamer2.getDivWin().innerHTML = `${gamer2.getWins()}`;
        }
        setTimeout(()=>{
            reset()
        }, 1500);
    }
}

function changeGamer(){
    gamer1.getDivGamer().classList.toggle('currentGamer');
    gamer2.getDivGamer().classList.toggle('currentGamer');
    gamer1.getDivGamer().classList.contains('currentGamer')? localStorage.setItem('currentGamer', '1'):localStorage.setItem('currentGamer', '2')
}
function twoGamers(){
    if(document.querySelector('#chbGamers').checked){
        document.querySelector('.twoGamers').classList.remove('addVisibl');
        document.querySelector('#chbHistory').disabled = true;
        localStorage.setItem('twoGamersMode', 'true');
        gamer1 = new Gamer('.firstGamer','#win1');
        gamer2 = new Gamer('.secondGamer','#win2');
        reset();
    }else{
        document.querySelector('.twoGamers').classList.add('addVisibl');
        document.querySelector('#chbHistory').disabled = false;
        localStorage.setItem('twoGamersMode', 'false');
        reset();
    }
}
function resetWins(){
    gamer1.resetGamerWins();
    gamer2.resetGamerWins();
    localStorage.setItem('gamer1', JSON.stringify(gamer1.getGamerData()));
    localStorage.setItem('gamer2', JSON.stringify(gamer2.getGamerData()));
}

document.querySelector('#chbGamers').addEventListener('change', twoGamers);
document.querySelector('#resWins').addEventListener('click', resetWins);

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