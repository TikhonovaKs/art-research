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
  
    getAllArtObjects() {
      return fetch(`${this._url}api/v1/artworks?limit=16`, {
        method: 'GET',
        headers: this._headers,
      }).then(this._checkResponse);
    }
  }
  
  const artApi = new ArtApi({
    url: 'https://api.artic.edu/',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
  });
  
  export default artApi;
  