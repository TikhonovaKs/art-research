class ArtApi {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject('An error has occured');
  }

  searchArtObjects(keyword) {
    return fetch(
      `${this._url}api/v1/artworks/search?q=${keyword}&fields=title,image_id,artist_title,description,date_display,place_of_origin,dimensions,credit_line,inscriptions`,
      {
        method: 'GET',
        headers: this._headers,
      }
    ).then(this._checkResponse);
  }
}

const artApi = new ArtApi({
  url: 'https://api.artic.edu/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const searchButton = document.querySelector('.search__button');
const moreButton = document.querySelector('.result__button-more');
const cardsContainer = document.querySelector('.result');
const form = document.forms.searchform;
const keyword = form.elements.keyword;

// Render card in main page
function renderCard(element) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.card__image').src =
    'https://www.artic.edu/iiif/2/' + element.image_id + '/full/843,/0/default.jpg';
  cardElement.querySelector('.card__title').textContent = element.title;
  cardElement.querySelector('.card__author').textContent = element.artist_title;
  cardElement.querySelector('.card__link').href = 'artPage.html?score=' + element._score;

  cardsContainer.append(cardElement);
}

// Rendering the current card search sheet when the page is reloaded
document.addEventListener("DOMContentLoaded", () => {
  let currentSearchCardList = JSON.parse(localStorage.getItem('latestFilteredCards') || '[]');

  currentSearchCardList.forEach((item) => {
    renderCard(item);
  });
});

// Search art elements by keyword
function searchArtElement(keyword) {
  // Clean card container before new search
  cardsContainer.innerHTML="";
  // Clean currentSearchCardList in Local Stor.
  let currentSearchCardList = [];

  artApi.searchArtObjects(keyword)
    .then((data) => {
    data.data.forEach((element) => {
      renderCard(element);
      // Save the updated array back to local storage
      currentSearchCardList.push(element);
    });
    localStorage.setItem('latestFilteredCards', JSON.stringify(currentSearchCardList));

    //moreButton.classList.add('result__button-more_visible'); //not emplemented yet
  });
}

// FORM:
// - attach an input event handler to the form
form.addEventListener('input', function (evt) {
  const isValid = keyword.value.length > 0;

  setSubmitButtonState(isValid);
});
// - swith button condition
function setSubmitButtonState(isValid) {
  if (isValid) {
    searchButton.removeAttribute('disabled');
    searchButton.classList.remove('search__button_disabled');
  } else {
    searchButton.setAttribute('disabled', true);
    searchButton.classList.add('search__button_disabled');
  }
}
// - attach a submit event handler to the form
form.addEventListener('submit', function (evt) {
  evt.preventDefault();

  // check user data
  searchArtElement(keyword.value);

  // reset field after submitiom
  form.reset();

  setSubmitButtonState(false);
});



