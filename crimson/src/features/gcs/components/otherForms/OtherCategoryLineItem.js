import { Text, TouchableOpacity, View } from "react-native";
import MUiIcon from 'react-native-vector-icons/MaterialIcons';
import CameraIcon from 'react-native-vector-icons/EvilIcons';

import styled from "styled-components/native";
import React from "react";


export default function OtherCategoryLineItem({ item, onValueChange,navigation }) {
    const [isOpen, setIsOpen] = React.useState(false) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }
    // ! dont render line item with no Matrix Price property
    if (!item.Matrix_Price) {
        return null;
    }


    return (
        <View style={{ borderRadius: 8, paddingVertical: 2, paddingHorizontal: 8, marginVertical: 4, backgroundColor: '#6A579A' }}>

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Title */}
                <View style={{ padding: 8, width: '90%', }}>
                    <Text style={{ color: 'white', fontFamily: 'SF_BOLD', fontSize: 18 }}>{isOpen ? item?.Matrix_Price : item?.Matrix_Price?.substring(0, 70)}</Text>
                    {
                        !isOpen ? <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ width: '33%', color: 'white', fontFamily: 'SF_LIGHT' }}>
                                Quantity: {item?.Quantity}
                            </Text>
                            <Text style={{ width: '33%', color: 'white', fontFamily: 'SF_LIGHT' }}>
                                Rate: ${item?.Rate.toFixed(2)}
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
                    <StyledTextInput
                        keyboardType="number-pad"
                        onChangeText={val =>   onValueChange(Number(val), "Quantity", item.UniqueKey)} // ! Quantity should not be in decimal format
                        value={`${item.Quantity ?? 0}`}
                    />
                    <StyledLabel >U/A</StyledLabel>
                    <StyledTextInput
                        onChangeText={val => onValueChange((val), "Quantity", item.UniqueKey)}
                        value={`${item.U_M ?? 0}`}
                        keyboardType="number-pad"
                    />
                    <StyledLabel >Rate</StyledLabel>
                    <StyledTextInput
                        onChangeText={val => {
                            onValueChange((val.replace("$","")), "Rate", item.UniqueKey)
                        }}
                        value={`$${item.Rate}`}
                        keyboardType="number-pad"
                    />
                    <StyledLabel >Total</StyledLabel>
                    <StyledTextInput keyboardType="number-pad" value={`$${item.Total}`} />
                    <StyledLabel >Scope Notes</StyledLabel>
                    <StyledTextInput
                        value={item.Scope_Notes}
                        multiline={true}
                        editable
                        onChangeText={val => onValueChange(val, "Scope_Notes", item.UniqueKey)}
                        numberOfLines={4}
                        style={{ height: 140, backgroundColor: 'white', padding: 16, paddingTop: 18, fontSize: 16, borderRadius: 8, marginBottom: 8 }}
                    />
                    <TouchableOpacity onPress={() => navigation.navigate("CameraScreen")} style={{ width: 132, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: "white", padding: 8, borderRadius: 8 }}>
                        <CameraIcon name="camera" size={28} color="black" />
                        <Text >Capture Image</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
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

