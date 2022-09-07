import { Platform } from "react-native";
import styled from "styled-components/native";

const width = Platform.isPad ? 115 : 60;
const height = Platform.isPad ? 40 : 30;

const InputBoxHolder = styled.View`
    flex-direction: row;
    border-width: 1px;
    border-color: #fff0f0;
    border-radius: 8;
    width:${width}px;
    height:${height}px;
  `

const InputButtonWrapper = styled.TouchableOpacity`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #a3dfa0;
  `
const InputFieldWrapper = styled.TouchableOpacity`
    width: 18px;
    height: 29px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  `


export { InputFieldWrapper, InputButtonWrapper, InputBoxHolder }