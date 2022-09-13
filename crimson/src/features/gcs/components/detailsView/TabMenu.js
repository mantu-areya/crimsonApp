import { Button } from "react-native-paper";
import styled from "styled-components/native";


const formTypes = [
    { title: 'Vendor Form', type: 'VF' },
    { title: 'Work Auth Form', type: 'WAF' },
    { title: 'CO1', type: 'CO1' },
    { title: 'CO2', type: 'CO2' },
    { title: 'CO3', type: 'CO3' },
  ]
  
  const MenuWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  `
  
  export default function TabMenu({formName,setFormName}) {
    return (
      <MenuWrapper>
        {
          formTypes.map(({type}, i) => <Button onPress={() => setFormName(type)} key={i} mode={formName === type ? 'contained' : 'outlined' } >{type}</Button>)
        }
      </MenuWrapper>
    )
  }