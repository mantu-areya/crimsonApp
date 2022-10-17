import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { VendorFormContext } from "../../../../services/context/VendorForm/vendorForm.contex";
import OtherCategoryLineItem from "./OtherCategoryLineItem";
import { Button } from "react-native-paper";

export default function OtherCategoryForm({ currFormdata, inspId, navigation ,readOnly, sequence, setSequence}) {

    const [dataList,setDatalist] = React.useState([])

    const { updateVfContect, addNewItem,deleteNewItem } = React.useContext(VendorFormContext);
    const [NewItemAdded, setNewItemAdded] = React.useState(0);
    const [showAddButton , setShowAddButton] = React.useState(false)

    React.useEffect(() => {
        updateVfContect(dataList,"OTHRFM",inspId);
    }, [dataList]);

    const onValueChange =  (value,field,key)=>{
        console.log("changing",field,'with',value);
        let newState,Sub_Category;
        let newSequence = sequence + 1
        let Category = currFormdata && currFormdata[0].Category
        if (field == "newItem") {
          const Category_Keys = {"Pools":"Off Matrix - Pool","Exterior":"Off Matrix - Exterior","Interior":"Off Matrix - Interior","Mechanical, Electrical and Plumbing Systems":"Off Matrix - MEP"}
          Category_Keys && Object.keys(Category_Keys).map (ele=>{
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
            "UniqueKey": (inspId + '#' + newSequence.toFixed(3)),
            "U_M": null,
            "Total": 0.00,
            "Scope_Notes": null,
            "Rate": 0.00,
            "Quantity": 0,
            "Owner_Clarification": null,
            "Lookup_To_Parent": inspId,
            "line_item_images": null,
            "Cost_Category": null,
            "Contract_Type": null,
            "Category": Category && Category,
            "Approved_Amount": 0.00,
            "Approval_Status": null,
            "Adj_U_M": null,
            "Adj_Rate": 0.00,
            "Adj_Quantity": 0,
            "newItem":true
          }]
          dataList.push(itemObject[0])
          newState = dataList
          setSequence(newSequence)
          addNewItem(itemObject,inspId)
          setNewItemAdded(NewItemAdded + 1)
        } {
         newState = dataList.map(obj => {
          if (obj.UniqueKey === key) {
            let newValues = { ...obj, [field]: parseFloat(value) };
            let newTotal = (newValues.Quantity * newValues.Rate)
            return { ...obj,[field]:value, ["Total"]: newTotal };
          }
        //   obj.UniqueKey === key && 
          return obj;
        });
      }
        setDatalist(newState)
      }

      React.useEffect(() => {
        setDatalist(currFormdata);
      }, [currFormdata])

      function handleAddNewItem() {
        onValueChange(null, "newItem")
        // alert("Add new item");
      }


    return (
        <View>
            {
                dataList.length > 0 ?
                    < FlatList
                        data={dataList ?? []}
                        keyExtractor={(item) => item.UniqueKey}
                        renderItem={(item) => (
                            <OtherCategoryLineItem item={item.item} onValueChange={onValueChange}  navigation={navigation} readOnly={readOnly} setShowAddButton={setShowAddButton} deleteNewItem={deleteNewItem} inspId={inspId}/>
                        )}
                    /> :
                    <View style={{ padding: 16 }}>
                        <ActivityIndicator />
                    </View>
            }
            {!readOnly &&showAddButton &&  <View style={{ marginTop: 8 }}>
                    <Button mode="contained" onPress={handleAddNewItem}>
                      Add New Item
                    </Button>
                  </View>}
        </View>
    )

}

