import { View,TouchableOpacity } from "react-native"
import styled from "styled-components/native";
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { Text } from "../../components/typography/text.component";

const CameraView = styled(Camera)`
  width: 100%;
  height: 100%;
`;

export const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <CameraView
      ref={(camera) => (cameraRef.current = camera)}
      ></CameraView>
      );
}