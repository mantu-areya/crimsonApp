import React from "react";
import { TouchableOpacity } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Text } from "../../../components/typography/text.component"

import {
  IconImage,
  ActionsLabel,
  IconCard,
  ActionCard,
  ActionsList
} from './QuickActionsListStyles.js'


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