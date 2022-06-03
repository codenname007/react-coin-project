import { isDarkAtom } from "../routes/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";


const Button = styled.button`
color : ${(props) => props.theme.textColor};
background-color : ${(props) => props.theme.listColor};
position : absolute;
top : 50px;
left : 100px;
border-radius : 10px;
border: none;
padding : 10px;
margin : 10px;
`;


function Togglebutton(){
  const setterFn = useSetRecoilState(isDarkAtom);
  const isDark = useRecoilValue(isDarkAtom);
  const toggleDarkAtom = () => setterFn((prev) => !prev);


  return(
  <>
  <Button onClick ={toggleDarkAtom}>{isDark? "Dark Mode" : "Light Mode"}</Button>
  </>
  );
  
  

}

export default Togglebutton;