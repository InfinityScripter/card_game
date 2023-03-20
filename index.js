const cardObjectDefinitions = [
  {id:1, imagePath:'img/card-KingHearth.png'},
  {id:2, imagePath:'img/card-JackClubs.png'},
  {id:3, imagePath:'img/card-QueenDiamonds.png'},
  {id:4, imagePath:'img/card-AceSpades.png'},
]

function createCard(cardItem){
  // Create the card element div
  const cardElement = createElement('div')
  const cardInnerElement = createElement('div')
  const cardFrontElement = createElement('div')
  const cardBackElement = createElement('div')
}

function createElement(elementType){
  return document.createElement(elementType)
}
