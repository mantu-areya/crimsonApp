import React from "react";
import { StyleSheet, View } from "react-native";
import SignatureScreen from "react-native-signature-canvas";


export default function Sign({ text, onOK }) {
    const ref = React.useRef();
  
    const handleSignature = signature => {
      onOK(signature);
    };
  
    const handleEmpty = () => {
      console.log('Empty');
    }
  
    const handleClear = () => {
      console.log('clear success!');
    }
  
    const handleEnd = () => {
      ref.current.readSignature();
    }
  
    const handleBegin = () => {
      console.log('begin!');
    };
  
    return (
      <View style={styles.container}>
        <SignatureScreen
          ref={ref}
          onEnd={handleEnd}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          onClear={handleClear}
          onBegin={handleBegin}
          autoClear={false}
          descriptionText={text}
          backgroundColor={"white"}
          penColor={"rgba(255,117,2,1)"}
          imageType="image/jpeg"
          minWidth={5}
          overlayHeight="100%"
          showImage={true}
        />
      </View>
    );
  }
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      height: 600
    },
  });