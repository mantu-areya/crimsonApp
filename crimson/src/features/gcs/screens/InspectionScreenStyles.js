import { Searchbar } from "react-native-paper";
import styled from "styled-components";
import { FlatList, View, ImageBackground, Pressable } from 'react-native';
import { ActivityIndicator } from "react-native-paper";



const SearchContainer = styled(Searchbar)`
margin-top:${(props) => props.theme.space[3]};
height:40px;
`;

const CardList = styled(FlatList).attrs({
contentContainerStyle: {
  padding: 10,
  alignItems: "center",
},
})``;

const BackNavigator = styled(Pressable)`
width:100px;
height:30px;
margin-left:1px;
`;

const HeaderCard = styled(View)`
height:250px;
border-radius:55px;
border-bottom-left-radius: 28px;
border-bottom-right-radius: 28px;
background-color:"red";
`;

const HeaderCardCover = styled(ImageBackground)`
flex:1
`;

const HeaderCardBody = styled.View`
margin:${(props) => props.theme.space[3]};
margin-top:${(props) => props.theme.space[6]};
`;

const ActionsSection = styled.View`
margin:${(props) => props.theme.space[3]};
`;

const AppBody = styled.View`
  flex:1;
  background-color:${(props) => props.theme.colors.bg.primary};
`;

const ListContainer = styled.View`
margin-bottom:30px;
flex:1;
`;

const LoadingContainer = styled.View`
position: absolute;
top: 50%;
left: 50%;
`;
const Loading = styled(ActivityIndicator)`
margin-left: -25px;
`;


export {
    SearchContainer,
    CardList,
    BackNavigator,
    HeaderCard,
    Loading,
    LoadingContainer,
    ListContainer,
    AppBody,
    ActionsSection,
    HeaderCardBody,
    HeaderCardCover
}