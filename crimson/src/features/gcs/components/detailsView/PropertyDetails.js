import { TouchableOpacity, View, Text } from "react-native";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import FWIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from "react";
import { Button } from "react-native-paper";




const Wrapper = styled.TouchableOpacity`
background-color: #6A579A;
padding:16px;
border-radius: 8px;
`

const Heading = styled.Text`
color: white;
font-size: 16px;
font-family: SF_BOLD;
`

export default function PropertyDetails() {
    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <Wrapper onPress={handleCollapseToggle} >
            {/* Header */}
            <View flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Inspection Details</Heading>
                <TouchableOpacity onPress={handleCollapseToggle}>
                    <Icon name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="white" size={36} />
                </TouchableOpacity>
            </View>
            {/* Body */}
            {isOpen &&

                <View style={{ marginTop: 8 }}>

                    {/* CTA */}

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 4 }}>
                        <Button mode="contained" style={{ marginRight: 8 }}>Submit</Button>
                        <Button mode="contained">Print PDF</Button>
                    </View>

                    {/* Details Card */}
                    <PropertyDetailsCard />
                    <KeyContactInformationsCard />
                    <KeyDateCard />
                    {/* <DetailsCard/>
                    <DetailsCard/> */}

                </View>
            }
        </Wrapper>
    )
}


function PropertyDetailsCard() {

    const [isDetailsCardOpen, setIsDetailsCardOpen] = React.useState(true) // keep open in start
    const handleDetailsCardToggle = () => {
        setIsDetailsCardOpen(!isDetailsCardOpen);
    }

    return (
        <TouchableOpacity onPress={handleDetailsCardToggle} style={{ padding: 8, marginTop: 8, borderRadius: 4, flexDirection: 'row', backgroundColor: '#B5A7D7' }}>
            {/* Icon */}
            <View style={{ width: '20%' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 48, height: 48, backgroundColor: '#6A579A', borderRadius: '100%' }}>
                    <FWIcon name={"building"} color="white" size={24} />
                </View>
            </View>
            {/* Details */}
            <View style={{ width: '80%' }}>
                <Text style={{ marginBottom: 4, color: "white", fontSize: 18, fontFamily: 'SF_BOLD' }}>
                    Property Details
                </Text>
                {
                    isDetailsCardOpen &&
                    <View >
                        {/* Address */}
                        <View style={{ marginBottom: 4 }} >
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                Address:
                            </Text>
                            <Text style={{ color: "white" }}>
                                606 Fairgreen Trail, Stockbridge, GA 30281
                            </Text>
                        </View>
                        {/* City | State */}
                        <View style={{ marginBottom: 4, flexDirection: "row" }} >
                            {/* City */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                    City:
                                </Text>
                                <Text style={{ color: "white" }}>
                                    Stockbridge
                                </Text>
                            </View>
                            {/* State */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                    State:
                                </Text>
                                <Text style={{ color: "white" }}>
                                    GA
                                </Text>
                            </View>
                        </View>
                        {/* Zip Code */}
                        <View>
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                Zip Code:
                            </Text>
                            <Text style={{ color: "white" }}>
                                30281
                            </Text>
                        </View>
                    </View>
                }

            </View>
        </TouchableOpacity>
    )
}


function KeyContactInformationsCard() {

    const [isKeyContactCardOpen, setIsKeyContactCardOpen] = React.useState(true) // keep open in start
    const handleKeyContactCardToggle = () => {
        setIsKeyContactCardOpen(!isKeyContactCardOpen);
    }

    return (
        <TouchableOpacity onPress={handleKeyContactCardToggle} style={{ padding: 8, marginTop: 8, borderRadius: 4, flexDirection: 'row', backgroundColor: '#B5A7D7' }}>
            {/* Icon */}
            <View style={{ width: '20%' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 48, height: 48, backgroundColor: '#6A579A', borderRadius: '100%' }}>
                    <MCIcon name={"folder-key"} color="white" size={24} />
                </View>
            </View>
            {/* Details */}
            <View style={{ width: '80%' }}>
                <Text style={{ marginBottom: 4, color: "white", fontSize: 18, fontFamily: 'SF_BOLD' }}>
                Key Contact Informations
                </Text>
                {
                    isKeyContactCardOpen &&
                    <View >
                         {/* Row 1 */}
                         <View style={{ marginBottom: 4, flexDirection: "row" }} >
                            {/* General Contractor */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                    General Contractor:
                                </Text>
                                <Text style={{ color: "white" }}>
                                    Stockbridge
                                </Text>
                            </View>
                            {/* HHM Field PM */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                    HHM Field PM:
                                </Text>
                                <Text style={{ color: "white" }}>
                                    GA
                                </Text>
                            </View>
                        </View>
                        {/* Row 2 */}
                        <View style={{ marginBottom: 4, flexDirection: "row" }} >
                            {/* Repair Estimator */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                    Repair Estimator:
                                </Text>
                                <Text style={{ color: "white" }}>
                                    Stockbridge
                                </Text>
                            </View>
                            {/* Property Zip Code */}
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                    Property Zip Code:
                                </Text>
                                <Text style={{ color: "white" }}>
                                    GA
                                </Text>
                            </View>
                        </View>
                    </View>
                }

            </View>
        </TouchableOpacity>
    )
}

function KeyDateCard() {

    const [isKeyDateCardOpen, setIsKeyDateCardOpen] = React.useState(true) // keep open in start
    const handleKeyDateCardToggle = () => {
        setIsKeyDateCardOpen(!isKeyDateCardOpen);
    }

    return (
        <TouchableOpacity onPress={handleKeyDateCardToggle} style={{ padding: 8, marginTop: 8, borderRadius: 4, flexDirection: 'row', backgroundColor: '#B5A7D7' }}>
            {/* Icon */}
            <View style={{ width: '20%' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 48, height: 48, backgroundColor: '#6A579A', borderRadius: '100%' }}>
                    <MCIcon name={"calendar-month"} color="white" size={24} />
                </View>
            </View>
            {/* Details */}
            <View style={{ width: '80%' }}>
                <Text style={{ marginBottom: 4, color: "white", fontSize: 18, fontFamily: 'SF_BOLD' }}>
                Key Date
                </Text>
                {
                    isKeyDateCardOpen &&
                    <View >
                          {/* Inspection Schedule Date */}
                          <View>
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                Inspection Schedule Date:
                            </Text>
                            <Text style={{ color: "white" }}>
                                30281
                            </Text>
                        </View>
                          {/* Target Rehab Complete Date */}
                          <View>
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                Target Rehab Complete Date:
                            </Text>
                            <Text style={{ color: "white" }}>
                                30281
                            </Text>
                        </View>
                    </View>
                }

            </View>
        </TouchableOpacity>
    )
}
