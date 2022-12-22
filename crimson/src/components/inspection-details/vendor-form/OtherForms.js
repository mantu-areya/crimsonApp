import { View, Text, FlatList, ActivityIndicator, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import styled from 'styled-components/native';
import FormLineItem from './FormLineItem';
import { useIsFocused } from '@react-navigation/native';
import { VendorFormContext } from '../../../services/context/VendorForm/vendorForm.contex';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo'





const OtherForms = ({ sectionTotals, formStatus, gTotal, isSubmitted, isForReviewerView, readOnly, inspectionData, navigation, setVendorFormData }) => {


    let [general_Rental, setGeneral_Rental] = React.useState([])
    let [pools, setPools] = React.useState([])
    let [exterior, setExterior] = React.useState([])
    let [interior, setInterior] = React.useState([])
    let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
    let [grandTotal, setGrandTotal] = React.useState(0.00)
    let [room_MeasurementData, setRoom_MeasurementData] = React.useState([])
    const [sequence, setSequence] = React.useState();

    const { vendorFormDetails, updateToSf, deleteNewItem } = React.useContext(VendorFormContext);


    const isFocused = useIsFocused();


    const GetDataByCategory = (inspData) => {
        let room_msrmnt = []
        let category1 = []
        let category2 = []
        let category3 = []
        let category4 = []
        let category5 = []
        let grandTtl = 0.00;
        let sequenceArray = []

        Object.keys(inspData).map(item => {
            if (inspData[item].Category === "Room Measurements") {
                sequenceArray.push(inspData[item].Sequence)
                room_msrmnt.push(inspData[item])
            }
            else if (inspData[item].Category === "General Rental Operations Scope") {
                sequenceArray.push(inspData[item].Sequence)
                category1.push(inspData[item])
            } else if (inspData[item].Category === "Pools") {
                sequenceArray.push(inspData[item].Sequence)
                category2.push(inspData[item])

            } else if (inspData[item].Category === "Exterior") {
                sequenceArray.push(inspData[item].Sequence)
                category3.push(inspData[item])

            } else if (inspData[item].Category === "Interior") {
                sequenceArray.push(inspData[item].Sequence)
                category4.push(inspData[item])

            } else if (inspData[item].Category === "Mechanical, Electrical and Plumbing Systems") {
                sequenceArray.push(inspData[item].Sequence)
                category5.push(inspData[item])

            }
            if (inspData[item].Category !== "Room Measurements") {
                grandTtl = grandTtl + (inspData[item].Total)
            }

        })

        let lastSequence = sequenceArray.sort(function (a, b) { return a - b; }).pop()
        setSequence(lastSequence)
        setRoom_MeasurementData(room_msrmnt);
        setGeneral_Rental(category1);
        setPools(category2);
        setExterior(category3);
        setInterior(category4);
        setMech_Elec_Plumb(category5);
        setGrandTotal(grandTtl)
    }


    React.useEffect(() => {
        let contexRecord = vendorFormDetails[inspectionData.Id]
        if (contexRecord) {
            if (contexRecord == "NA") {
                // setShowMsg(true)
            }
            else {
                GetDataByCategory(contexRecord)
                contexRecord.map((item, i) => {
                    item.newItem && console.log(item.newItem, "ITEME");
                })
            }
        }
    }, [vendorFormDetails]);

    const [currentForm, setCurrentForm] = React.useState('Room Measurements');

    const GetTotal = () => {

        let toatalSF = 0;
        currentFormData.data.map(ele => {
            toatalSF = toatalSF + (ele.Total == 0 ? ele.Approved_Amount : ele.Total)
            return toatalSF
        })
        return toatalSF.toLocaleString("en-IN", { style: "currency", currency: 'USD' })
    }

    const GetToalSqFt = () => {
        let toatalSF = 0;
        currentFormData.data.map(ele => {
            toatalSF = toatalSF + ele.Room_Total
            return toatalSF
        })
        return toatalSF.toFixed(2)
    }


    // React.useEffect(() => {
    //     updateToSf(inspectionData.Id)
    // }, [currentForm])


    React.useEffect(() => {
        isFocused == false && updateToSf(inspectionData.Id)
    }, [isFocused])

    const menuItems = [
        {
            title: 'Room Measurements',
            icon: <MaterialCommunityIcons size={28} name='bed' color={"#FF6666"} />,
            data: room_MeasurementData,
        },
        {
            title: 'General Rental Operations Scope',
            icon: <MaterialCommunityIcons size={28} name='home-city' color={"#DE9B67"} />,
            data: general_Rental,
        },
        {
            title: 'Pools',
            icon: <MaterialIcons size={28} name='pool' color={"#DE9B67"} />
            , data: pools
        },
        {
            title: 'Exterior',
            icon: <MaterialCommunityIcons size={28} name='home' color={"#7A8AE7"} />
            , data: exterior
        },
        {
            title: 'Interior',
            icon: <MaterialCommunityIcons size={28} name='home-account' color={"#36905C"} />,
            data: interior
        },
        {
            title: 'Mechanical, Electrical and Plumbing Systems',
            icon: <MaterialIcons size={28} name='handyman' color={"#F1A8AC"} />,
            data: mech_Elec_Plumb
        },
    ]


    const currentFormData = menuItems.filter((item) => item.title === currentForm)[0]


    const [dataList, setDatalist] = React.useState([]);

    const { updateVfContect, addNewItem } = React.useContext(VendorFormContext);
    const [NewItemAdded, setNewItemAdded] = React.useState(0);
    const [showAddButton, setShowAddButton] = React.useState(false)

    const onOtherFormValueChange = (value, field, key) => {
        console.log("changing", field, 'with', value, "KEY", key);
        const isNotStringValueField = !(["Matrix_Price", "Sub_Category", "U_M", "Scope_Notes", "Owner_Clarification"]?.includes(field))
        if (isNotStringValueField && isNaN(value)) {
            console.log("NAN", isNaN(value));
            return;
        }
        if (parseFloat(value) < 0) {
            console.log("Entered val is negative");
            return;
        }
        let newState, Sub_Category;
        let newSequence = sequence + 1
        let Category = currentFormData && currentFormData.data[0].Category
        if (field == "newItem") {
            const Category_Keys = { "Pools": "Off Matrix - Pool", "Exterior": "Off Matrix - Exterior", "Interior": "Off Matrix - Interior", "Mechanical, Electrical and Plumbing Systems": "Off Matrix - MEP" }
            Category_Keys && Object.keys(Category_Keys).map(ele => {
                Category == ele && (Sub_Category = Category_Keys[ele])
            })

            let itemObject = [{
                "Sub_Category": Sub_Category && Sub_Category,
                "Room_Total": 0,
                "Room_Misc_SF": null,
                "Room_Length": null,
                "Room_Width": null,
                "Matrix_Price": Sub_Category && Sub_Category,
                "Sequence": newSequence,
                "UniqueKey": (inspectionData.Id + '#' + newSequence.toFixed(3)),
                "U_M": null,
                "Total": 0.00,
                "Scope_Notes": null,
                "Rate": 0.00,
                "Quantity": 0,
                "Owner_Clarification": null,
                "Lookup_To_Parent": inspectionData.Id,
                "line_item_images": null,
                "Cost_Category": null,
                "Contract_Type": null,
                "Category": Category && Category,
                "Approved_Amount": 0.00,
                "Approval_Status": null,
                "Adj_U_M": null,
                "Adj_Rate": 0.00,
                "Adj_Quantity": 0,
                "newItem": true
            }]
            dataList.push(itemObject[0])
            newState = dataList
            setSequence(newSequence)
            addNewItem(itemObject, inspectionData.Id)
            setNewItemAdded(NewItemAdded + 1)
        } {
            newState = dataList.map(obj => {
                if (obj.UniqueKey === key) {
                    let formatedVal = ["Matrix_Price", "Sub_Category", "U_M", "Scope_Notes", "Owner_Clarification"].includes(field) ? value : parseFloat(value)
                    let newValues = { ...obj, [field]: formatedVal };
                    let newTotal;
                    let oldTotal = obj?.Total;
                    let added;

                    if (field === "Adj_Quantity" || field === "Adj_Rate") {
                        newTotal = newValues && (newValues.Adj_Quantity * newValues.Adj_Rate)
                    } else if (field === 'Owner_Clarification') {
                        newTotal = obj?.Total;
                    } else {
                        newTotal = newValues && (newValues.Quantity * newValues.Rate)
                    }

                    added = (oldTotal > newTotal);

                    let diff = (oldTotal - newTotal);
                    let newGrandTotal = added ? grandTotal + diff : grandTotal - diff;
                    newGrandTotal && setGrandTotal(newGrandTotal);


                    return { ...obj, [field]: formatedVal, ["Total"]: newTotal };
                }
                return obj;
            });
        }
        setDatalist(newState)
        setUpdatedData(currentForm, newState);
        updateVfContect(newState, "OTHRFM", inspectionData.Id);
    }

    function setUpdatedData(name, newData) {
        switch (name) {
            case 'Room Measurements':
                setRoom_MeasurementData(newData);
                break;
            case 'General Rental Operations Scope':
                setGeneral_Rental(newData);
                break;
            case 'Pools':
                setPools(newData);
                break;
            case 'Interior':
                setInterior(newData);
                break;
            case 'Exterior':
                setExterior(newData);
                break;
            case 'Mechanical , Electrical and Plumbing Systems':
                setMech_Elec_Plumb(newData);
                break;
            default:
                break;
        }
    }

    const onRoomMeasurementValueChange = async (value, field, key) => {

        console.log("changing", field, 'with', value, "KEY", key);
        const isNotStringValueField = !(["Sub_Category"]?.includes(field))
        if (isNotStringValueField && isNaN(value)) {
            console.log("NAN", isNaN(value));
            return;
        }
        if (parseFloat(value) < 0) {
            console.log("Entered val is negative");
            return;
        }

        let newData;
        let newSequence = sequence + 1
        if (field == "newItem") {
            let itemObject = [{
                "Sub_Category": "Other - Write in",
                "Room_Total": 0,
                "Room_Misc_SF": null,
                "Room_Length": null,
                "Room_Width": null,
                "Matrix_Price": "",
                "Sequence": newSequence,
                "UniqueKey": (inspectionData.Id + '#' + newSequence.toFixed(3)),
                "U_M": null,
                "Total": 0.00,
                "Scope_Notes": null,
                "Rate": 0.00,
                "Quantity": 0,
                "Owner_Clarification": null,
                "Lookup_To_Parent": inspectionData.Id,
                "line_item_images": null,
                "Cost_Category": null,
                "Contract_Type": null,
                "Category": "Room Measurements",
                "Approved_Amount": 0.00,
                "Approval_Status": null,
                "Adj_U_M": null,
                "Adj_Rate": 0.00,
                "Adj_Quantity": 0,
                "newItem": true
            }]
            dataList.push(itemObject[0])
            newData = dataList
            setSequence(newSequence)
            addNewItem(itemObject, inspectionData.Id)
            setNewItemAdded(NewItemAdded + 1)
        } else if (field == "Sub_Category") {
            newData = dataList.map(obj => {
                if (obj.UniqueKey === key) {
                    return { ...obj, [field]: value };
                }
                return obj;
            });
        } else {

            // if (value < 0 || value === '' || value === null || value === undefined) {
            //     return;
            // }
            newData = dataList.map(obj => {
                if (obj.UniqueKey === key) {
                    let formatedVal = ["Sub_Category"].includes(field) ? value : parseFloat(value)
                    let newValues = { ...obj, [field]: formatedVal };
                    // let newValues = { ...obj, [field]: parseFloat(value) };
                    let newTotal = (newValues.Room_Length * newValues.Room_Width) + newValues.Room_Misc_SF
                    return { ...obj, [field]: parseFloat(value), ["Room_Total"]: newTotal };
                }
                // obj.UniqueKey === key && console.log("ff");

                return obj;
            });

        }

        // console.log(newData);
        setDatalist(newData);
        setUpdatedData(currentForm, newData);
        updateVfContect(newData, "RM", inspectionData.Id);
    }


    React.useEffect(() => {
        setDatalist(currentFormData.data);
    }, [currentFormData.data])

    React.useEffect(() => {
        updateToSf(inspectionData.Id)

    }, [NewItemAdded])

    function handleAddNewItem() {
        console.log("Adding New Item to", currentForm);
        if (currentForm === "Room Measurements") {
            return onRoomMeasurementValueChange(null, "newItem");
        }
        onOtherFormValueChange(null, "newItem");
    }

    function handleOnSave(isForRoomMeasurement = false) {
        let formType = isForRoomMeasurement ? "RM" : "OTHRFM";
        console.log("Updating VF Context", formType);
        updateVfContect(dataList, formType, inspectionData.Id);
    }


    function handleOnFormChange(title) {
        console.log("FORM CHANGE TO: " + title);
        setCurrentForm(title);
        updateToSf(inspectionData.Id)
        setSearchQuery("")
    }

    function handleAcceptLineItem(lineItemId, status) {
        console.log("CHNAGING ITEM: " + lineItemId);
        let updatedData = dataList.map((data) => {
            if (data.Id === lineItemId) {
                data.Approval_Status = status
            }
            return data;
        });
        setDatalist(updatedData);
        updateVfContect(updatedData, "OTHRFM", inspectionData.Id);
        updateToSf(inspectionData.Id, false);
    }

    function getPendingApprovalCount() {
        return dataList.filter(item => item.Approval_Status === null).length
    }

    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => {
        setSearchQuery(query);
    }

    const isSubmittedByReviewer = formStatus === "Reviewer Form Completed";

    const [showDropDown, setShowDropDown] = React.useState(false)



    return (
        <View>
            {!isSubmitted &&
                <>
                    {/* Menu */}
                    <MenuWrapper >
                        {menuItems.map((item, i) => <MenuItem isActive={item.title === currentForm} onPress={() => handleOnFormChange(item.title)} key={i}>{item.icon}</MenuItem>)}
                    </MenuWrapper>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
                        {
                            !isForReviewerView &&
                            !(currentForm === "Room Measurements") &&
                            <View style={{ flex: 1 }}>
                                <CurrentFormHeading style={{ marginLeft: 0, textAlign: "left", fontSize: 16 }}>Grand Bid Total</CurrentFormHeading>
                                <Text style={{ color: 'black', fontFamily: 'URBAN_BOLD', textAlign: "left", fontSize: 14 }}>{grandTotal ? grandTotal.toLocaleString("en-IN", { style: "currency", currency: 'USD' }) : 0}</Text>
                            </View>

                        }
                        <View style={{ flex: 1 }}>
                            <CurrentFormHeading style={{ textAlign: "right", fontSize: 16 }}>{currentForm}</CurrentFormHeading>
                            <Text style={{ color: 'black', fontFamily: 'URBAN_BOLD', textAlign: "right", fontSize: 14 }}>Total: {currentForm === "Room Measurements" ? GetToalSqFt() + " sqft" : GetTotal()}</Text>
                        </View>
                    </View>
                    {/* Search */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4, paddingHorizontal: 16, backgroundColor: "white", margin: 8 }}>
                        <Icon name="search" color="grey" style={{ flex: .1, }} size={18} />
                        <TextInput value={searchQuery} onChangeText={onChangeSearch} placeholder={currentForm === "Room Measurements" ? "Search Sub Category" : "Search Matrix Price..."} style={{ flex: .8, fontFamily: "URBAN_BOLD", backgroundColor: "transparent", fontSize: 18, padding: 12, width: "100%" }} />
                        {
                            searchQuery.length > 0 &&
                            <EntypoIcon onPress={() => setSearchQuery("")} name="cross" color="grey" style={{ flex: .1 }} size={24} />
                        }
                    </View>
                    {
                        (isForReviewerView && currentForm !== "Room Measurements") &&
                        <View intensity={100} style={{ marginVertical: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <CurrentFormHeading style={{ fontSize: Platform.OS === "android" ? 18 : 22 }}>BID FOR REVIEW</CurrentFormHeading>
                            <CurrentFormHeading style={{ fontSize: Platform.OS === "android" ? 16 : 18, textTransform: 'none' }}>Pending Approvals {getPendingApprovalCount()}/{dataList.length}</CurrentFormHeading>
                        </View>
                    }
                    {
                        dataList.length > 0 ?
                            isForReviewerView ?
                                <ScrollView >
                                    {
                                        dataList.sort((a, b) => b.Quantity - a.Quantity).filter(item => {
                                            return item?.Sub_Category?.includes(searchQuery) || item?.Matrix_Price?.includes(searchQuery)
                                        }).map((item, i) => <FormLineItem key={item?.Id}   {...{ isSubmittedByReviewer, handleAcceptLineItem, isForReviewerView, item, inspId: inspectionData.Id, onRoomMeasurementValueChange, onOtherFormValueChange, navigation, readOnly, setShowAddButton, handleOnSave, deleteNewItem }} isForRoomMeasurement={currentFormData.title === "Room Measurements"} />)
                                    }
                                </ScrollView>
                                :
                                <ScrollView style={{marginBottom:currentForm === "Room Measurements" || currentForm === "General Rental Operations Scope"  ? 128 : 0}}>
                                    {
                                        dataList.filter(item => {
                                            return item?.Sub_Category?.includes(searchQuery) || item?.Matrix_Price?.includes(searchQuery)
                                        }).map((item, i) => <FormLineItem key={item?.Id}   {...{ isSubmittedByReviewer, handleAcceptLineItem, isForReviewerView, item, inspId: inspectionData.Id, onRoomMeasurementValueChange, onOtherFormValueChange, navigation, readOnly, setShowAddButton, handleOnSave, deleteNewItem }} isForRoomMeasurement={currentFormData.title === "Room Measurements"} />)
                                    }
                                </ScrollView>
                            :
                            <View style={{ padding: 16 }}>
                                <ActivityIndicator />
                            </View>

                    }
                    {!readOnly && showAddButton &&
                        <View style={{marginBottom:84}}>
                            <AddNewLineItemButton mode="contained" onPress={handleAddNewItem} labelStyle={{
                                fontFamily: 'URBAN_BOLD'
                            }}>
                                Add New Item
                            </AddNewLineItemButton>
                        </View>
                    }

                </>
            }
            {
                isSubmitted &&
                <>
                    <MenuWrapper style={{ justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => setShowDropDown(!showDropDown)} style={{ flexDirection: "row" }}>
                            <MaterialCommunityIcons size={28} name='home-city' color={"#DE9B67"} />
                            <Text style={{ marginLeft: 8, color: '#C2CBD0', fontFamily: 'URBAN_BOLD', fontSize: 24 }}>Work Order {<Icon name={showDropDown ? "caret-up" : "caret-down"} size={16} color="white" />}</Text>
                        </TouchableOpacity>
                        <View>
                            <Text style={{ color: '#C2CBD0', fontFamily: 'URBAN_BOLD', fontSize: 24 }}>{gTotal}</Text>
                        </View>
                    </MenuWrapper>
                    {/* Sub Section Total */}
                    {
                        showDropDown &&
                        <View style={{ marginHorizontal: 8, padding: 16, backgroundColor: "white" }}>
                            <DescriptionWrapper>
                                <Text style={{ color: 'black', fontFamily: 'URBAN_BOLD', fontSize: 16 }}>Section Breakdown</Text>
                                <DescriptionText style={{ marginTop: 8 }}>
                                    General Rental Scopes - {sectionTotals.grs}
                                </DescriptionText>
                                <DescriptionText >
                                    Pools - {sectionTotals.pools}
                                </DescriptionText>
                                <DescriptionText >
                                    Exterior - {sectionTotals.exterior}
                                </DescriptionText>
                                <DescriptionText >
                                    Interior - {sectionTotals.interior}
                                </DescriptionText>
                                <DescriptionText >
                                    MEP - {sectionTotals.mep}
                                </DescriptionText>
                            </DescriptionWrapper>
                        </View>
                    }
                    {/* Search */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4, paddingHorizontal: 16, backgroundColor: "white", margin: 8 }}>
                        <Icon name="search" color="grey" style={{ flex: .1, }} size={18} />
                        <TextInput value={searchQuery} onChangeText={onChangeSearch} placeholder={currentForm === "Room Measurements" ? "Search Sub Category" : "Search Matrix Price..."} style={{ flex: .8, fontFamily: "URBAN_BOLD", backgroundColor: "transparent", fontSize: 18, padding: 12, width: "100%" }} />
                        {
                            searchQuery.length > 0 &&
                            <EntypoIcon onPress={() => setSearchQuery("")} name="cross" color="grey" style={{ flex: .1 }} size={24} />
                        }
                    </View>
                    {
                        dataList.length > 0 ?
                            <ScrollView style={{minHeight:96}}>
                                {
                                    [].concat(general_Rental, pools, exterior, interior, mech_Elec_Plumb).filter(item => {
                                        if (currentForm === "Room Measurements") {
                                            return item?.Sub_Category?.includes(searchQuery)
                                        }
                                        return item?.Matrix_Price?.includes(searchQuery);
                                    }).filter(item => item.Approval_Status === "Approved" || item.Approval_Status === "Approved as Noted").map((item, i) =>
                                        <FormLineItem key={item?.Id}
                                            {...{ isSubmitted, isForReviewerView, item, inspId: inspectionData.Id, onRoomMeasurementValueChange, onOtherFormValueChange, navigation, readOnly, setShowAddButton, handleOnSave }} x
                                            isForRoomMeasurement={currentFormData.title === "Room Measurements"} />)
                                }
                            </ScrollView> :
                            <View style={{ padding: 16 }}>
                                <ActivityIndicator />
                            </View>

                    }


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

export default OtherForms