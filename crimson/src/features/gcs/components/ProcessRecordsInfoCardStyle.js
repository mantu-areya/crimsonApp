import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { StyleSheet, ImageBackground, View } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
export const InspectionCard = styled(Card)`
  padding:${(props) => props.theme.space[1]};
  width:280px;
  height:150px;
  border-radius:20px;
  `;

  export const InspectionListCard = styled(View)`
  width:${windowWidth-30}px;
  height:80px;
  `;


export const CardBody = styled(LinearGradient)`
flex:1;
border-radius:12px;
padding:10px;
`;

export const ImageCardBody = styled(ImageBackground)`
width:280px;
height:150px;

`;

export const Info = styled.View`
  padding: ${(props) => props.theme.space[3]};
`;

export const Address = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;

export const Ratings = styled.View`
  padding-top: ${(props) => props.theme.space[2]};
  padding-bottom: ${(props) => props.theme.space[2]};
  flex-direction: row;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Section = styled.View`
padding:${(props) => props.theme.space[2]};
width:100px;
flex:1;
`;



export const Icon = styled.Image`
  width: ${(props) => props.theme.sizes[1]};
  height: ${(props) => props.theme.sizes[1]};
`;

export const SectionEnd = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;




export const SectionBottom = styled.View`
margin-top:40%;
margin-left:4%;
`;

export const Title = styled(View)`
flex:.5;
backgroundColor:red;  
`;


