import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { VendorFormContext } from "../../../../services/context/VendorForm/vendorForm.contex";
import OtherCategoryLineItem from "./OtherCategoryLineItem";

export default function OtherCategoryForm({ currFormdata, inspId, navigation }) {

    const [dataList,setDatalist] = React.useState([])

    const { updateVfContect } = React.useContext(VendorFormContext);



    React.useEffect(() => {
        updateVfContect(dataList,"OTHRFM",inspId);
    }, [dataList]);

    const onValueChange =  (value,field,key)=>{
        console.log("changing",field,'with',value);
        const newState = dataList.map(obj => {
          if (obj.UniqueKey === key) {
            let newValues = { ...obj, [field]: parseFloat(value) };
            let newTotal = (newValues.Quantity * newValues.Rate)
            return { ...obj,[field]:value, ["Total"]: newTotal };
          }
        //   obj.UniqueKey === key && 
          return obj;
        });
        setDatalist(newState)
      }

      React.useEffect(() => {
        setDatalist(currFormdata);
      }, [currFormdata])



    return (
        <View>
            {
                dataList.length > 0 ?
                    < FlatList
                        data={dataList ?? []}
                        keyExtractor={(item) => item.UniqueKey}
                        renderItem={(item) => (
                            <OtherCategoryLineItem item={item.item} onValueChange={onValueChange}  navigation={navigation}/>
                        )}
                    /> :
                    <View style={{ padding: 16 }}>
                        <ActivityIndicator />
                    </View>
            }
        </View>
    )

}

