import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import styled from "styled-components/native";


const formTypes = [
    { title: 'Vendor', type: 'VF' },
    { title: 'Work Auth', type: 'WAF' },
    // { title: 'CO1', type: 'CO1' },
    // { title: 'CO2', type: 'CO2' },
    // { title: 'CO3', type: 'CO3' },
]

const MenuWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  `

export default function TabMenu({ formName, setFormName }) {
    return (
        <ScrollView horizontal>
            <MenuWrapper>
                {
                    formTypes.map(({ type, title }, i) =>
                        <Button
                            onPress={() => setFormName(type)}
                            key={i} 
                            mode={formName === type ? 'contained' : 'text'}
                        >
                            {title}
                        </Button>)
                }
            </MenuWrapper>
         </ScrollView>
    )
}