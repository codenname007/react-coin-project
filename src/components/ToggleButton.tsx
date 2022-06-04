import { isDarkAtom } from "../routes/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";


const Button = styled.button`
color : ${(props) => props.theme.textColor};
background-color : ${(props) => props.theme.listColor};
border-radius : 10px;
border: none;
padding : 10px;
margin : 10px;
position : absolute;
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