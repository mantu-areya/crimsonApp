import { Text, TouchableOpacity, View } from "react-native";
import MUiIcon from 'react-native-vector-icons/MaterialIcons';
import CameraIcon from 'react-native-vector-icons/EvilIcons';
import { uploadSignImage } from "../../../../services/inspections/inspections.service";
import styled from "styled-components/native";
import React, { useEffect, useState } from "react";

let requiredSubCategories = [
  "Off Matrix - Pool",
  "Off Matrix - Exterior",
  "Off Matrix - Interior",
  "Off Matrix - MEP"
]

export default function OtherCategoryLineItem({ item, onValueChange, navigation, readOnly,setShowAddButton,  inspId}) {
  const [isOpen, setIsOpen] = React.useState(false) // keep open in start
  const handleCollapseToggle = () => {
    setIsOpen(!isOpen);
  }

  const Sub_Category_Keys = ["Off Matrix - Pool", "Off Matrix - Exterior", "Off Matrix - Interior", "Off Matrix - MEP"]
  const Category_Keys = ["Pools","Exterior","Interior","Mechanical, Electrical and Plumbing Systems"]
    
useEffect(()=>{
  setShowAddButton(Category_Keys.includes(item?.Category)?true:false)
},[])

  // ! dont render line item with no Matrix Price property
  // if (!item.Matrix_Price) {
  //     return null;
  // }
  return (
    <View style={{ borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, marginVertical: 4, backgroundColor: '#6A579A' }}>

      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Title */}
        <View style={{ padding: 8, width: '90%', }}>
          <View >{isOpen ? (
            Sub_Category_Keys.includes(item?.Sub_Category) ? <SubCategoryInput
              onChangeText={val => onValueChange((val), "Matrix_Price", item.UniqueKey)}
              value={`${item?.Matrix_Price ?? 0}`}
            />
              : <Text style={{ color: 'white', fontFamily: 'SF_BOLD', fontSize: 18 }}> {item?.Matrix_Price}</Text>
          ) : <Text style={{ color: 'white', fontFamily: 'SF_BOLD', fontSize: 18 }}> {item?.Matrix_Price?.substring(0, 70)}</Text>}</View>
          {
            !isOpen ? <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
              <Text style={{ width: '33%', color: 'white', fontFamily: 'SF_LIGHT' }}>
                Quantity: {item?.Quantity}
              </Text>
              <Text style={{ width: '33%', color: 'white', fontFamily: 'SF_LIGHT' }}>
                Rate: ${ Number(item?.Rate).toFixed(2)}
              </Text>
              <Text style={{ width: '33%', color: 'white', fontFamily: 'SF_LIGHT' }}>
                Total: ${item?.Total.toFixed(2)}
              </Text>
            </View> : null
          }
        </View>
        {/* Toggle Icon */}
        <TouchableOpacity style={{ width: '10%' }} onPress={handleCollapseToggle}>
          <MUiIcon name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="white" size={36} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {
        isOpen &&
        <View style={{ padding: 8, borderRadius: 8, marginVertical: 4 }}>
          <StyledLabel >Quantity</StyledLabel>
          {readOnly ? <Text>{item.Quantity ?? 0}</Text> : <StyledTextInput
            keyboardType="number-pad"
            onChangeText={val => onValueChange(Number(val), "Quantity", item.UniqueKey)} // ! Quantity should not be in decimal format
            value={`${item.Quantity ?? 0}`}
          />}
          <StyledLabel >U/M</StyledLabel>
          {readOnly ? <Text>{item.U_M ?? 0}</Text> : <StyledTextInput
            onChangeText={val => onValueChange((val), "Quantity", item.UniqueKey)}
            value={`${item.U_M ?? 0}`}
          />}
          <StyledLabel >Rate</StyledLabel>
          {readOnly ? <Text>$ {item.Rate ?? 0}</Text> :
            requiredSubCategories.includes(item.Sub_Category) ?
              <StyledTextInput

                onChangeText={val => {
                  onValueChange(Number( (val.replace("$", ""))), "Rate", item.UniqueKey)
                }}
                value={`$${item.Rate}`}
                keyboardType="number-pad"
              />
              :
              <Text>$ {item.Rate ?? 0}</Text>
          }
          <StyledLabel >Total</StyledLabel>
          {readOnly ? <Text>$ {item.Total ?? 0}</Text> : <StyledTextInput keyboardType="number-pad" value={`$${item.Total}`} />}
          <StyledLabel >Scope Notes</StyledLabel>
          {readOnly ? <Text>{item.Scope_Notes ?? ''}</Text> : <StyledTextInput
            value={item.Scope_Notes}
            multiline={true}
            editable
            onChangeText={val => onValueChange(val, "Scope_Notes", item.UniqueKey)}
            numberOfLines={4}
            style={{ height: 140, backgroundColor: 'white', padding: 16, paddingTop: 18, fontSize: 16, borderRadius: 8, marginBottom: 8 }}
          />}
          {!readOnly && <TouchableOpacity onPress={() => navigation.navigate("CameraScreen",{inspId : {inspId}, lineItemId : item.Id })} style={{ width: 132, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "white", padding: 8, borderRadius: 8 }}>
            <CameraIcon name="camera" size={28} color="black" />
            <Text >Capture Image</Text>
          </TouchableOpacity>}
        </View>
      }
    </View >
  )
}

const StyledLabel = styled.Text`
color: white;
font-family: 'SF_BOLD';
margin-bottom: 2px;  
`;

const StyledTextInput = styled.TextInput`
background-color: white ;
padding: 16px;
font-size: 16px;
border-radius: 8px;
margin-bottom: 8px;
`;

const SubCategoryInput = styled.TextInput`
background-color: white ;
padding: 16px;
font-size: 16px;
border-radius: 8px;
margin-bottom: 8px;
`;
