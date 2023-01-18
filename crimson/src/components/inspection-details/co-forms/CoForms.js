import { View, Text, FlatList, ActivityIndicator, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import { VendorFormContext } from '../../../services/context/VendorForm/vendorForm.contex';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import NetInfo from "@react-native-community/netinfo";
import { getCoForms } from '../../../services/co-forms/co-form-apis';
import { CoFormContext } from '../../../services/co-forms/co-context';
import Swipeable from 'react-native-swipeable';



const CoForms = ({ isSubmitted, readOnly, inspectionData, navigation }) => {

    const { allCo1Forms, getAllCo1Forms } = React.useContext(CoFormContext);


    const [currentForm, setCurrentForm] = React.useState(0);


    const [NewItemAdded, setNewItemAdded] = React.useState(0);
    const [showAddButton, setShowAddButton] = React.useState(false)


    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => {
        setSearchQuery(query);
    }



    React.useEffect(() => {
        getAllCo1Forms();
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
                                    onPress={() => setCurrentForm(i)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: currentForm === i ? "#8477EB" : "white",
                                        padding: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <Text style={{
                                        color: currentForm === i ? "white" : "#8477EB",
                                        fontFamily: "URBAN_BOLD", fontSize: 16
                                    }}>CO {item}</Text>
                                </TouchableOpacity>)
                        }
                    </View>
                    {/* Search */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4, paddingHorizontal: 16, backgroundColor: "white", margin: 8 }}>
                        <Icon name="search" color="grey" style={{ flex: .1, }} size={18} />
                        <TextInput value={searchQuery} onChangeText={onChangeSearch} placeholder={"Search Matrix Price..."} style={{ flex: .8, fontFamily: "URBAN_BOLD", backgroundColor: "transparent", fontSize: 18, padding: 12, width: "100%" }} />
                        {
                            searchQuery.length > 0 &&
                            <EntypoIcon onPress={() => setSearchQuery("")} name="cross" color="grey" style={{ flex: .1 }} size={24} />
                        }
                    </View>
                    {/* CO Line Items */}
                    <ScrollView style={{ minHeight: 240 }}>
                        {
                            allCo1Forms.length > 0 && allCo1Forms.map((item, i) => <CoFormLineItem key={i} item={item} />)
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
    } = item


    if (isForReviewer) {
        return;
    }
    return (
        <>
            <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={rightButtons}>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <CurrentFormHeading>{Scope_Notes}</CurrentFormHeading>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: .2 }}>
                            <Text>QTY {Quantity}</Text>
                            <Text>RATE {Rate}</Text>
                            <Text>TOTAL {Total}</Text>
                        </View>
                        <View style={{ flexDirection: "row", flex: .8 }}>
                            <Text>A</Text>
                            <Text>R</Text>
                            <Text>D</Text>
                        </View>
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
margin-left: 16px;

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

export default CoForms