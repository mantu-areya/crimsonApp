import styled from "styled-components/native";
import { Card } from "react-native-paper";
import { StyleSheet, Text, View } from 'react-native';

export const SectionLabel = styled.View`
padding:${(props) => props.theme.space[1]};
margin-left:${(props) => props.theme.space[2]};
`;

