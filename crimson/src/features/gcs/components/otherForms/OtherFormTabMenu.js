import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { VendorFormContext } from "../../../../services/context/VendorForm/vendorForm.contex";
import OtherCategoryForm from "./OtherCategoryForm";

 export default function OtherFormTabMenu({ formsData, inspId, grandTotal, navigation ,readOnly,sequence, setSequence}) {
    const [currentForm, setCurrentForm] = React.useState('General Rental Operations Scope')
  const { vendorFormDetails, updateToSf } = React.useContext(VendorFormContext);
    const GetToal = () => {
        let toatalSF = 0;
        formsData[currentForm].map(ele => {
            toatalSF = toatalSF + ele.Total
            return toatalSF
        })
        return toatalSF
    }

    React.useEffect(() => {
         updateToSf(inspId)
      }, [currentForm])

    return (
        <View style={{ borderRadius: 8, padding: 8, marginBottom: 32, backgroundColor: "#D9D9D9", }}>
            {/* Totals */}
            <View style={{ alignItems: "flex-end", marginTop: 8 }}>
                <Text style={{ fontSize: 16, fontFamily: 'SF_BOLD' }}>
                GRAND TOTAL BID SUBMITTED : ${grandTotal.toFixed(2)}
                </Text>
                <Text style={{ fontSize: 14, fontFamily: 'SF_BOLD' }}>
                    {currentForm} Total: ${GetToal().toFixed(2)}
                </Text>
            </View>
            <ScrollView horizontal style={{ marginVertical: 8, paddingHorizontal: 8 }}>
                <View style={{ flexDirection: 'row' }}>
                    {
                        Object.keys(formsData).map((item, i) => 
                        <Button onPress={() => setCurrentForm(item)} mode={currentForm === item ? 'contained' : 'text'} key={i} style={{ marginRight: 8, width: 120, borderColor: 'purple', borderBottomWidth: !(currentForm === item) ? 2 : 0 }}>
                            {item}
                        </Button>)
                    }
                </View>
            </ScrollView>
            {/* Other Forms */}
            <OtherCategoryForm currFormdata={formsData[currentForm]} inspId={inspId} navigation={navigation} readOnly={readOnly} setSequence={setSequence} sequence={sequence} />
        </View>
    )
}
