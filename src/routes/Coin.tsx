import { Fragment, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Route, Routes, useLocation, useParams, useMatch} from "react-router-dom";
import styled, { StyledInterface } from "styled-components";
import { fetchInfo, fetchPrice } from "./api";
import Chart from "./Chart";
import Price from "./Price";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons";
import Togglebutton from "../components/ToggleButton";

const Container = styled.div`
display : flex;
flex-direction: column;
margin : 0 auto;
max-width : 480px;
`;

const Loading = styled.div`
display : flex;
justify-content:center;
align-items:center;
height: 80vh;
font-size: 30px;
`;

const Header = styled.header`
text-align : center;
margin : 50px 0;
position: relative;
width: 100%;
`;

const Title = styled.h1`
font-size :40px;
color : ${(props) => props.theme.accentColor}
`;

const TextContainer = styled.div`
display : flex;
justify-content:space-between;
background-color: ${(props) => props.theme.listColor};
border-radius: 10px;
padding : 20px;
`;

const Text = styled.div`
display :flex;
flex-direction: column;
align-items: center;

span:first-child{
  font-size:10px;
  font-weight : 400;
  text-transform: uppercase;
  margin-bottom: 5px;
}
`;

const Context = styled.span`
padding : 5px;
`; 

const Description = styled.p`
margin : 10px;
font-size: 18px;
line-height: 30px;
`;

const Tabs = styled.div`
display : grid;
grid-template-columns: repeat(2, 1fr);
text-align: center ;
margin : 20px 0;
gap : 10px;

`;

const Tab = styled.span<{isActive:boolean}>`
background-color: ${(props) => props.theme.listColor};
text-transform : uppercase ;
border-radius: 10px;
padding : 15px;
font-size: 15px ;

a{
  display: block;
  color : ${(props) => props.isActive? props.theme.accentColor : props.theme.textColor}
}
`;

interface RouteParams{
  coinId : string;
}

interface RouteState{
  state:{
    name : string,
    price : number,
  }
}


interface IInfoType {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: Date;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: Date;
  last_data_at: Date;
};

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

  type Iparams={
    coinId : string;
  };


function Coin(){
  const {coinId} = useParams() as Iparams;
  const {state} = useLocation() as RouteState;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  const {isLoading : infoLoading, data : infoData} = 
  useQuery<IInfoType>(["info",coinId], () => fetchInfo(coinId));
  const {isLoading:priceLoading, data : priceData} = 
  useQuery<IPriceType>(["price",coinId] ,()=> fetchPrice(coinId),
  {
    refetchInterval : 5000,
  }
  );

  const loading = infoLoading || priceLoading;

    return ( 
      <Container>
      <Helmet>
      <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
      </Helmet>
      <Header>
        <Title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        <Link to="/"><FontAwesomeIcon icon={ faHouse } 
        style = {{
          color : "#FFA400",
          position : "absolute",
          right : 20,
          top : 0,
        }}/></Link>
        </Title>
      </Header>
      <Togglebutton/>
        {loading ? (<Loading>Loading...</Loading>) : 
      (<>
        <TextContainer>
        <Text>
        <Context>RANK : </Context>
        <Context>{infoData?.rank}</Context>
        </Text>
        <Text>
        <Context>SYMBOL : </Context>
        <Context>{infoData?.symbol}</Context>
        </Text>
        <Text>
        <Context>Price:</Context>
        <Context>{priceData?.quotes.USD.price.toFixed(2)}</Context>
        </Text>
        </TextContainer>
        <Description>{infoData?.description ?? "No Description"}</Description>
        <TextContainer>
        <Text>
        <Context>TOTAL SUPPLY : </Context>
        <Context>{priceData?.total_supply}</Context>
        </Text>
        <Text>
        <Context>MAX SUPPLY : </Context>
        <Context>{priceData?.max_supply}</Context>
        </Text>
        </TextContainer>

        <Tabs>
        <Tab isActive = {chartMatch !== null}>
        <Link to= {`/${coinId}/chart`}
          state ={{name : infoData?.name}}>
          Chart</Link>
        </Tab>
        <Tab isActive= {priceMatch !== null}>
        <Link 
        to={`/${coinId}/price`}
        state ={{
            name : infoData?.name,
            price : priceData?.quotes.USD.price,
          }}
        >Exchange</Link>
        </Tab>
        </Tabs>
  
        <Routes>
        <Route path ="chart" element = {<Chart coinId ={coinId as string}/>} /> 
        <Route path ="price" element = {<Price coinId = {coinId as string}/>} />
        </Routes>
        </>
        )}

    </Container>
  );

}

export default Coin;
