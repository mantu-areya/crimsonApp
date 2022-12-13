import styled from "styled-components/native";
import { View, ScrollView, Pressable } from "react-native";
import CheckBox from 'react-native-check-box'
import { Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Text } from "../../../components/typography/text.component";
const windowWidth = Dimensions.get('window').width;

export const ExpandSection = styled.View`
padding:5px;
backgroundColor:white;
`;

export const Header = styled.View`
flex:1
alignItems:center
`

export const ErrorBanner = styled.View`
height:100%;
width:98%;
alignItems:center;
backgroundColor:red;
`

export const CheckListbox = styled(CheckBox)``
// export const SelectBox = styled(Picker)``


export const InputField = styled(TextInput).attrs({
  mode: 'outlined',
})`
  height:30px;
`

export const RequireMarkText = styled(Text)`
color:red

`
