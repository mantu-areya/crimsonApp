import Icon from 'react-native-vector-icons/FontAwesome';
import { IconButton } from "react-native-paper";
import styled from "styled-components/native";




const backIcon = <Icon name="arrow-left" size={12} />;

const ToolBarWrapper = styled.View`
background-color: #2B243E;
padding: 8px;
align-items: center;
justify-content: space-between;

`
const BackNavigatorButton = styled.Text`
color:white;
font-size:12px;
font-weight:bold;
`;

const ToolBarTitle = styled.Text`
color: white;
font-size:16px;
font-family: URBAN_BOLD;
`
export default function Toolbar({ inspectionName, goBack }) {
  return (
    <ToolBarWrapper style={{ flexDirection: 'row' }}>
      {/* Back Button */}
      <BackNavigatorButton onPress={goBack}>
        {backIcon} Back
      </BackNavigatorButton>
      {/* InspectionId */}
      <ToolBarTitle>{inspectionName}</ToolBarTitle>
      {/* Search Icon */}
      <IconButton
        icon={({ size, color }) => (
          <Icon name="search" size={size} color={"white"} />
        )}
        size={16}
        onPress={() => console.log('Pressed')}
      />
    </ToolBarWrapper>
  )
}
