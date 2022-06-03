import { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins, fetchPrice } from "./api";


interface IPriceType{
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: Date;
  last_updated: Date;
  quotes: {
    USD: {
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_15m: number;
      percent_change_30m: number;
      percent_change_1h: number;
      percent_change_6h: number;
      percent_change_12h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_1y: number;
      ath_price: number;
      ath_date: Date;
      percent_from_price_ath: number;
    }
  }
};

interface IPriceprop {
  coinId : string,
}

interface Icoin{
  id : string,
  name : string,
  symbol : string,
  rank : number,
  is_new : boolean,
  is_active : boolean,
  type : string,
  index : number,
}

interface RouteState{
  state:{
    name : string,
    price : number,
  }
}

const Container = styled.div`
display :flex;
flex-direction : column;
padding: 20px;
background-color: ${(props)=>props.theme.listColor};
border-radius: 10px;
color : ${(props)=>props.theme.textColor};
`;

const Header = styled.h1`
text-align:center;
font-size : 20px;
text-transform : uppercase;
margin-bottom: 20px ;
`;

const Select = styled.select`
margin-bottom : 20px`;


const Input = styled.input`
margin-bottom : 20px
`;

const Label = styled.label`
margin-bottom : 20px
`;

function Price({coinId} : IPriceprop){
  const {isLoading, data} = useQuery<Icoin[]>("allCoins", fetchCoins);
  const {state} = useLocation() as RouteState;
  const sliceData = data?.slice(0,100);
  const coinName = sliceData?.map(element => element.name);
  const idArray = sliceData?.map(element => element.id);
  const [index, setIndex] = useState(0);
  const[value, setValue] = useState("");
  const[currPrice ,setPrice] = useState(0);

  useEffect(() => {
    fetch(`https://api.coinpaprika.com/v1/tickers/${idArray? idArray[index] : "btc-bitcoin"}`)
    .then(res => res.json())
    .then(json => setPrice(json.quotes.USD.price))}
    , [index]);


  const onChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
    setValue("");
    setIndex(parseInt(event.currentTarget.value));
  };

  const valueChanged = (event : React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  let getCoin:number = (parseInt(value)*state.price)/(currPrice);


  return (<div>
    {isLoading? "Loading..." : (
     <Container>
      <Header>Exchanger</Header>
      <Select value = {index} onChange = {onChange}>
         {sliceData?.map((element, index) => 
        <option value = {index} key = {element.id}>
          {element.name}
        </option>)}
      </Select>
      <Label htmlFor = "coin">{state.name} [Current Price : ${state.price}]</Label>
      <Input id ="coin" placeholder="Enter number of Coin you have"
      value = {value} onChange = {valueChanged}/>
      <Label htmlFor = "change">{coinName? coinName[index]: {coinId}} [Current Price : ${currPrice}]</Label>
      <Input id ="change" placeholder="How much you get?"
      value= {getCoin? `${getCoin}` : "0"}
     disabled/>

     </Container> 
    )}
  </div>
  );
}

export default Price;