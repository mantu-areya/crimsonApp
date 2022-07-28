import styled from "styled-components/native";
import { View, ScrollView, Pressable } from "react-native";

export const FormSections = styled.View`
`;

export const FormSectionsContainer = styled(Pressable)`
border-bottom-color: ${(props) => props.variant=="active"?props.theme.colors.text.linkText:'black'};
border-bottom-width: 2px;
padding:${(props) => props.theme.space[1]};
`;
