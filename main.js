
class Frame {
  constructor() {
    this.firstRoll = 'X';
    this.secondRoll = 'X';
    this.score = 'score';
    this.spare = false;
    this.strike = false;
  }
}


const ulist = document.querySelector('ul');
const startBtn = document.querySelector('#start');
const captureBtn = document.querySelector('#captureFrame');
const playAgainBtn = document.querySelector('#playAgain');
const inFirstRoll = document.querySelector('#inFirstRoll');
const laFirstRoll = document.querySelector('#firstRoll');
const inSecondRoll = document.querySelector('#inSecondRoll');
const runningFrame = document.querySelector('#runningFrame');
let counter = 0;
let bowlingArr = [];
let showExtraRoll = false;
let lastRoll = 0;


startBtn.addEventListener('click', startGame);
captureBtn.addEventListener('click', captureRolls);
playAgainBtn.addEventListener('click', playAgain);

playAgain();

function playAgain() {
  lastRoll = 0;
  counter = 0;
  bowlingArr = [];
  for (let i = 0; i < 10; i++) {
    let frameData = new Frame();
    bowlingArr.push(frameData);
  }

  showExtraRoll = false;

  captureBtn.disabled = true;
  playAgainBtn.disabled = true;
  inFirstRoll.disabled = true;
  inSecondRoll.disabled = true;
  startBtn.disabled = false;
  renderFrames();
}

function startGame() {
  startBtn.disabled = true;
  playAgainBtn.disabled = true;
  captureBtn.disabled = false;
  inFirstRoll.disabled = false;
  inSecondRoll.disabled = false;
}

function renderFrames() {
  clearList();
  for (let i = 0; i < 10; i++) {
    let listItem = document.createElement('li');
    let rolls = document.createElement('div');
    let paraFirstRoll = document.createElement('p');
    let paraSecondRoll = document.createElement('p');
    let paraScore = document.createElement('p');
    let paraMessage = document.createElement('p');

    paraFirstRoll.textContent = bowlingArr[i].firstRoll;
    paraSecondRoll.textContent = bowlingArr[i].secondRoll;
    paraScore.textContent = bowlingArr[i].score;

    paraFirstRoll.classList.add('roll', 'firstRoll');
    paraSecondRoll.classList.add('roll', 'secondRoll');
    paraScore.classList.add('score');

    rolls.appendChild(paraFirstRoll);
    rolls.appendChild(paraSecondRoll);

    if (i === 9) {
      let paraThirdRoll = document.createElement('p');
      paraThirdRoll.textContent = lastRoll;
      paraThirdRoll.classList.add('roll', 'thirdRoll');
      showExtraRoll ? paraThirdRoll.style.display = "block" : paraThirdRoll.style.display = "none";
      rolls.appendChild(paraThirdRoll);
    }

    listItem.appendChild(rolls);
    listItem.appendChild(paraScore);

    if (bowlingArr[i].strike) {
      paraMessage.textContent = "Strike!!";
      paraMessage.classList.add('strike');
      listItem.appendChild(paraMessage);
    }

    if (bowlingArr[i].spare) {
      paraMessage.textContent = "Spare!";
      paraMessage.classList.add('spare');
      listItem.appendChild(paraMessage);
    }

    ulist.appendChild(listItem);
  }
}

function clearList() {
  while (ulist.hasChildNodes()) {
    ulist.removeChild(ulist.firstChild);
  }
}

function captureRolls() {
  const r1 = parseInt(inFirstRoll.value);
  const r2 = parseInt(inSecondRoll.value);

  if (validInput(r1, r2) || counter === 11) {
    if (counter < 11) {
      runningFrame.textContent = `Last captured Frame: ${counter + 1}`;
      bowlingArr[counter].firstRoll = r1;
      bowlingArr[counter].secondRoll = r2;
    }
    if (counter <= 9) {
      if (r1 === 10) {    // Strike
        bowlingArr[counter].strike = true;
      }else if (r1 + r2 === 10) {   // Spare
        bowlingArr[counter].spare = true;
      }
      if (counter > 0) {
        calculateScore(); 
      }
      counter++;
    } 
    if (counter === 10) {
      bowlingArr[counter - 1].score = bowlingArr[counter - 2].score + r1 + r2;
      if (bowlingArr[counter - 1].strike || bowlingArr[counter - 1].spare) {
        runningFrame.textContent = "You are allowed to roll an extra ball";

        inSecondRoll.disabled = true;
        laFirstRoll.textContent = "Enter last Roll";
        captureBtn.textContent = "Final Score";
        counter++;
      } else {
        runningFrame.textContent = "Game Over!!";
        captureBtn.disabled = true;
      }
    } else if (counter === 11) {
      lastRoll = parseInt(inFirstRoll.value);
      if (validInput(lastRoll)) {
        captureBtn.disabled = true;
        bowlingArr[counter - 2].score = bowlingArr[counter - 2].score + lastRoll;
        showExtraRoll = true;
        playAgainBtn.disabled = false;
        runningFrame.textContent = 'Game Over!';
      } else {
        runningFrame.textContent = 'Please enter valid data';
      }
    }
    renderFrames();
  } else {
    runningFrame.textContent = 'Please enter valid data';
  }
  inFirstRoll.value = '';
  inSecondRoll.value = '';
}

function calculateScore() {
  for (let i = 0; i < counter; i++) {
    let frame = bowlingArr[i];

    if (i === 0) {
      if (frame.strike) {
        frame.score = 10 + bowlingArr[1].firstRoll + bowlingArr[1].secondRoll; 
      } else if (frame.spare) {
        frame.score = 10 + bowlingArr[1].firstRoll;
      } else {
        frame.score = frame.firstRoll + frame.secondRoll;
      }
    } else {
      if (frame.strike) {
        frame.score = bowlingArr[i - 1].score + 10 + bowlingArr[i + 1].firstRoll + bowlingArr[i + 1].secondRoll;
      } else if (frame.spare) {
        frame.score = bowlingArr[i - 1].score + 10 + bowlingArr[i + 1].firstRoll;
      } else {
        frame.score = bowlingArr[i - 1].score + frame.firstRoll + frame.secondRoll;
      }
    }
  }
}

function validInput(roll1, roll2 = 0) {
  if (roll1.toString() === 'NaN'  || roll2.toString() === 'NaN') {
    return false;
  }
  if ((roll1 + roll2) > 10 || (roll1 + roll2 < 0)) {
    return false;
  }
  return true;
}
