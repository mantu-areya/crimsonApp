import { FlatList, View, Image } from "react-native";
import styled from "styled-components";
import { Card } from "react-native-paper"

const ActionsList = styled(FlatList)`
margin-top: ${(props) => props.theme.space[2]};
padding:${(props) => props.theme.space[2]};
margin-left:4%;
flex:1
`;

const ActionCard = styled(View)`
width:90%;
height:100px;
`;

const IconCard = styled(Card)`
background-color:${(props) => props.theme.colors.bg.secondary};
    flex:9;
    background-color:#EEEEEE;
    border-radius:25px;
    alignItems: center;
`;

const ActionsLabel = styled.View`
margin-top:${(props) => props.theme.sizes[0]};
alignItems: center;

`;

const IconImage = styled(Image)` 
 margin-top:${(props) => props.theme.sizes[0]};
 flex:1
 
`;

export {
    IconImage,
    ActionsLabel,
    IconCard,
    ActionCard,
    ActionsList
}