import React, { useEffect, useContext } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Platform, TouchableOpacity } from "react-native";
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContentLoader, { Rect } from 'react-content-loader/native'
import styled from "styled-components/native";




export const ApprovedItemsTable = ({ approvedItems, updateLocalData, inspId }) => {
    const [approvedItemsData, setApprovedItemsData] = React.useState([]);

    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }

    const GetToalSqFt = () => {
        let toatalSF = 0;
        approvedItemsData.map(ele => {
            toatalSF = toatalSF + ele.Approved_Amount
            return toatalSF
        })
        return toatalSF
    }

    React.useEffect(() => {
        setApprovedItemsData(approvedItems);
    }, [approvedItems])



    return (

        <Wrapper>
            {/* Total */}
            <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 18, fontFamily: 'URBAN_BOLD' }}>Approved Items</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'URBAN_BOLD' }}>Total : ${GetToalSqFt()?.toFixed(2)} </Text>
                </View>
                <TouchableOpacity onPress={handleCollapseToggle}>
                    <Icon name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="black" size={36} />
                </TouchableOpacity>
            </View>

            {/* Table */}
            {
                isOpen &&
                <View>
                    <View style={{ padding: 16, marginRight: 8, flexDirection: 'row' }}>

                        <View style={{ marginRight: 16 }}>
                            <FixedColumnHeader style={{}}>
                                <Text style={{ width: 140, height: 32, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>Matrix Price </Text>
                            </FixedColumnHeader>
                            {
                                approvedItems.map((item, i) =>
                                    <FixedColumnHeader style={{ marginBottom: 10 }} key={i}>
                                        <Text style={{ width: 140,height:64, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>{item?.Matrix_Price}</Text>
                                    </FixedColumnHeader>
                                )
                            }
                        </View>

                        <ScrollView horizontal>
                            <View >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`Scope Notes`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`Approval Status`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`Owner Notes`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`Quantity`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`U/M`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`Rate`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'URBAN_BOLD' }}>{`Total`}</Text>
                                </View>

                                {approvedItems.map((item, i) =>

                                    <View key={i} style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Text style={{ height: 64, width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>{item?.Scope_Notes}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>{item?.Approval_Status}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>{item?.Owner_Clarification}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>{ item?.Adj_Quantity}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>{item?.U_M}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>${item?.Adj_Rate.toFixed(2)}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'URBAN_REGULAR' }}>${item?.Approved_Amount.toFixed(2)}</Text>
                                    </View>
                                )
                                }
                            </View>
                        </ScrollView>


                    </View>


                </View>
            }


        </Wrapper >

    )
}


const Wrapper = styled.View`
background-color: #D9D9D9;
border-radius: 8px;
margin-bottom: 16px;
`
const TableWrapper = styled.ScrollView`
flex-direction: row;
margin: 8px 0;
position: relative;
`;

const FixedColumnHeader = styled.View`

left: 0;
z-index: 9999;
justify-content: center;
align-items: center;
`



// 016841