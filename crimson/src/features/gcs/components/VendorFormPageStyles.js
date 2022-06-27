

import { Card } from "react-native-paper";
import styled from "styled-components/native";


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
  background-color:black;
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