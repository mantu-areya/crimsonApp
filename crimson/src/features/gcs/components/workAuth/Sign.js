import React from "react";
import { StyleSheet, View, Text } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import Ionicons from "react-native-vector-icons/Ionicons"


export default function Sign({ text, onOK, handleOnCancel }) {
  const ref = React.useRef();

  const handleSignature = signature => {
    onOK(signature);
  };

  return (
    <View style={styles.container}>
      <View style={{ padding:8, width: "100%", flexDirection: 'row', alignItems: 'center',backgroundColor:"white" }}>
        <Text style={{ fontSize: 14, fontFamily: 'URBAN_BOLD', marginVertical: 8 }}>{text}</Text>
        <Ionicons onPress={handleOnCancel} name="close" style={{ marginLeft: "auto" }} size={28} />
      </View>
      <View style={{ height: 360, width: "100%" }}>
        <SignatureScreen
          ref={ref}
          onOK={handleSignature}
          autoClear={false}
          descriptionText={""}
          backgroundColor={"white"}
          penColor={"rgba(0,0,0)"}
          imageType="image/jpeg"
          minWidth={3}
          overlayHeight="100%"
          showImage={true}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});