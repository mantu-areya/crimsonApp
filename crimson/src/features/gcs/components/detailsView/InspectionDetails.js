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

export default function InspectionDetails({ data }) {

    const {
        Property_Address__c,
        Property_City__c,
        Property_State__c,
        Property_Zip_Code__c,
        HHM_Field_PM__r,
        Repair_Estimator_Email__c,
        Repair_Estimator__r,
        Inspection_Scheduled_Date__c,
        Target_Rehab_Complete_Date__c,
        HHM_Field_PM_Email__c
    } = data




    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }
    return (
        <Wrapper >
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
                    <PropertyDetailsCard {...{
                        Property_Address__c,
                        Property_City__c,
                        Property_State__c,
                        Property_Zip_Code__c,
                    }} />
                    <KeyContactInformationsCard {...{
                        HHM_Field_PM__r,
                        Repair_Estimator_Email__c,
                        Repair_Estimator__r,
                        HHM_Field_PM_Email__c
                    }} />
                    <KeyDateCard {...{
                        Inspection_Scheduled_Date__c,
                        Target_Rehab_Complete_Date__c
                    }} />
                    {/* <DetailsCard/>
                    <DetailsCard/> */}

                </View>
            }
        </Wrapper>
    )
}


function PropertyDetailsCard({
    Property_Address__c,
    Property_City__c,
    Property_State__c,
    Property_Zip_Code__c,
}) {

    // const [isDetailsCardOpen, setIsDetailsCardOpen] = React.useState(true) // keep open in start
    // const handleDetailsCardToggle = () => {
    //     setIsDetailsCardOpen(!isDetailsCardOpen);
    // }

    return (
        <TouchableOpacity style={{ padding: 8, marginTop: 8, borderRadius: 4, backgroundColor: '#B5A7D7' }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 48, height: 48, backgroundColor: '#6A579A', borderRadius: 100 }}>
                    <FWIcon name={"building"} color="white" size={24} />
                </View>
                <View style={{ marginLeft: 16 }}>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: 'SF_BOLD' }}>
                        Property Details
                    </Text>
                    <View style={{ marginTop: 2 }} >
                        <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                            {Property_Address__c}
                        </Text>
                    </View>
                </View>
            </View>
            {/* Details */}
            <View style={{ marginLeft: 64 }}>

                <View >
                    {/* Address */}

                    {/* City | State */}
                    <View style={{ marginBottom: 4, flexDirection: "row" }} >
                        {/* City */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                City:
                            </Text>
                            <Text style={{ color: "white" }}>
                                {Property_City__c}
                            </Text>
                        </View>
                        {/* State */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                State:
                            </Text>
                            <Text style={{ color: "white" }}>
                                {Property_State__c}
                            </Text>
                        </View>
                    </View>
                    {/* Zip Code */}
                    <View>
                        <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                            Zip Code:
                        </Text>
                        <Text style={{ color: "white" }}>
                            {Property_Zip_Code__c}
                        </Text>
                    </View>
                </View>


            </View>
        </TouchableOpacity>
    )
}

function KeyContactInformationsCard({
    HHM_Field_PM__r,
    Repair_Estimator_Email__c,
    HHM_Field_PM_Email__c,
    Repair_Estimator__r,
}) {

    const [isKeyContactCardOpen, setIsKeyContactCardOpen] = React.useState(false) // keep open in start
    const handleKeyContactCardToggle = () => {
        setIsKeyContactCardOpen(!isKeyContactCardOpen);
    }

    return (
        <TouchableOpacity onPress={handleKeyContactCardToggle} style={{ padding: 8, marginTop: 8, borderRadius: 4, backgroundColor: '#B5A7D7' }}>

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 48, height: 48, backgroundColor: '#6A579A', borderRadius: 100 }}>
                    <MCIcon name={"folder-key"} color="white" size={24} />
                </View>
                <View style={{ marginLeft: 16 }}>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: 'SF_BOLD' }}>
                        Key Contact Informations
                    </Text>
                </View>
                <TouchableOpacity style={{marginLeft:"auto"}} onPress={handleKeyContactCardToggle}>
                    <Icon name={isKeyContactCardOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="white" size={36} />
                </TouchableOpacity>
            </View>
            {/* Details */}
            {
                isKeyContactCardOpen &&
                <View style={{ marginLeft: 64 }}>
                    {/* Row 1 */}
                    <View style={{ marginBottom: 16, flexDirection: "row" }} >
                        {/* HHM Field PM */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                                HHM Field PM:
                            </Text>
                            <Text style={{ color: "white" }}>
                                {HHM_Field_PM__r?.Name}
                            </Text>
                            <Text style={{ color: "white" }}>
                                {HHM_Field_PM_Email__c}
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
                                {Repair_Estimator__r?.Name}
                            </Text>
                            <Text style={{ color: "white" }}>
                                {Repair_Estimator_Email__c}
                            </Text>
                        </View>
                    </View>
                </View>
            }



        </TouchableOpacity>
    )
}

function KeyDateCard({
    Inspection_Scheduled_Date__c,
    Target_Rehab_Complete_Date__c
}) {

    const [isKeyDateCardOpen, setIsKeyDateCardOpen] = React.useState(false) // keep open in start
    const handleKeyDateCardToggle = () => {
        setIsKeyDateCardOpen(!isKeyDateCardOpen);
    }

    return (
        <TouchableOpacity onPress={handleKeyDateCardToggle} style={{ padding: 8, marginTop: 8, borderRadius: 4, backgroundColor: '#B5A7D7' }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: 48, height: 48, backgroundColor: '#6A579A', borderRadius: 100 }}>
                    <MCIcon name={"calendar-month"} color="white" size={24} />
                </View>
                <View style={{ marginLeft: 16 }}>
                    <Text style={{ color: "white", fontSize: 18, fontFamily: 'SF_BOLD' }}>
                        Key Date
                    </Text>
                </View>
                <TouchableOpacity style={{marginLeft:"auto"}} onPress={handleKeyDateCardToggle}>
                    <Icon name={isKeyDateCardOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="white" size={36} />
                </TouchableOpacity>
            </View>
            {/* Details */}

            {
                isKeyDateCardOpen &&
                <View style={{ marginLeft: 64 }} >
                    {/* Inspection Schedule Date */}
                    <View>
                        <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                            Inspection Schedule Date:
                        </Text>
                        <Text style={{ color: "white" }}>
                            {Inspection_Scheduled_Date__c ?? 'NA'}
                        </Text>
                    </View>
                    {/* Target Rehab Complete Date */}
                    <View>
                        <Text style={{ color: "white", fontFamily: 'SF_BOLD' }}>
                            Target Rehab Complete Date:
                        </Text>
                        <Text style={{ color: "white" }}>
                            {Target_Rehab_Complete_Date__c ?? 'NA'}
                        </Text>
                    </View>
                </View>
            }

        </TouchableOpacity>
    )
}
