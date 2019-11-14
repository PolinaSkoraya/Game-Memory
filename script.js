const cards = document.querySelectorAll('.memory-card');
const inputsNumberCards  = document.getElementsByName('cardsNumber');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

const flipCard = e => {
    if (lockBoard) return;

    const target = e.target.parentElement;
    if (target === firstCard) return;
    target.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = target;
    }else{
        secondCard = target;
        checkForMatch();
    }
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
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
    }, 1500);
}

function resetBoard() {
    hasFlippedCard = lockBoard = false;
    firstCard = secondCard = null;
}

(function shuffle() {
    cards.forEach(card => {
        let randomIndex = Math.floor(Math.random() * cards.length);
        card.style.order = randomIndex;
    });
})();

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
    (function shuffle() {
        cards.forEach(card => {
            let randomIndex = Math.floor(Math.random() * cards.length);
            card.style.order = randomIndex;
        });
    })();
}

document.querySelector('#reset').addEventListener('click', reset);