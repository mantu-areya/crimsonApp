import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import styled from 'styled-components/native';
import FormLineItem from './FormLineItem';
import { useIsFocused } from '@react-navigation/native';
import { VendorFormContext } from '../../../services/context/VendorForm/vendorForm.contex';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-paper';

const OtherForms = ({ readOnly, inspectionData, navigation }) => {


    let [general_Rental, setGeneral_Rental] = React.useState([])
    let [pools, setPools] = React.useState([])
    let [exterior, setExterior] = React.useState([])
    let [interior, setInterior] = React.useState([])
    let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
    let [grandTotal, setGrandTotal] = React.useState(0.00)
    let [room_MeasurementData, setRoom_MeasurementData] = React.useState([])
    const [sequence, setSequence] = React.useState();

    const { vendorFormDetails, updateToSf } = React.useContext(VendorFormContext);


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
                   item.newItem && console.log(item.newItem,"ITEME");
                })
            }
        }
    }, [vendorFormDetails]);

    const [currentForm, setCurrentForm] = React.useState('General Rental Operations Scope');

    const GetTotal = () => {
        let toatalSF = 0;
        formsData[currentForm].map(ele => {
            toatalSF = toatalSF + ele.Total
            return toatalSF
        })
        return toatalSF
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
            title: 'Interior',
            icon: <MaterialCommunityIcons size={28} name='home-account' color={"#36905C"} />,
            data: interior
        },
        {
            title: 'Exterior',
            icon: <MaterialCommunityIcons size={28} name='home' color={"#7A8AE7"} />
            , data: exterior
        },
        {
            title: 'Pools',
            icon: <MaterialIcons size={28} name='pool' color={"#DE9B67"} />
            , data: pools
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

    // React.useEffect(() => {
    //     updateVfContect(dataList, "OTHRFM", inspectionData.Id);
    // }, [dataList]);

    const onOtherFormValueChange = (value, field, key) => {
        console.log("changing", field, 'with', value);
        let newState, Sub_Category;
        let newSequence = sequence + 1
        let Category = currentFormData && currentFormData.Category
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
        }  {
            newState = dataList.map(obj => {
                if (obj.UniqueKey === key) { 
                    let formatedVal = ["U_M", "Scope_Notes"].includes(field) ? value : parseFloat(value)
                    let newValues = { ...obj, [field]: formatedVal };
                    let newTotal = (newValues.Quantity * newValues.Rate)
                    return { ...obj, [field]: formatedVal, ["Total"]: newTotal };
                }
                //   obj.UniqueKey === key && 
                return obj;
            });
        }
        setDatalist(newState)
        updateVfContect(newState, "OTHRFM", inspectionData.Id);
    }

    const onRoomMeasurementValueChange =  async (value, field, key) => {

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
            "newItem":true
          }]
          dataList.push(itemObject[0])
          newData = dataList
          setSequence(newSequence)
          addNewItem(itemObject,inspectionData.Id)
          setNewItemAdded(NewItemAdded + 1)
        } else if(field =="Sub_Category" ){
          newData = dataList.map(obj => {
            if (obj.UniqueKey === key) {
              return { ...obj, [field]: value };
            }
            return obj;
          });
        } else {
    
          if (value < 0 || value === '' || value === null || value === undefined) {
            return;
          }
          newData = dataList.map(obj => {
            if (obj.UniqueKey === key) {
              let newValues = { ...obj, [field]: parseFloat(value) };
              let newTotal = (newValues.Room_Length * newValues.Room_Width) + newValues.Room_Misc_SF
              return { ...obj, [field]: parseFloat(value), ["Room_Total"]: newTotal };
            }
            // obj.UniqueKey === key && console.log("ff");
    
            return obj;
          });
    
        }
    
        // console.log(newData);
        setDatalist(newData)
        updateVfContect(newState, "RM", inspectionData.Id);
      }
    

    React.useEffect(() => {
        // currentFormData.data.map(obj => {
        //     console.log(obj.newItem, "TEST NEW ITEM");
        // })
        setDatalist(currentFormData.data);
    }, [currentFormData.data])

    function handleAddNewItem() {
        console.log("Adding New Item to",currentForm);
        if (currentForm === "Room Measurements") {
          return  onRoomMeasurementValueChange(null,"newItem");
        }
        onOtherFormValueChange(null,"newItem");
    }

    function handleOnSave(isForRoomMeasurement=false) {
        let formType = isForRoomMeasurement ? "RM" : "OTHRFM";
        console.log("Updating VF Context", formType);
        updateVfContect(dataList, formType, inspectionData.Id);
    }


    function handleOnFormChange(title) {
        console.log("FORM CHANGE TO: " + title);
        setCurrentForm(title);
        updateToSf(inspectionData.Id)
    }



    return (
        <View style={{ height: 560 }}>
            {/* Menu */}
            <MenuWrapper >
                {menuItems.map((item, i) => <MenuItem onPress={() => handleOnFormChange(item.title)} key={i}>{item.icon}</MenuItem>)}
            </MenuWrapper>
            <CurrentFormHeading>{currentForm}</CurrentFormHeading>
            {
                dataList.length > 0 ?
                    <FlatList
                        data={dataList}
                        keyExtractor={item => item.UniqueKey}
                        renderItem={({ item }) => <FormLineItem   {...{item, onRoomMeasurementValueChange,onOtherFormValueChange, navigation, readOnly,setShowAddButton, handleOnSave }} isForRoomMeasurement={currentFormData.title === "Room Measurements"} />}
                    /> :
                    <View style={{ padding: 16 }}>
                        <ActivityIndicator />
                    </View>

            }
            {!readOnly && showAddButton &&
                <View>
                    <AddNewLineItemButton mode="contained" onPress={handleAddNewItem} labelStyle={{
                        fontFamily: 'URBAN_BOLD'
                    }}>
                        Add New Item
                    </AddNewLineItemButton>
                </View>
            }
        </View>
    )
}

const MenuWrapper = styled.View`
margin:16px 0;
background-color: #1E2429;
flex-direction: row;
padding:12px;
justify-content: center;
`;


const MenuItem = styled.TouchableOpacity`
margin: 0 16px;
`;

const CurrentFormHeading = styled.Text`
font-family: 'URBAN_BOLD';
text-transform: uppercase;
font-size: 16px;
margin-left: 16px;

`;

const AddNewLineItemButton = styled(Button)`
padding: 8px;
margin: 16px;
`;

export default OtherForms