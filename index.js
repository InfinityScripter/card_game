const cardObjectDefinitions = [
  {id:1, imagePath:'/images/card-KingHearts.png'},
  {id:2, imagePath:'/images/card-JackClubs.png'},
  {id:3, imagePath:'/images/card-QueenDiamonds.png'},
  {id:4, imagePath:'/images/card-AceSpades.png'}
]
console.log(cardObjectDefinitions)

const cardBackImgPath = '/images/card-back-Blue.png'

const cardContainerElement = document.querySelector('.card-container')


createCards()

function createCards() {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem)
  })
}



// <div className="card">
//   <div className="card-inner">
//     <div className="card-front">
//       <img src="img/card-JackClubs.png" alt="" className="card-img">
//     </div>
//     <div className="card-back">
//       <img src="img/card-back-Blue.png" alt="" className="card-img">
//     </div>
//   </div>
// </div>

function createCard(cardItem) {
  // Создайте элемент div карты, который составляет карту
  const cardElem = createElement('div')
  const cardInnerElem = createElement('div')
  const cardFrontElem = createElement('div')
  const cardBackElem = createElement('div')

  //создать элемент изображения карты спереди и рубашки
  const cardFrontImg = createElement('img')
  const cardBackImg = createElement('img')

  // Добавьте класс и идентификатор в элемент карты
  addClassToElement(cardElem, 'card')
  addIdToElement(cardElem, cardItem.id)

  // Добавьте класс и идентификатор во внутренний элемент карты
  addClassToElement(cardInnerElem, 'card-inner')

  //Добавьте класс и идентификатор к переднему элементу карты
  addClassToElement(cardFrontElem, 'card-front')

  //Добавьте класс и идентификатор к элементу рубашки карты
  addClassToElement(cardBackElem, 'card-back')

  // Добавьте атрибут src к элементу изображения карты — обратная сторона карты
  addSrcToImageElement(cardBackImg, cardBackImgPath)

  //Добавьте атрибут src к элементу изображения карты — лицевая сторона карты
  addSrcToImageElement(cardFrontImg, cardItem.imagePath)

  //назначить класс элементу изображения рубашки карты
  addClassToElement(cardBackImg, 'card-img')

  //назначить класс переднему элементу изображения лицевой стороны карты
  addClassToElement(cardFrontImg, 'card-img')

  //добавить элемент изображения лицевой стороны в качестве дочернего элемента лицевой стороны карточки
  addChildElement(cardFrontElem, cardFrontImg)

  //добавить элемент рубашки карты в качестве дочернего элемента к внутреннему элементу карты
addChildElement(cardBackElem, cardBackImg)

  //добавить элемент лицевой карты в качестве дочернего элемента внутреннего элемента карты
  addChildElement(cardInnerElem, cardFrontElem )

  //добавить рубашку элемент карты обратно в качестве дочернего элемента карты
  addChildElement(cardInnerElem, cardBackElem)

  //добавить внутренний элемент карты в качестве дочернего элемента элемента карты
  addChildElement(cardElem, cardInnerElem)

  //добавить элемент карты в качестве дочернего элемента в соответствующую ячейку сетки
  addCardToGridCell(cardElem)
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

function addSrcToImageElement(imgElem, src) {
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
    return ".card-pos-a";
  } else if (card.id == 2) {
    return ".card-pos-b";
  } else if (card.id == 3) {
    return ".card-pos-c";
  } else if (card.id == 4) {
    return ".card-pos-d";
  }
}
