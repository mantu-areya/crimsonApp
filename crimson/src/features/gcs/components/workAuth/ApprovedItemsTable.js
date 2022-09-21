import React, { useEffect, useContext } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Platform } from "react-native";
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContentLoader, { Rect } from 'react-content-loader/native'
import styled from "styled-components/native";




export const ApprovedItemsTable = ({ approvedItems, updateLocalData, inspId }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
    const [length, setLength] = React.useState(false);
    const [approvedItemsData, setApprovedItemsData] = React.useState([]);



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

    console.log({ approvedItemsData });

    return (

        <Wrapper>
            {/* Total */}
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontFamily: 'SF_LIGHT' }}>Total : {GetToalSqFt()} </Text>
            </View>
            {/* Table */}



            <View style={{ backgroundColor: 'red' }}>
                {/* <View style={{ padding: 16, marginRight: 8, flexDirection: 'row' }}>
                    <FixedColumnHeader>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Matrix Price`}</Text>
                    </FixedColumnHeader>
                    <TableWrapper horizontal>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Scope Notes`}</Text>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Approval Status`}</Text>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Owner Notes`}</Text>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Quantity`}</Text>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`U/M`}</Text>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Rate`}</Text>
                        <Text style={{ fontSize: 28, fontFamily: 'SF_BOLD' }}>{`Total`}</Text>
                    </TableWrapper>
                </View> */}
                <View style={{ padding: 16, marginRight: 8, flexDirection: 'row' }}>

                    <View>
                        <FixedColumnHeader>
                            <Text style={{width:120, fontSize: 14, fontFamily: 'SF_BOLD' }}>Matrix Price </Text>
                        </FixedColumnHeader>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, i) =>
                                <FixedColumnHeader key={i}>
                                    <Text style={{width:120, fontSize: 16, fontFamily: 'SF_LIGHT' }}> Item{item}</Text>
                                </FixedColumnHeader>
                            )
                        }
                    </View>

                    <ScrollView horizontal>
                        <View >
                            <View style={{ flexDirection: 'row'}}>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Scope Notes`}</Text>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Approval Status`}</Text>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Owner Notes`}</Text>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Quantity`}</Text>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`U/M`}</Text>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Rate`}</Text>
                                <Text style={{width:80, flex:1, fontSize: 14, fontFamily: 'SF_BOLD' }}>{`Total`}</Text>
                            </View>

                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, i) =>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                    <Text style={{width:80,flex:1, fontSize: 16, fontFamily: 'SF_LIGHT' }}>{`item ${item}`}</Text>
                                </View>
                            )
                            }
                        </View>
                    </ScrollView>


                </View>


            </View>
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
position: fixed;
left: 0;
z-index: 9999;
justify-content: center;
align-items: center;
/* background-color: white; */
`



// 016841