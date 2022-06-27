import styled from "styled-components/native";

const defaultTextStyles = (theme) => `
  font-family: ${theme.fonts.body};
  font-weight: ${theme.fontWeights.regular};
  color: ${theme.colors.text.primary};
  flex-wrap: wrap;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const body = (theme) => `
    font-size: ${theme.fontSizes.body};
`;
const CardID = (theme) => `
    font-size: ${theme.fontSizes.title};
    font-family:${theme.fonts.bold};
    color:${theme.colors.text.inverse};
    font-weight: ${theme.fontWeights.large};
`;



const hint = (theme) => `
    font-size: ${theme.fontSizes.body};
`;

const error = (theme) => `
    color: ${theme.colors.text.error};
`;

const caption = (theme) => `
    font-size: ${theme.fontSizes.caption};
    font-weight: ${theme.fontWeights.bold};
`;

const label = (theme) => `
    font-family: ${theme.fonts.heading};
    font-size: ${theme.fontSizes.body};
    font-weight: ${theme.fontWeights.medium};
    color:${theme.colors.text.inverse};
`;

const SectionLabel =  (theme) => `
font-family: ${theme.fonts.heading};
font-size: ${theme.fontSizes.label};
font-weight: ${theme.fontWeights.regular};
color:${theme.colors.text.inverse};
`;

const HeaderName =  (theme) => `
font-size:${theme.fontSizes.h5};
color:${theme.colors.text.inverse};
font-weight:${theme.fontWeights.large};
font-family: ${theme.fonts.bold};
`;

const InspectionHeaderName =  (theme) => `
font-size:${theme.fontSizes.body};
color:${theme.colors.text.primary};
font-weight:${theme.fontWeights.large};
`;


const cardKey = (theme) => `
font-size: ${theme.fontSizes.caption};
font-weight: ${theme.fontWeights.bold};
color:${theme.colors.text.inverse}
`;
const cardValue = (theme) => `
font-size: ${theme.fontSizes.caption};
color:${theme.colors.text.primary}
font-family: ${theme.fonts.heading};
`;

const CarContentHeader = (theme) => `
font-size: ${theme.fontSizes.caption};
color:${theme.colors.text.header1}
font-family: ${theme.fonts.semibold};
`;
const CarContentList = (theme) => `
font-size: ${theme.fontSizes.small};
color:${theme.colors.text.header1}
font-family: ${theme.fonts.body};
`;

const variants = {
  body,
  label,
  caption,
  error,
  hint,
  cardKey,
  cardValue,
  SectionLabel,
  CardID,
  HeaderName,
  CarContentHeader,
  CarContentList,
  InspectionHeaderName
};

export const Text = styled.Text`
  ${({ theme }) => defaultTextStyles(theme)}
  ${({ variant, theme }) => variants[variant](theme)}
`;

Text.defaultProps = {
  variant: "body",
};
