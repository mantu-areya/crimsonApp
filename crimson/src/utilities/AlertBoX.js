import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

export const AlertBoX = ({message,callback}) => {
  const createAlert = () =>
    Alert.alert(
      "Alert Title",
      message&& message,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {callback()} }
      ]
    );



  return (
    <>
      {createAlert()}
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  }
});

