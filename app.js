const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

const keys = [
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L','ENTER',
  'Z','X','C','V','B','N','M',
  '«',
];

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
const wordle = 'SUPER';
let isGameOver = false;


guessRows.forEach((guessRow,guessRowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex);
    guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement('div');
        // Each div will contain an id which will have the value (i,j) -> guessRow and tile(Column no.)
      tileElement.setAttribute('id', `guessRow-${guessRowIndex}-tile-${guessIndex}`);
      tileElement.classList.add('tile')
        rowElement.append(tileElement);
    });
    tileDisplay.append(rowElement)
})

const addLetter = (letter) => {
  if (currentRow < 6 && currentTile < 5) {
    const tile = document.getElementById(`guessRow-${currentRow}-tile-${currentTile}`);
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
  }
};

const handleClick = (key) => {
  console.log('clicked', key);
  if (key === '«') {
    deleteLetter();
    return;
  } else if (key === 'ENTER') {
    checkRow();
    return;
  }
  addLetter(key)
}
keys.forEach(key => {
    const buttonElement = document.createElement('button');
    buttonElement.textContent = key;
    buttonElement.setAttribute('id', key);
    buttonElement.addEventListener('click', ()=>handleClick(key));
    keyboard.append(buttonElement);
});


const showMessage = (message) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const checkRow = () => {
  const guess = guessRows[currentRow].join('');
  if (currentTile === 5) {
    console.log(`Guessed word is: ${guess}`);
    flipTile();
    if (wordle === guess) {
      showMessage('Magnificient!');
      isGameOver = true;
      return;
    } else {
      if (currentRow >= 5) {
        isGameOver = false
        showMessage('Game Over')
        // return
      }
      else if(currentRow < 5) {
        currentRow++;
        currentTile = 0;
      }
    }
  }
};

const addColorToKey = (keyLetter,color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute('data');
    setTimeout(() => {
        tile.classList.add('flip')
        if (dataLetter == wordle[index]) {
          tile.classList.add('green-overlay');
          addColorToKey(dataLetter, 'green-overlay');
        } else if (wordle.includes(dataLetter)) {
          tile.classList.add('yellow-overlay');
          addColorToKey(dataLetter, 'yellow-overlay');
        } else {
          tile.classList.add('grey-overlay');
          addColorToKey(dataLetter, 'grey-overlay');
        }
    },500*index)
  });
};