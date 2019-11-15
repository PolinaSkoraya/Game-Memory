const cards = document.querySelectorAll('.memory-card');
const inputsNumberCards  = document.getElementsByName('cardsNumber');
let history =[];

if(localStorage.getItem('historyGame') != undefined){
    history = JSON.parse(localStorage.getItem('historyGame'));
    getHistory();
}

class Pair {
    constructor() {
        this.firstCardHistory = '';
        this.secondCardHistory = '';
    }
}
let numberOfClicks = 0;

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let first, second;

const flipCard = e => {
    numberOfClicks++;
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
    localStorage.setItem('hi', "yes");
    localStorage.setItem('historyGame', JSON.stringify(history));
    console.log(localStorage);
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    hasFlippedCard = lockBoard = false;
    firstCard = secondCard = null;
}

function shuffle() {
    cards.forEach(card => {
        let randomIndex = Math.floor(Math.random() * cards.length);
        card.style.order = randomIndex;
    });
};
shuffle();


cards.forEach(card => card.addEventListener('click', flipCard));

const additional  = document.querySelectorAll('.add');
const addTo12  = document.querySelectorAll('.addTo12');
const addTo16  = document.querySelectorAll('.addTo16');

const changeNumberCards = e => {
    const target = e.target;
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
    const fliped = document.querySelectorAll('.flip');
    fliped.forEach(elem => elem.classList.remove('flip'));
    resetBoard();
    cards.forEach(card => card.addEventListener('click', flipCard));
    setTimeout(shuffle, 500);
    clearHistory();
    localStorage.setItem('historyGame', '');
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