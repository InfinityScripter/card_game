// Константы и переменные
const cardObjectDefinitions = [
  {id: 1, imagePath: '/images/card-KingSpades.png'},
  {id: 2, imagePath: '/images/card-JackHearth.png'},
  {id: 3, imagePath: '/images/card-QueenHearth.png'},
  {id: 4, imagePath: '/images/card-AceSpades.png'},
  {id: 5, imagePath: '/images/img.png'},
  {id: 6, imagePath: '/images/img_1.png'}
]
const aceId = 4
const cardBackImgPath = '/images/card-back-blue.png'
let cards = []
const playGameButtonElem = document.getElementById('playGame')
const cardContainerElem = document.querySelector('.card-container')
const collapsedGridAreaTemplate = '"a b" "c d" "e f"'
const cardCollectionCellClass = ".card-pos-a"
const numCards = cardObjectDefinitions.length
let cardPositions = []
let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false
const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')
const winColor = "green"
const loseColor = "red"
const primaryColor = "black"
let roundNum = 0
let maxRounds = 4
let score = 0
let gameObj = {}
const localStorageGameKey = "HTA"

loadGame()

// Функция завершения игры
function gameOver() {
  updateStatusElement(scoreContainerElem, "none")
  updateStatusElement(roundContainerElem, "none")
  const gameOverMessage = `Игра окончена! Финальный счёт - <span class = 'badge'>${score}</span> Нажми 'Играть' что бы начать игру заново `
  updateStatusElement(currentGameStatusElem, "block", primaryColor, gameOverMessage)
  gameInProgress = false
  playGameButtonElem.disabled = false
}

// Функция завершения раунда
function endRound() {
  setTimeout(() => {
    if (roundNum == maxRounds) {
      gameOver()
      return
    } else {
      startRound()
    }
  }, 3000)
}

// Функция выбора карты
function chooseCard(card) {
  if (canChooseCard()) {
    evaluateCardChoice(card)
    saveGameObjectToLocalStorage(score, roundNum)
    flipCard(card, false)

    setTimeout(() => {
      flipCards(false)
      updateStatusElement(currentGameStatusElem, "block", primaryColor, "Расположение карт раскрыто")

      endRound()

    }, 1000)
    cardsRevealed = true
  }
}


// Функция расчета очков для добавления
function calculateScoreToAdd(roundNum) {
  if (roundNum == 1) {
    return 100
  } else if (roundNum == 2) {
    return 50
  } else if (roundNum == 3) {
    return 25
  } else{
    return 10
  }
}

function calculateScore() {
  const scoreToAdd = calculateScoreToAdd(roundNum)
  score = score + scoreToAdd
}

function updateScore() {
  calculateScore()
  updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)

}

function updateStatusElement(elem, display, color, innerHTML) {
  elem.style.display = display

  if (arguments.length > 2) {
    elem.style.color = color
    elem.innerHTML = innerHTML
  }

}
// Ответ при выборе карты
function outputChoiceFeedBack(hit) {
  if (hit) {
    updateStatusElement(currentGameStatusElem, "block", winColor, "Молодец! Ты нашел туза! 😏")
  } else {
    updateStatusElement(currentGameStatusElem, "block", loseColor, "Не угадал 🫠")
  }
}

function evaluateCardChoice(card) {
  if (card.id == aceId) {
    updateScore()
    outputChoiceFeedBack(true)
  } else {
    outputChoiceFeedBack(false)
  }
}

function canChooseCard() {
  return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}


function loadGame() {
  createCards()

  cards = document.querySelectorAll('.card')

  cardFlyInEffect()

  playGameButtonElem.addEventListener('click', () => startGame())

  updateStatusElement(scoreContainerElem, "none")
  updateStatusElement(roundContainerElem, "none")

}

function checkForIncompleteGame() {
  const serializedGameObj = getLocalStorageItemValue(localStorageGameKey)
  if (serializedGameObj) {
    gameObj = getObjectFromJSON(serializedGameObj)

    if (gameObj.round >= maxRounds) {
      removeLocalStorageItem(localStorageGameKey)
    } else {
      if (confirm('Хотите продолжить с вашей последней игры?')) {
        score = gameObj.score
        roundNum = gameObj.round
      }
    }

  }

}

function startGame() {
  initializeNewGame()
  startRound()

}

function initializeNewGame() {
  score = 0
  roundNum = 0

  checkForIncompleteGame()

  shufflingInProgress = false

  updateStatusElement(scoreContainerElem, "flex")
  updateStatusElement(roundContainerElem, "flex")

  updateStatusElement(scoreElem, "block", primaryColor, `Счёт <span class='badge'>${score}</span>`)
  updateStatusElement(roundElem, "block", primaryColor, `Раунд <span class='badge'>${roundNum}</span>`)

}

function startRound() {
  initializeNewRound()
  collectCards()
  flipCards(true)
  shuffleCards()

}

function initializeNewRound() {
  roundNum++
  playGameButtonElem.disabled = true

  gameInProgress = true
  shufflingInProgress = true
  cardsRevealed = false

  updateStatusElement(currentGameStatusElem, "block", primaryColor, "Мешаем карты...")

  updateStatusElement(roundElem, "block", primaryColor, `Раунд <span class='badge'>${roundNum}</span>`)

}

function collectCards() {
  transformGridArea(collapsedGridAreaTemplate)
  addCardsToGridAreaCell(cardCollectionCellClass)

}

function transformGridArea(areas) {
  cardContainerElem.style.gridTemplateAreas = areas

}

function addCardsToGridAreaCell(cellPositionClassName) {
  const cellPositionElem = document.querySelector(cellPositionClassName)

  cards.forEach((card, index) => {
    addChildElement(cellPositionElem, card)
  })

}

function flipCard(card, flipToBack) {
  const innerCardElem = card.firstChild

  if (flipToBack && !innerCardElem.classList.contains('flip-it')) {
    innerCardElem.classList.add('flip-it')
  } else if (innerCardElem.classList.contains('flip-it')) {
    innerCardElem.classList.remove('flip-it')
  }

}

function flipCards(flipToBack) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack)
    }, index * 100)
  })
}

function cardFlyInEffect() {
  const id = setInterval(flyIn, 2)
  let cardCount = 0

  let count = 0

  function flyIn() {
    count++
    if (cardCount == numCards) {
      clearInterval(id)
      playGameButtonElem.style.display = "inline-block"
    }
    if (count == 1 || count == 250 || count == 500 || count == 750 || count == 1000 || count == 2000) {
      cardCount++
      let card = document.getElementById(cardCount)
      card.classList.remove("fly-in")
    }
  }


}

function removeShuffleClasses() {
  cards.forEach((card) => {
    card.classList.remove("shuffle-left")
    card.classList.remove("shuffle-right")
  })
}

function animateShuffle(shuffleCount) {
  const random1 = Math.floor(Math.random() * numCards) + 1
  const random2 = Math.floor(Math.random() * numCards) + 1

  let card1 = document.getElementById(random1)
  let card2 = document.getElementById(random2)

  if (shuffleCount % 4 == 0) {
    card1.classList.toggle("shuffle-left")
    card1.style.zIndex = 100
  }
  if (shuffleCount % 10 == 0) {
    card2.classList.toggle("shuffle-right")
    card2.style.zIndex = 200
  }

}

function shuffleCards() {
  let shuffleCount = 0
  const id = setInterval(shuffle, 12)


  function shuffle() {
    randomizeCardPositions()

    animateShuffle(shuffleCount)

    if (shuffleCount == 300) {
      clearInterval(id)
      shufflingInProgress = false
      removeShuffleClasses()
      dealCards()
      updateStatusElement(currentGameStatusElem, "block", primaryColor, "Выберите карту, где спрятался туз")

    } else {
      shuffleCount++
    }

  }

}

function randomizeCardPositions() {
  const random1 = Math.floor(Math.random() * numCards) + 1
  const random2 = Math.floor(Math.random() * numCards) + 1


  const temp = cardPositions[random1 - 1]

  cardPositions[random1 - 1] = cardPositions[random2 - 1]
  cardPositions[random2 - 1] = temp

}

function dealCards() {
  addCardsToAppropriateCell()
  const areasTemplate = returnGridAreasMappedToCardPos()

  transformGridArea(areasTemplate)

}

// Функция, которая возвращает стили для gridTemplateAreas, используя позиции карт
function returnGridAreasMappedToCardPos() {
  let firstPart = "";
  let secondPart = "";
  let thirdPart = "";
  let areas = "";

  cards.forEach((card, index) => {
    if (cardPositions[index] == 1) {
      areas = areas + "a "
    } else if (cardPositions[index] == 2) {
      areas = areas + "b "
    } else if (cardPositions[index] == 3) {
      areas = areas + "c "
    } else if (cardPositions[index] == 4) {
      areas = areas + "d "
    } else if (cardPositions[index] == 5) {
      areas = areas + "e "
    } else if (cardPositions[index] == 6) {
    areas = areas + "f "
    }
    if (index == 1) {
      firstPart = areas.substring(0, areas.length - 1)
      areas = "";
    } else if (index == 3) {
      secondPart = areas.substring(0, areas.length - 1)
    } else if (index == 5) {
      thirdPart = areas.substring(0, areas.length - 1)
    }

  })

  return `"${firstPart}" "${secondPart}" "${thirdPart}"`

}


function addCardsToAppropriateCell() {
  cards.forEach((card) => {
    addCardToGridCell(card)
  })
}

// Функция для создания карт
function createCards() {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem);
  });
}

// Функция для создания одной карты
function createCard(cardItem) {
  // Создание элементов div, составляющих карту
  const cardElem = createElement("div");
  const cardInnerElem = createElement("div");
  const cardFrontElem = createElement("div");
  const cardBackElem = createElement("div");

  // Создание элементов изображения для передней и задней стороны карты
  const cardFrontImg = createElement("img");
  const cardBackImg = createElement("img");

  // Добавление класса и идентификатора к элементу карты
  addClassToElement(cardElem, "card");
  addClassToElement(cardElem, "fly-in");
  addIdToElement(cardElem, cardItem.id);

  // Добавление класса к внутреннему элементу карты
  addClassToElement(cardInnerElem, "card-inner");

  // Добавление класса к переднему элементу карты
  addClassToElement(cardFrontElem, "card-front");

  // Добавление класса к заднему элементу карты
  addClassToElement(cardBackElem, "card-back");

  // Добавление атрибута src и соответствующего значения к элементу изображения - задняя сторона карты
  addSrcToImageElem(cardBackImg, cardBackImgPath);

  // Добавление атрибута src и соответствующего значения к элементу изображения - передняя сторона карты
  addSrcToImageElem(cardFrontImg, cardItem.imagePath);

  // Назначение класса для элемента изображения задней стороны карты
  addClassToElement(cardBackImg, "card-img");

  // Назначение класса для элемента изображения передней стороны карты
  addClassToElement(cardFrontImg, "card-img");


  //add front image element as child element to front card element
  addChildElement(cardFrontElem, cardFrontImg)

  //add back image element as child element to back card element
  addChildElement(cardBackElem, cardBackImg)

  //add front card element as child element to inner card element
  addChildElement(cardInnerElem, cardFrontElem)

  //add back card element as child element to inner card element
  addChildElement(cardInnerElem, cardBackElem)

  //add inner card element as child element to card element
  addChildElement(cardElem, cardInnerElem)

  //add card element as child element to appropriate grid cell
  addCardToGridCell(cardElem)

  initializeCardPositions(cardElem)

  attatchClickEventHandlerToCard(cardElem)


}

function attatchClickEventHandlerToCard(card) {
  card.addEventListener('click', () => chooseCard(card))
}

function initializeCardPositions(card) {
  cardPositions.push(card.id)
}

function createElement(elemType) {
  return document.createElement(elemType)

}

function addClassToElement(elem, className) {
  elem.classList.add(className)
}

function addIdToElement(elem, id) {
  elem.id = id
}

function addSrcToImageElem(imgElem, src) {
  imgElem.src = src
}

function addChildElement(parentElem, childElem) {
  parentElem.appendChild(childElem)
}

function addCardToGridCell(card) {
  const cardPositionClassName = mapCardIdToGridCell(card)

  const cardPosElem = document.querySelector(cardPositionClassName)

  addChildElement(cardPosElem, card)

}

function mapCardIdToGridCell(card) {

  if (card.id == 1) {
    return '.card-pos-a'
  } else if (card.id == 2) {
    return '.card-pos-b'
  } else if (card.id == 3) {
    return '.card-pos-c'
  } else if (card.id == 4) {
    return '.card-pos-d'
  } else if (card.id == 5) {
    return '.card-pos-e'
  } else if (card.id == 6) {
    return '.card-pos-f'
  }
}

//local storage functions
function getSerializedObjectAsJSON(obj) {
  return JSON.stringify(obj)
}

function getObjectFromJSON(json) {
  return JSON.parse(json)
}

function updateLocalStorageItem(key, value) {
  localStorage.setItem(key, value)
}

function removeLocalStorageItem(key) {
  localStorage.removeItem(key)
}

function getLocalStorageItemValue(key) {
  return localStorage.getItem(key)
}

function updateGameObject(score, round) {
  gameObj.score = score
  gameObj.round = round
}

function saveGameObjectToLocalStorage(score, round) {
  updateGameObject(score, round)
  updateLocalStorageItem(localStorageGameKey, getSerializedObjectAsJSON(gameObj))
}
