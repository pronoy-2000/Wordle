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
let wordle;
let isGameOver = false;

const getWordle = () => {
  fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch(err => console.error(err));
};
getWordle();


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
  if (!isGameOver) {
    if (key === '«') {
      deleteLetter();
      return;
    } else if (key === 'ENTER') {
      checkRow();
      return;
    }
    addLetter(key)
    
  }
  // console.log('clicked', key);
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
  console.log(`Guessed word is: ${guess}`);
  if (currentTile === 5) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        if (json == false) {
          showMessage('word not in list');
          return;
        } else {
          
          flipTile();
          if (wordle === guess) {
            showMessage('Magnificient!');
            isGameOver = true;
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              showMessage('Game Over');
              return
            }
            else if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      }).catch(err => console.error(err));
  }
};

const addColorToKey = (keyLetter,color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}
//gather data and then assign colors
const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
  let checkWordle = wordle;//to remove words from the wordle as we check them
  const guess = [];//push the guess and their assigned color

  rowTiles.forEach(tile => {
    guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' });
  })

  guess.forEach((guess, index) => {
    if (guess.letter === wordle[index]) {
      guess.color = 'green-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');//prevents repeated letters from getting colored
    }
  });

  guess.forEach(guess => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = 'yellow-overlay';
      checkWordle = checkWordle.replace(guess.letter, '');
    }
  })

  rowTiles.forEach((tile, index) => {
    // const dataLetter = tile.getAttribute('data');
    setTimeout(() => {
      tile.classList.add('flip')
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    },500*index)
  });
};