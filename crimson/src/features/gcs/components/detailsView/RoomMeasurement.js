import React from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native"
import styled from "styled-components/native"
import MUiIcon from 'react-native-vector-icons/MaterialIcons';
import { VendorFormContext } from "../../../../services/context/VendorForm/vendorForm.contex";
import { Col, Row } from "react-native-responsive-grid-system";
import { TextArea } from "../VendorFormPageStyles";


export default function RoomMeasurement({ room_Measurement, inspId }) {
    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }
    const [room_measurementData, setRoom_measurementData] = React.useState([]);

    const { updateVfContect } = React.useContext(VendorFormContext);

    const onValueChange = async (value, field, key) => {
        const newData = room_Measurement.map(obj => {
            if (obj.UniqueKey === key) {
                let newValues = { ...obj, [field]: value };
                let newTotal = (newValues.Room_Length * newValues.Room_Width) + newValues.Room_Misc_SF
                return { ...obj, [field]: value, ["Room_Total"]: newTotal };
            }
            obj.UniqueKey === key && console.log("ff");
            return obj;
        });
        setRoom_measurementData(newData)
    }


    const GetToalSqFt = () => {
        let toatalSF = 0;
        room_measurementData.map(ele => {
            toatalSF = toatalSF + ele.Room_Total
            return toatalSF
        })
        return toatalSF
    }



    React.useEffect(() => {
        updateVfContect(room_measurementData, "RM", inspId);
    }, [room_measurementData]);



    React.useEffect(() => {
        setRoom_measurementData(room_Measurement);
    }, [room_Measurement])



    return (


        <Wrapper >

            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                {/* Text */}
                <View>
                    <Text style={{ fontSize: 16, fontFamily: 'SF_BOLD' }}>Room Measurements</Text>
                    <Text>Total Sq Ft: {GetToalSqFt()} sq. ft.</Text>
                </View>
                {/* Icon */}
                <TouchableOpacity onPress={handleCollapseToggle}>
                    <MUiIcon name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="#6A579A" size={36} />
                </TouchableOpacity>
            </View>
            {/* Body */}
            {
                isOpen &&
                <View >
                    {/* Header */}
                    <View style={{ flexDirection: 'row', backgroundColor: '#C4C4C4', paddingVertical: 12, paddingHorizontal: 8, marginTop: 16 }}>
                        {/* Room */}
                        <Text style={{ flex: 4, fontFamily: 'SF_BOLD' }}>Room</Text>
                        {/* Length */}
                        <Text style={{ flex: 2, fontFamily: 'SF_BOLD', textAlign: 'center' }} >Length</Text>
                        {/* Width */}
                        <Text style={{ flex: 2, fontFamily: 'SF_BOLD', textAlign: 'center' }}>Width</Text>
                        {/* Misc SF */}
                        <Text style={{ flex: 2, fontFamily: 'SF_BOLD', textAlign: 'center' }}>Misc SF</Text>
                        {/* Total */}
                        <Text style={{ flex: 2, fontFamily: 'SF_BOLD', textAlign: 'right' }}>Total</Text>
                    </View>
                    {
                        room_measurementData?.length > 0 ? <FlatList
                            data={room_measurementData ?? []}
                            keyExtractor={(item) => item.UniqueKey}
                            renderItem={(item) => (
                                <RoomMeasurementLineItem item={item.item} onValueChange={onValueChange} />
                            )} padding
                        /> :
                            <View style={{padding:16}}>
                                <ActivityIndicator />
                            </View>
                    }
                </View>
            }

        </Wrapper>
    )
}


const StyledTextInput = styled.TextInput`
    flex: 2;
    font-family: SF_LIGHT;
    text-align: center;
    background-color:white;
    border-radius:4px;
    margin: 0px 4px;
    `;


function RoomMeasurementLineItem({ item, onValueChange }) {
    

    return (

        <View style={{ flexDirection: 'row', paddingVertical: 2, paddingHorizontal: 8, marginVertical: 2 }}>
            {/* Room */}
            <Text style={{ flex: 4, fontFamily: 'SF_LIGHT' }}>{item.Sub_Category}</Text>
            {/* Length */}
            <StyledTextInput
                keyboardType="number-pad"
                onChangeText={val => onValueChange(parseFloat(val), "Room_Length", item.UniqueKey)}
                value={`${item.Room_Length ?? 0}`}
            />
            {/* Width */}
            <StyledTextInput
                keyboardType="number-pad"
                onChangeText={val => onValueChange(parseFloat(val), "Room_Width", item.UniqueKey)}
                value={`${item.Room_Width ?? 0}`}
            />
            {/* Misc SF */}
            <StyledTextInput
                keyboardType="number-pad"
                onChangeText={val => onValueChange(parseFloat(val), "Room_Misc_SF", item.UniqueKey)}
                value={`${item.Room_Misc_SF ?? 0}`}
            />
            {/* Total */}
            <Text style={{ flex: 2, fontFamily: 'SF_LIGHT', textAlign: 'right' }}>{item.Room_Total.toFixed(2)}</Text>
        </View>


    )
}

const Wrapper = styled.View`
background-color:#D9D9D9;
margin: 16px 0;
padding: 16px;
border-radius: 8px;
`


/*

            <Row>
                <Col xs="4" md="6" style={{ textAlign: "center" }}>
                    <Text variant="body">{item.Sub_Category}</Text>
                </Col>
                <Col xs="2" md="6">
                    <TextInput
                        keyboardType="number-pad"
                        multiline={true}
                        value={`${item.Room_Length < 0 ? 0 : item.Room_Length == null ? 0 : item.Room_Length}`}
                        // onChangeText={(value) => { value>=0 && onValueChange(Number(value), "Room_Length", item.UniqueKey) }}
                        style={{ fontSize: 12 }} />
                </Col>
                <Col xs="2" md="6">

                    <TextInput keyboardType="number-pad" multiline={true} value={`${item.Room_Width < 0 ? 0 : item.Room_Width == null ? 0 : item.Room_Width}`}
                        // onChangeText={(value) => { value>=0 && onValueChange(Number(value), "Room_Width", item.UniqueKey) }}
                        style={{ fontSize: 12 }} />

                </Col>
                <Col xs="2" md="6">
                    <TextArea keyboardType='numeric' defaultValue={item.Room_Misc_SF && (item.Room_Misc_SF).toString()}
                        Value={item.Room_Misc_SF && (item.Room_Misc_SF).toString()}
                    // onChangeText={(value) => { onValueChange(parseFloat(value), "Room_Misc_SF", item.UniqueKey) }}
                    />
                </Col>
                <Col xs="2" md="6">
                    <Text variant="body">{item.Room_Total}</Text>
                </Col>
            </Row>
*/ 