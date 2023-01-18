import { View, Text, FlatList, ActivityIndicator, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button, Menu, Portal, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import NetInfo from "@react-native-community/netinfo";
import { getCoForms } from '../../services/co-forms/co-api';
import { CoFormContext } from '../../services/co-forms/co-context';
import Swipeable from 'react-native-swipeable';



const CoForms = ({ isSubmitted, readOnly, inspectionData, navigation }) => {

    const {
        allCo1Forms,
        allCo2Forms,
        allCo3Forms,
        getAllCoForms
    }
        = React.useContext(CoFormContext);


    const [currentForm, setCurrentForm] = React.useState(1);
    const [dataList, setDataList] = React.useState([])


    const [NewItemAdded, setNewItemAdded] = React.useState(0);
    const [showAddButton, setShowAddButton] = React.useState(false)


    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => {
        setSearchQuery(query);
    }


    React.useEffect(() => {
        if (currentForm === 1) {
            setDataList(allCo1Forms);
        }
        if (currentForm === 2) {
            console.log("yes");
            setDataList(allCo2Forms);
        }
        if (currentForm === 3) {
            setDataList(allCo3Forms);
        }
    }, [currentForm, allCo1Forms])


    React.useEffect(() => {
        getAllCoForms();
    }, [])


    return (
        <View>
            {
                isSubmitted &&
                <>
                    <MenuWrapper style={{ justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialCommunityIcons size={28} name='home-city' color={"#DE9B67"} />
                            <Text style={{ marginLeft: 8, color: '#C2CBD0', fontFamily: 'URBAN_BOLD', fontSize: 24 }}>CO Forms</Text>
                        </View>
                    </MenuWrapper>
                    {/* CO Tabs */}
                    <View style={{ flexDirection: "row" }}>
                        {
                            [1, 2, 3].map((item, i) =>
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => setCurrentForm(item)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: currentForm === item ? "#8477EB" : "white",
                                        padding: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <Text style={{
                                        color: currentForm === item ? "white" : "#8477EB",
                                        fontFamily: "URBAN_BOLD", fontSize: 16
                                    }}>CO {item}</Text>
                                </TouchableOpacity>)
                        }
                    </View>
                    {/* Search & Add */}
                    <View style={{ margin: 8, flexDirection: "row" }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4, paddingHorizontal: 16, backgroundColor: "white", flex: .7, borderRadius: 4 }}>
                            <Icon name="search" color="grey" style={{ flex: .1, }} size={18} />
                            <TextInput value={searchQuery} onChangeText={onChangeSearch} placeholder={"Search Scope Notes ..."} style={{ flex: .8, fontFamily: "URBAN_BOLD", backgroundColor: "transparent", fontSize: 18, padding: 12, width: "100%" }} />
                            {
                                searchQuery.length > 0 &&
                                <EntypoIcon onPress={() => setSearchQuery("")} name="cross" color="grey" style={{ flex: .1 }} size={24} />
                            }
                        </View>
                        <View style={{ flex: .3, marginHorizontal: 4 }}>
                            <AddNewBtn>
                                <Text style={{ fontFamily: "URBAN_BOLD", color: "white" }}> Add New</Text>
                            </AddNewBtn>
                        </View>
                    </View>

                    {/* CO Line Items */}
                    <ScrollView style={{ minHeight: 240 }}>
                        {
                            dataList.length > 0 ? dataList.map((item, i) => <CoFormLineItem isForReviewer={true} key={i} item={item} />) : <ActivityIndicator />
                        }
                    </ScrollView>
                </>
            }
        </View>
    )
}

function CoFormLineItem({ item, isForReviewer }) {




    const rightButtons = [
        <TouchableOpacity onPress={() => handleDelGest(item.Id, inspId, item.UniqueKey)} style={{ backgroundColor: '#F3206F', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
            <View>
                <MaterialCommunityIcons name="delete" size={24} color="white" />
                {/* <Text>Delete</Text> */}
            </View>
        </TouchableOpacity>
    ];

    const swipeableRef = React.useRef();

    const [showModal, setShowModal] = React.useState(false);

    const {
        U_M,
        Total,
        Sub_Category,
        Scope_Notes,
        Rate,
        Quantity,
        Owner_Clarification,
        Don_t_Charge_Client,
        Cost_Category,
        Category,
        Approval_Status
    } = item

    function getBackgroundColor() {
        if (Approval_Status === "Approved") {
            return "#7CDD9B";
        } else if (Approval_Status === "Declined") {
            return "#E02E2E";
        } else {
            return "#3983EF";
        }
    }
    function getCardBackgroundColor() {
        if (Approval_Status === "Approved") {
            return "#E7F5CE";
        } else if (Approval_Status === "Declined") {
            return "#F9DAD4";
        } else {
            return "#FDF2BF";
        }
    }

    const [showCostCategoryMenu, setShowCostCategoryMenu] = React.useState(false);


    if (isForReviewer) {
        return (
            <Provider>
                <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={rightButtons}>
                    <ReviewerLineItemWrapper backgroundColor={getCardBackgroundColor()} >
                        <Text style={{ fontSize: 12, fontFamily: "URBAN_MEDIUM" }}>Cost Category</Text>
                        <CurrentFormHeading>{Scope_Notes}</CurrentFormHeading>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: .2 }}>
                                <ReviewerPreviewLabel>Qty {Quantity}</ReviewerPreviewLabel>
                                <ReviewerPreviewLabel>Rate {Rate}</ReviewerPreviewLabel>
                                <ReviewerPreviewLabel>Total {Total}</ReviewerPreviewLabel>
                            </View>
                            <View style={{ flex: .8, flexDirection: "row", alignItems: "center" }}>
                                <ReviewerActionBtn backgroundColor={Approval_Status === "Approved" ? "grey" : "#7CDD9B"}>
                                    <Text>A</Text>
                                </ReviewerActionBtn>
                                <ReviewerActionBtn onPress={() => setShowModal(true)} backgroundColor={Approval_Status === "Approved as Noted" ? "grey" : "#3983EF"} >
                                    <Text>R</Text>
                                </ReviewerActionBtn>
                                <ReviewerActionBtn backgroundColor={Approval_Status === "Declined" ? "grey" : "#E02E2E"}>
                                    <Text>D</Text>
                                </ReviewerActionBtn>
                            </View>
                        </View>
                    </ReviewerLineItemWrapper>
                </Swipeable>
                <Modal transparent visible={showModal} onClose={() => setShowModal(false)} >
                    <Portal.Host>
                        <View style={{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 48 }}>
                            <View style={{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }}>
                                <View>
                                    <FormLabel style={{ fontSize: 12 }}>Scope Notes</FormLabel>
                                    <FormInput style={{ fontSize: 16 }} value={Scope_Notes} />
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Quantity</FormLabel>
                                        <Text style={{ fontSize: 16 }}>{`${Quantity}`} </Text>

                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>UM</FormLabel>
                                        <Text style={{ fontSize: 16 }}>{`${U_M}`} </Text>

                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Rate</FormLabel>
                                        <Text style={{ fontSize: 16 }}>{`${Rate}`} </Text>

                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Total</FormLabel>
                                        <Text style={{ fontSize: 16 }}>{`${Total}`} </Text>

                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Adj Qty</FormLabel>
                                        <FormInput style={{ fontSize: 16 }} value={`${Quantity}`} />
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Adj UM</FormLabel>
                                        <FormInput style={{ fontSize: 16 }} value={`${U_M}`} />
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Adj Rate</FormLabel>
                                        <FormInput style={{ fontSize: 16 }} value={`${Rate}`} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Cost Category</FormLabel>
                                        <Menu
                                            visible={showCostCategoryMenu}
                                            onDismiss={() => setShowCostCategoryMenu(false)}
                                            anchor={
                                                <TouchableOpacity style={{ backgroundColor: "#f1f4f8", padding: 8, borderRadius: 4 }} onPress={() => setShowCostCategoryMenu(true)}>
                                                    <Text style={{ fontSize: 16, fontFamily: "URBAN_MEDIUM" }} >{Cost_Category}</Text>

                                                </TouchableOpacity>
                                            }
                                        >
                                            {
                                                [1, 2, 3].map((option, index) =>
                                                    <Menu.Item key={index} onPress={() => { setShowCostCategoryMenu(false) }} title={option} />
                                                )
                                            }
                                        </Menu>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Owner Clarification</FormLabel>
                                        <FormInput style={{ fontSize: 16 }} value={`${Owner_Clarification}`} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Portal.Host>
                </Modal>


            </Provider>
        )
    }
    return (
        <>
            <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={rightButtons}>
                <TouchableOpacity style={{ padding: 8 }} onPress={() => setShowModal(true)}>
                    <CurrentFormHeading>{Scope_Notes}</CurrentFormHeading>
                    <View style={{ flexDirection: "row" }}>
                        <PreviewLabel>Qty {Quantity}</PreviewLabel>
                        <PreviewLabel>Rate {Rate}</PreviewLabel>
                        <PreviewLabel>Total {Total}</PreviewLabel>
                    </View>
                </TouchableOpacity>
            </Swipeable>
            <Modal transparent visible={showModal} onClose={() => setShowModal(false)} >
                <View style={{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 48 }}>
                    <View style={{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }}>
                        <View>
                            <FormLabel style={{ fontSize: 12 }}>Scope Notes</FormLabel>
                            <FormInput style={{ fontSize: 16 }} value={Scope_Notes} />
                        </View>
                        <View style={{ flexDirection: "row", marginVertical: 8 }}>
                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                <FormLabel style={{ fontSize: 12 }}>Quantity</FormLabel>
                                <FormInput style={{ fontSize: 16 }} value={`${Quantity}`} />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                <FormLabel style={{ fontSize: 12 }}>Rate</FormLabel>
                                <FormInput style={{ fontSize: 16 }} value={`${Rate}`} />
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                <FormLabel style={{ fontSize: 12 }}>Total</FormLabel>
                                <FormInput style={{ fontSize: 16 }} value={`${Total}`} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const windowWidth = Dimensions.get('window').width;

const MenuWrapper = styled.View`
margin:16px 0;
background-color: #1E2429;
flex-direction: row;
padding:12px;
justify-content: center;
width: ${windowWidth}px ;
`;


const CurrentFormHeading = styled.Text`
font-family: 'URBAN_BOLD';
text-transform: uppercase;
font-size: ${Platform.OS === "android" ? 12 : 16}px;

`;


const PreviewLabel = styled.Text`
font-family: 'URBAN_MEDIUM';
font-size: ${Platform.OS === "android" ? 12 : 16}px;
color: green;
flex: 1;
`;

const AddNewBtn = styled.TouchableOpacity`
background-color:#8477EB;
flex: 1;
justify-content:center;
align-items:center;
border-radius:4px;
`;


const FormLabel = styled.Text`
font-family: 'URBAN_BOLD';
font-size: ${Platform.OS === "android" ? 12 : 16}px;
margin-bottom: 4px;
`

const FormInput = styled.TextInput`
background-color: #f1f4f8;
padding: 8px;
font-family: 'URBAN_MEDIUM';
border-radius: 4px;
`;

const ReviewerActionBtn = styled.TouchableOpacity`
background-color: ${props => props.backgroundColor};
flex: 1;
margin: 0 16px;
padding: 8px 16px;
border-radius: 16px;
justify-content: center;
align-items:center;
`;

const ReviewerLineItemWrapper = styled.TouchableOpacity`
padding: 8px;
background-color: ${props => props.backgroundColor};
`;

const ReviewerPreviewLabel = styled(PreviewLabel)`
font-size: ${Platform.OS === "android" ? 10 : 12}px;
`;



export default CoForms