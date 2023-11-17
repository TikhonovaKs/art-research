// Get current URL
const currentUrl = window.location.href;

// Split the URL by '?' to get the part after the question mark
const urlParams = new URLSearchParams(currentUrl.split('?')[1]);

// Get the "score" parameter value from the URL
const scoreParam = urlParams.get('score');
const scoreParamNumber = Number(scoreParam);

const pageContainer = document.querySelector('.result-page');

// Render art page
function renderArtPage(element) {
  console.log(element);
  const artTemplate = document.querySelector('#artpage-template').content;
  const cardElement = artTemplate.cloneNode(true);

  cardElement.querySelector('.image__item').src =
    'https://www.artic.edu/iiif/2/' + element.image_id + '/full/843,/0/default.jpg';
  cardElement.querySelector('.info__title').textContent = element.title;
  cardElement.querySelector('#subtitle-author').textContent = element.artist_title;
  cardElement.querySelector('#subtitle-data').textContent = element.date_display;
  cardElement.querySelector('.info__description').textContent = element.description;
  cardElement.querySelector('#artist').textContent = element.artist_title;
  cardElement.querySelector('#title').textContent = element.title;
  cardElement.querySelector('#place').textContent = element.place_of_origin;
  cardElement.querySelector('#inscriptions').textContent = element.inscriptions;
  cardElement.querySelector('#dimensions').textContent = element.dimensions;
  cardElement.querySelector('#credit-line').textContent = element.credit_line;

  pageContainer.append(cardElement);
}

// Get all elements from localStorage
let currentSearchCardList = JSON.parse(localStorage.getItem('latestFilteredCards'));
console.log(currentSearchCardList);

// sort through the currentSearchCardList and find card with the same score
currentSearchCardList.forEach((card) => {
  if (card._score === scoreParamNumber) {
    renderArtPage(card);
  }
});
