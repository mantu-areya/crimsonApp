import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import SignatureScreen from "react-native-signature-canvas";
import Ionicons from "react-native-vector-icons/Ionicons"


export default function SignModal({ text, onOK, onCancel }) {
    const ref = React.useRef();

    const handleOK = (signature) => {
        onOK(signature);
    };


    const handleClear = () => {
        ref.current.clearSignature();
    };

    const handleConfirm = () => {
        ref.current.readSignature();
    };

    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

    return (
        <View style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingVertical:8,
            width: "100%",
            flex: .5, backgroundColor: "white",
        }}>

            <View style={{width: "100%",flexDirection: 'row',alignItems: 'center'}}>
                <Text style={{ fontSize: 14, fontFamily: 'URBAN_BOLD', marginVertical: 8 }}>{text}</Text>
                <Ionicons onPress={onCancel} name="close" style={{marginLeft:"auto"}} size={28}  />
            </View>

            <SignatureScreen
                webStyle={style}
                ref={ref}
                onOK={handleOK}
                backgroundColor={"white"}
                autoClear={false}
                penColor={"rgba(0,0,0)"}
                imageType="image/jpeg"
                minWidth={2}
                showImage={true}
            />
            <View style={styles.row}>
                <Button onPress={handleClear}>Clear</Button>
                <Button mode="contained" onPress={handleConfirm}>Confirm</Button>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 250,
        padding: 10,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "100%",
        alignItems: "center",
    },
});