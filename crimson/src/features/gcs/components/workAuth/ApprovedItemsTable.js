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


    const MyLoader = () => {
        const getRowLoader = (y) => {
            let height = Platform.isPad ? 30 : 15
            return (<>
                <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: height, flex: 1 }} viewBox="0 0 600 1">
                    <Rect x="1" y="0" rx="3" ry="3" width="180" height="10" />
                    <Rect x="200" y="0" rx="4" ry="4" width="60" height="10" />
                    <Rect x="300" y="0" rx="3" ry="3" width="60" height="10" />
                    <Rect x="400" y="0" rx="3" ry="3" width="60" height="10" />
                    <Rect x="500" y="0" rx="3" ry="3" width="60" height="10" />
                </ContentLoader>

            </>
            )
        }
        return <>
            {getRowLoader()}
            {getRowLoader()}
            {getRowLoader()}
        </>
    }

    const GetToalSqFt = () => {
        let toatalSF = 0;
        approvedItemsData.map(ele => {
            toatalSF = toatalSF + ele.Approved_Amount
            return toatalSF
        })
        return toatalSF
    }

    useEffect(() => {
        setApprovedItemsData(approvedItems);
    }, [approvedItems])

    const displayRows = () => {
        return approvedItemsData.map((item, i) => {
            return (
                <Row key={item.UniqueKey}>
                    <Col xs="2" md="2" style={{ textAlign: "center" }}>
                        <Text variant="body">{item.Category}</Text>
                    </Col>
                    <Col xs="2" md="2">
                        <Text variant="body">{item.Sub_Category}</Text>
                    </Col>
                    <Col xs="2" md="2">
                        <Text variant="body">{item.Approval_Status}</Text>
                    </Col>
                    <Col xs="2" md="2">
                        <Text variant="body">{item.Owner_Clarification}</Text>
                    </Col>
                    <Col xs="1" md="1">
                        <Text variant="body">{item.Quantity}</Text>
                    </Col>
                    <Col xs="1" md="1">
                        <Text variant="body">{item.U_M}</Text>
                    </Col>
                    <Col xs="1" md="1">
                        <Text variant="body">{item.Rate}</Text>
                    </Col>
                    <Col xs="1" md="1">
                        <Text variant="body">{item.Total}</Text>
                    </Col>
                </Row>
            )
        })

    }


    return (

        <Wrapper>
            {/* Total */}
            <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontFamily: 'SF_LIGHT' }}>Total : ${GetToalSqFt()} </Text>
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
                                <Text style={{ width: 140, height: 32, fontSize: 14, fontFamily: 'SF_BOLD' }}>Matrix Price </Text>
                            </FixedColumnHeader>
                            {
                                approvedItems.map((item, i) =>
                                    <FixedColumnHeader style={{ marginBottom: 10 }} key={i}>
                                        <Text style={{ width: 140, height: 64, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.Matrix_Price}</Text>
                                    </FixedColumnHeader>
                                )
                            }
                        </View>

                        <ScrollView horizontal>
                            <View >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Scope Notes`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Approval Status`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Owner Notes`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Quantity`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`U/M`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Rate`}</Text>
                                    <Text style={{ height: 32, textAlign: 'center', width: 120, flex: 1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Total`}</Text>
                                </View>

                                {approvedItems.map((item, i) =>

                                    <View key={i} style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        {/* <FixedColumnHeader key={i}>
                            <Text style={{ width: 120, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.Matrix_Price}</Text>
                        </FixedColumnHeader> */}
                                        <Text style={{ height: 64, width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.Scope_Notes}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.Approval_Status}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.Owner_Clarification}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.Quantity}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{item.U_M}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>${item.Rate.toFixed(2)}</Text>
                                        <Text style={{ height: 64, textAlign: 'center', width: 120, flex: 1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>${item.Total.toFixed(2)}</Text>
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
position: sticky;
left: 0;
z-index: 9999;
justify-content: center;
align-items: center;
/* background-color: white; */
`



// 016841