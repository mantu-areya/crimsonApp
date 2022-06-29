

import { Card } from "react-native-paper";
import styled from "styled-components/native";
import NumericInput from 'react-native-numeric-input'
import { Platform,TextInput } from 'react-native';


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
  totalWidth: Platform.isPad ? 95 : 60,
  totalHeight:Platform.isPad ? 40 : 30,
  rounded: true,
  rightButtonBackgroundColor: "#a3dfa0",
  leftButtonBackgroundColor: "#a3dfa0",
  // type:"up-down",
  extraTextInputProps: {
    multiline: true, 
  },
  containerStyle: {
    marginBottom: 5
  }
})``;

export const TextArea = styled(TextInput).attrs({
  multiline: true,
})`
border:.2px;
border-radius:5px;
backgroundColor:#E8E8E8;
height:30px;
margin-bottom:5px;

`;