const cards = document.querySelectorAll('.memory-card');
const inputsNumberCards  = document.getElementsByName('cardsNumber');
let history =[];
let cardsOrder = [];
let lengthCards = 0;
let flippedCardsName = [];

const additional  = document.querySelectorAll('.add');
const addTo12  = document.querySelectorAll('.addTo12');
const addTo16  = document.querySelectorAll('.addTo16');

if(localStorage.getItem('historyGame') !== 'undefined' && localStorage.getItem('historyGame') !== null){
    history = JSON.parse(localStorage.getItem('historyGame'));
    getHistory();
}
if(localStorage.getItem('numberOfCards') !== 'undefined'){
    lengthCards = Number(localStorage.getItem('numberOfCards'));
    if(localStorage.getItem('numberOfCards') === '8'){
        additional.forEach( elem => {
            elem.classList.add('add');
            elem.classList.add('add');
        })
    }
    else if(localStorage.getItem('numberOfCards') === '12'){
        addTo12.forEach( elem => {
            elem.classList.remove('add');
            elem.classList.remove('add');
        })
        addTo16.forEach( elem => {
            elem.classList.add('add');
            elem.classList.add('add');
        })
    }
    else if(localStorage.getItem('numberOfCards') === '16'){
        additional.forEach( elem => {
            elem.classList.remove('add');
            elem.classList.remove('add');
        })
    }
    inputsNumberCards.forEach(elem=> {
        if(elem.value == localStorage.getItem('numberOfCards')){
            elem.checked = 'checked';
        }
    })
}

if(localStorage.getItem('cardsOrder') != undefined){
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
        initHistory();
        checkForMatch();
        getHistory();
    }
}

function initHistory(){
    let pair = new Pair();
    pair.firstCardHistory = first.dataset.name;
    pair.secondCardHistory = second.dataset.name;
    history.push(pair);
    localStorage.setItem('historyGame', JSON.stringify(history));
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


const changeNumberCards = e => {
    const target = e.target;
    lengthCards = target.value;
    localStorage.setItem('numberOfCards', target.value);
    reset();
    if(target.value == 8){
        additional.forEach( elem => {
            elem.classList.add('add');
            elem.classList.add('add');
        })
    }
    else if(target.value == 12){
        addTo12.forEach( elem => {
            elem.classList.remove('add');
            elem.classList.remove('add');
        })
        addTo16.forEach( elem => {
            elem.classList.add('add');
            elem.classList.add('add');
        })
    }
    else if(target.value == 16){
       additional.forEach( elem => {
           elem.classList.remove('add');
           elem.classList.remove('add');
       })
    }
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
}

document.querySelector('#reset').addEventListener('click', reset);

function getHistory(){
    let ol = document.querySelector('#listHistory');
    while(ol.firstChild){
        ol.removeChild(ol.firstChild);
    }
    history.forEach(elem=>{
        let li= document.createElement('li');
        li.innerHTML = `${elem.firstCardHistory} - ${elem.secondCardHistory}`;
        ol.append(li);
    })

}

function clearHistory(){
    history.length = 0;

    let ol = document.querySelector('#listHistory');
    while(ol.firstChild){
        ol.removeChild(ol.firstChild);
    }
}

const showHistory = () => {
    let ol = document.querySelector('#listHistory');
    ol.classList.toggle('add');
}

document.querySelector('#chbHistory').addEventListener('change', showHistory);

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