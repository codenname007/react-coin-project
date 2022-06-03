import { Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Togglebutton from "../components/ToggleButton";
import { fetchCoins } from "./api";


const Container = styled.div`
display : flex;
flex-direction: column;
margin : 0 auto;
max-width : 480px;
`;

const Loading = styled.div`
display : flex;
justify-content:center;
align-items:center ;
height: 100vh;
font-size: 30px;
`;

const Header = styled.header`
margin : 50px 0;
text-align : center;
`;

const Title = styled.h1`
font-size :40px;
color : ${(props) => props.theme.accentColor}
`;

const Content = styled.article`
overflow: auto;
height: 80vh; 
`;

const Coinlist = styled.ul`
`;

const Coin = styled.li`
color : ${(props) => props.theme.textColor};
background-color : ${(props) => props.theme.listColor};
padding : 20px;
margin : 20px;
border-radius : 10px;
a{
  display : flex;
  transition : color 0.2s ease-in;
  align-items: center;
}
&:hover{
  transform :scale(1.05);

  a{
    color : ${(props) => props.theme.accentColor};
  }
}
`;


const Img = styled.img`
width : 35px;
height : 35px;
margin-right : 10px; 

`;

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




function Coins(){
  const {isLoading, data} = useQuery<Icoin[]>("allCoins", fetchCoins);
  const sliceData = data?.slice(0,100);

  return (
    <Container>
      <Helmet>
      <title>Coin Tracker</title>
      </Helmet>
      {isLoading ? (<Loading>Loading...</Loading>) : (<>
        <Header>
        <Title>Coin Tracker</Title>
        <Togglebutton/>
      </Header>
        <Content>
        <Coinlist>
          {sliceData?.map((element, index) => (<Coin key={index}>
          <Link 
          to = {`/${element.id}`} 
          state ={{
            name : element.name,
          }}
          >
          <Img src={`https://cryptocurrencyliveprices.com/img/${element.id}.png`}/>{element.name}&rarr;</Link>
          </Coin>)
          )}
        </Coinlist>
      </Content>
      </>)}
    </Container>
  
  );
}

export default Coins;