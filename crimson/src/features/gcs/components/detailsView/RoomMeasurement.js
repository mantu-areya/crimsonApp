import React from "react";
import { Text, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import MUiIcon from 'react-native-vector-icons/MaterialIcons';


export default function RoomMeasurement({ }) {
    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <Wrapper onPress={handleCollapseToggle}>

            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {/* Text */}
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'SF_BOLD' }}>Room Measurements</Text>
                    <Text>Total Sq Ft: $1000</Text>
                </View>
                {/* Icon */}
                <TouchableOpacity onPress={handleCollapseToggle}>
                    <MUiIcon name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="#6A579A" size={36} />
                </TouchableOpacity>
            </View>
            {/* Body */}
            {
                isOpen &&
                <View>
                    <Text>
                        Body Goes Home
                    </Text>
                </View>
            }

        </Wrapper>
    )
}


const Wrapper = styled.TouchableOpacity`
background-color:white;
margin: 16px 0;
padding: 16px;
border-radius: 8px;
`