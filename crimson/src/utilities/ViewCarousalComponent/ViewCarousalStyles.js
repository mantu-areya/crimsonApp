import {
  Pressable,
  TouchableOpacity,
} from 'react-native';
import styled from "styled-components";

const DotCirle = styled(TouchableOpacity)`
height: 25px;
width: 25px;
background-color: #bbb;
border:1px #bbb;
border-radius: 50px;
margin-right:5px;
`;

const ActiveCircle = styled(TouchableOpacity)`
height: 25px;
width: 25px;
border:1px #bbb;
border-radius: 50px;
margin-right:5px;
`;

const ArrowContainer = styled.View`
  alignItems:center;
`;


const PageIndicators = styled(Pressable)`
  alignItems:center;
`;

const CategoryCard = styled(Pressable)`
background-color:#bbb;
padding:10px;
border-radius:10px;
margin:2%;
`;

const CategoryButton =styled(Pressable)`
background-color:#D3D3D3;
margin:2px;
margin-right:5px;
border-radius:5px;
padding:1%;
margin-bottom:2%;
`

export {
    CategoryButton,
    CategoryCard,
    PageIndicators,
    ArrowContainer,
    ActiveCircle,
    DotCirle
}