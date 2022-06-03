
const BASE_URL = `https://api.coinpaprika.com/v1/`;


export function fetchCoins(){
  return (
    fetch(`${BASE_URL}coins`)
  .then(response => response.json())
    );
}


export function fetchInfo(coinId:string){

  return (
    fetch(`${BASE_URL}coins/${coinId}`)
    .then(response => response.json())
    );
}


export function fetchPrice(coinId :string){

  return (
    fetch(`${BASE_URL}tickers/${coinId}`)
  .then(response => response.json())
    );
}

const end = Math.floor(Date.now()/1000);
const start = end - (60*60*24*6);

export function fetchChart(coinId :string){

  return (
    fetch(`${BASE_URL}coins/${coinId}/ohlcv/historical?start=${start}&end=${end}`)
  .then(response => response.json())
    );
}