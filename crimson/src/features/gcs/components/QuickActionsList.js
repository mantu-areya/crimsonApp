import React from "react";
import { FlatList, View, Image,TouchableOpacity } from "react-native";
import styled from "styled-components";
import { Card } from "react-native-paper"
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component"


const ActionsList = styled(FlatList)`
margin-top: ${(props) => props.theme.space[2]};
padding:${(props) => props.theme.space[2]};
margin-left:4%;
flex:1
`;

const ActionCard = styled(View)`
width:90%;
height:100px;
`;

const IconCard = styled(Card)`
background-color:${(props) => props.theme.colors.bg.secondary};
    flex:9;
    background-color:#EEEEEE;
    border-radius:25px;
    alignItems: center;
`;

const ActionsLabel = styled.View`
margin-top:${(props) => props.theme.sizes[0]};
alignItems: center;

`;

const IconImage = styled(Image)` 
 margin-top:${(props) => props.theme.sizes[0]};
 flex:1
 
`;

export const QuickActionsList = ({navigation}) => {



  const actions = [
    {
      label: "Inspections"
    },
    {
      label: "Turns"
    },
    {
      label: "Initial Rehab"
    }
  ]

  return (
    < ActionsList
      horizontal
      data={actions}
      keyExtractor={(item) => item.label}
      renderItem={(item,i) => (
        <>
          <Spacer position="right" size="medium">
          <TouchableOpacity onPress={()=>navigation.navigate('Inspections')}>
            <ActionCard>

              <IconCard>
              <IconImage source={require("../../../assets/images/ActionIcon.png")}/>
              </IconCard>
              <ActionsLabel>
              <Text variant="caption">{item.item.label}</Text>
              </ActionsLabel>
            </ActionCard>
            </TouchableOpacity>
          </Spacer>
        </>

      )}
    />
  )


}