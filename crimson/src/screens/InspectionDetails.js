import { View, Text, TouchableOpacity, ScrollView, FlatList, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'
import Hero from '../components/inspection-details/Hero'
import CTA from '../components/inspection-details/CTA'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import styled from 'styled-components/native'
import Overlay from 'react-native-modal-overlay';
import Ionicons from "react-native-vector-icons/Ionicons"
import { Button } from "react-native-paper"


const menuItems = [
  {
    title: 'General Rental Operations Scope',
    icon: <MaterialCommunityIcons size={28} name='home-city' color={"#DE9B67"} />
  },
  {
    title: 'Interior',
    icon: <MaterialCommunityIcons size={28} name='home-account' color={"#36905C"} />

  },
  {
    title: 'Exterior',
    icon: <MaterialCommunityIcons size={28} name='home' color={"#7A8AE7"} />

  },
  {
    title: 'Pools',
    icon: <MaterialIcons size={28} name='pool' color={"#DE9B67"} />

  },
  {
    title: 'Mechianical',
    icon: <MaterialIcons size={28} name='handyman' color={"#F1A8AC"} />
  },
]

const InspectionDetails = () => {
  const [currentForm, setCurrentForm] = React.useState("General Scope Notes")
  const currentFormData = new Array(20).fill(1).map((v, i) => (currentForm + (i * v)))

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {/* Hero */}
        <Hero />
        {/* CTA's */}
        <CTA handleOnChat={() => alert("Chat")} handleOnSubmit={() => alert("Submit")} />
        {/* Forms */}
        <View style={{ height: 360 }}>
          {/* Menu */}
          <MenuWrapper >
            {
              menuItems.map((item, i) => <MenuItem onPress={() => setCurrentForm(item.title)} key={i}>{item.icon}</MenuItem>)
            }
          </MenuWrapper>
          <CurrentFormHeading>{currentForm}</CurrentFormHeading>
          <FlatList
            data={currentFormData}
            keyExtractor={item => item}
            renderItem={({ item }) => <FormLineItem item={item} onPress={() => setOverlayVisible(true)} />}
          />
        </View>


      </ScrollView>
      {/* Call Now */}
      <CallNow />
    </SafeAreaView>
  )
}

function FormLineItem({ item }) {
  const [overlayVisible, setOverlayVisible] = React.useState(false)

  return (
    <>
      <LineItemWrapper >
        <View style={{ flex: 1 }}>
          <LineItemHeading>
            {item}
          </LineItemHeading>
          <LineItemInputGroup>
            {/* QTY */}
            <LineItemInputText onPress={() => setOverlayVisible(true)}>Qty +</LineItemInputText>
            {/* RATE */}
            <LineItemInputText onPress={() => setOverlayVisible(true)}>Rate +</LineItemInputText>
            {/* NOTES */}
            <LineItemInputText onPress={() => setOverlayVisible(true)}>Notes +</LineItemInputText>
          </LineItemInputGroup>
        </View>
        {/* Icon */}
        <Ionicons name="camera" size={24} />

      </LineItemWrapper>
      <Overlay visible={overlayVisible} onClose={() => setOverlayVisible(false)} closeOnTouchOutside >

        <LineItemHeading>
          {item}
        </LineItemHeading>

        <StyledTextInputLabel>Quantity</StyledTextInputLabel>
        <StyledTextInput placeholder="Qty" />

        <StyledTextInputLabel>U/A</StyledTextInputLabel>
        <StyledTextInput placeholder="U/A" />

        <StyledTextInputLabel>Rate</StyledTextInputLabel>
        <StyledTextInput placeholder="Rate" />

        <StyledTextInputLabel>Total</StyledTextInputLabel>
        <StyledTextInput editable={false} placeholder="Total" />

        <StyledTextInputLabel>Scope Notes</StyledTextInputLabel>
        <StyledTextInput placeholder="Scope Notes" />

        <StyledSaveButton mode="contained">Save</StyledSaveButton>

      </Overlay>
    </>
  )

}

const LineItemWrapper = styled.TouchableOpacity`
background-color: #F1F4F8;
padding: 16px 32px 8px;
flex-direction: row;
`;

const LineItemHeading = styled.Text`
font-size: 16px;
font-family: 'URBAN_REGULAR';
`;

const LineItemInputGroup = styled.View`
flex-direction: row;
`;

const LineItemInputText = styled.Text`
font-family: 'URBAN_BOLD';
font-size: 16px;
color: #469869;
flex: 1;

`;

const StyledTextInputLabel = styled.Text`
font-size: 14px;
font-family: 'URBAN_BOLD';
align-self: start;
margin-bottom: 4px;
`;

const StyledTextInput = styled.TextInput`
background-color: #d9d9d980;
border-radius: 4px;
width: 100%;
padding:12px;
margin-bottom: 8px;
`;

const StyledSaveButton = styled(Button)`
margin: 8px 0;
align-self: flex-end;
`;


const MenuWrapper = styled.View`
margin:16px 0;
background-color: #1E2429;
flex-direction: row;
padding:12px;
justify-content: center;
`;


const MenuItem = styled.TouchableOpacity`
margin: 0 16px;
`;

const CurrentFormHeading = styled.Text`
font-family: 'URBAN_BOLD';
text-transform: uppercase;
font-size: 16px;
margin-left: 16px;

`;



export default InspectionDetails