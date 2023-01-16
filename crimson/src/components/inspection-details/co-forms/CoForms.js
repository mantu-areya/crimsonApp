import { View, Text, FlatList, ActivityIndicator, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
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




const CoForms = ({ isSubmitted, readOnly, inspectionData, navigation }) => {

    const { vendorFormDetails, updateToSf, deleteNewItem, refreshVfData, updateModifiedLineItemToSf, updateVfContect, addNewItem } = React.useContext(VendorFormContext);


    const [currentForm, setCurrentForm] = React.useState(0);


    const [dataList, setDatalist] = React.useState([]);
    const [NewItemAdded, setNewItemAdded] = React.useState(0);
    const [showAddButton, setShowAddButton] = React.useState(false)


    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => {
        setSearchQuery(query);
    }




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
                                        backgroundColor:currentForm === i ? "#8477EB" : "white",
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
                </>
            }
        </View>
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


const MenuItem = styled.TouchableOpacity`
margin: 0 ${Platform.OS === "android" ? 12 : 16}px;
border: ${props => props.isActive ? "2px solid white" : "none"};
border-radius: 4px;
padding:4px;
`;

const CurrentFormHeading = styled.Text`
font-family: 'URBAN_BOLD';
text-transform: uppercase;
font-size: ${Platform.OS === "android" ? 12 : 16}px;
margin-left: 16px;

`;

const AddNewLineItemButton = styled(Button)`
padding: 8px;
margin: 16px;
`;

const DescriptionWrapper = styled.View`
padding: 4px;
`

const DescriptionText = styled.Text`

color: #96A1AC;
font-family: 'URBAN_BOLD';
font-size: 16px;
`

export default CoForms