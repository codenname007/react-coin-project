import { useQuery } from "react-query";
import { fetchChart } from "./api";
import ApexChart from "react-apexcharts";
import styled, { AnyStyledComponent, withTheme } from "styled-components";
import { useLocation } from "react-router-dom";
import { faBlackberry } from "@fortawesome/free-brands-svg-icons";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atom";

interface IChartprop {
  coinId : string;
}

interface IchartData {
  close:number;
  high: number;
  low: number;
  market_cap: number;
  open: number;
  time_close: string;
  time_open: string;
  volume: number;
}

interface IcoinName{
  state :{
    name : string,
  },
}

const Container = styled.div`
background-color : ${(props)=>props.theme.listColor};
border-radius : 10px;
box-sizing : border-box;
color : ${(props)=>props.theme.textColor};
`;


const Header= styled.h1`
text-align:center;
font-size : 20px;
text-transform : uppercase;
padding : 20px;
`;


function Chart({coinId} : IChartprop){
  const {isLoading, data} = useQuery<IchartData[]>(["chart", coinId], ()=> fetchChart(coinId));
  const {state} = useLocation() as IcoinName;
  const isDark = useRecoilValue(isDarkAtom);

  const dataArray = data?.map((price) => [
    new Date(price.time_open).getTime(), 
    price.open.toFixed(3), 
    price.high.toFixed(3), 
    price.low.toFixed(3), 
    price.close.toFixed(3)]) as any;

  return ( <div>
    {isLoading? "Loading chart..." : (
   <Container>
    <Header>{state.name} For Last One Weeks</Header>
    <ApexChart 
    type="candlestick"
    series={[
      {data : dataArray}
      ]}
    options ={{
      theme :{
        mode : isDark? "dark" : "light",
      },
      chart: {
        toolbar : {
          show : true,
        },
        type: 'candlestick',
        height: '100%',
        background: 'transparent',
        foreColor : 'black',
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00B746',
            downward: '#EF403C'
          },
          wick: {
            useFillColor: true,
          },
        
      },
      },
      xaxis: {
        type: 'datetime',
        axisTicks : {show : false,},
        axisBorder : {show : false,},
        labels:{
          show : false,
        },

      },
      yaxis: {
        show : false,
      },
      grid:{
        show : false,
      },
      tooltip:{
        theme : 'dark',
      },
    }}
    />
    </Container>)}
  </div>
  );
}

export default Chart;