

import { Card } from "react-native-paper";
import styled from "styled-components/native";
import NumericInput from 'react-native-numeric-input'
import { Platform,TextInput, ImageBackground, Pressable,Dimensions, TouchableOpacity } from 'react-native';
import { Row } from "react-native-responsive-grid-system";


export const CollapseSectionHeader = styled.View`
flex-direction: row;
align-items: center;
padding-left:10px;
padding-right:15px;
`;

export const SectionHeaderEnd = styled.View`
flex: 1;
flex-direction: row;
justify-content: flex-end;
`;

export const InspectionDetails = styled.View`
padding:5px;
background-color:red;
`;

export const SectionContainer = styled.View`
padding:10px;
`;

export const FormCard = styled(Card)`
  border-radius:10px;
`;

export const CardHeader = styled.View`
  background-color:#90EE90;
  border-radius-top:10px;
  padding:5px
  border-top-left-radius:10px;
  border-top-right-radius:10px;

`;

export const CardBody = styled.View`
padding:5px
border-bottom-left-radius:10px;
border-bottom-right-radius:10px;

`;

export const TotalContainer = styled.View`
flex: 1;
flex-direction: row;
justify-content: flex-end;
`;

export const InfoTextArea = styled.View`
    flex:1
    margin-top:30%;
    alignItems: center;

`;

export const ActionContainer=styled.View`
flex: 1;
flex-direction: row;
`


export const NumberInput = styled(NumericInput).attrs({
  totalWidth: Platform.isPad ? 115 : 60,
  totalHeight:Platform.isPad ? 40 : 30,
  rounded: true,
  rightButtonBackgroundColor: "#a3dfa0",
  leftButtonBackgroundColor: "#a3dfa0",
  // type:"up-down",
  extraTextInputProps: {
    multiline: true,
    
  },
  inputStyle:{
    textAlign:'center'

  }

})``;

export const TextArea = styled(TextInput).attrs({
  multiline: true,
})`
border:.2px;
border-radius:5px;
backgroundColor:#E8E8E8;
${Platform.isPad?`height:40px`:`height:30px`}
margin-bottom:5px;
`;


export const OtherFormTextArea = styled(TextInput).attrs({
  multiline: true,
})`
border:.2px;
border-radius:5px;
backgroundColor:#E8E8E8;
${Platform.isPad?`height:130px`:`height:90px`}
margin-bottom:5px;
margin-top:5px;
`;


export const HeaderCardCover = styled.View`
flex:1
background-color:"black"
`;

export const HeaderCardBody = styled.View`
  margin:${(props) => props.theme.space[2]};
`;
export const InfoCardBody = styled.View`
  margin:${(props) => props.theme.space[2]};
`;

export const HeaderCard = styled.View`
background-color:black;
padding-left:${(props) => props.theme.space[2]};
`;

export const InfoCard = styled.View`
height:400px;
background-color:red;
`;
export const Heading = styled.View
`
margin-left:${(props) => props.theme.space[1]};
`;

export const Body = styled.View`
`;

export const CardRow = styled(Row)`
margin-top:${(props) => props.theme.space[4]};
`;


export const ExpandSection =styled.View`
padding:5px;
`;

export const PressableIcon = styled(Pressable)`
flex:1;
${Platform.isPad ? `width: ${50}px`:`width: ${25}px`};
justifyContent:center;
alignItems:center;
`;

export const BackNavigator = styled(Pressable)`
width:100px;
height:30px;
margin-left:-7px;
`;

export const CarousalScrren = styled.View`
width : ${Dimensions.get('window').width}px;
`;

export const Camerabutton = styled(TouchableOpacity)`
`;