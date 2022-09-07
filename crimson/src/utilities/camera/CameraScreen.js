import styled from "styled-components/native";
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { Text } from "../../components/typography/text.component";
import { SafeArea } from "../../components/utility/safe-area.component";
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, Image, FlatList, ScrollView } from 'react-native'
import { Spacer } from "../../components/spacer/spacer.component";
import { Col, Row } from "react-native-responsive-grid-system";
const CameraView = styled(Camera)`
  width: 100%;
  height: 100%;
  position:absolute;
`;

const CaptureButton = styled(TouchableOpacity)`
margin-top:170%;
margin-left:40%
`;

const Images = styled(ImageBackground).attrs({
})`
margin:3px;
width:50px;
`;

export const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [images, setImages] = useState([]);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }

  const __takePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    console.log(photo.uri, "ee")
    const newImages = [...images];
    newImages.push({ uri: photo.uri });
    setImages(newImages);

    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }

  const __savePhoto = () => { }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (

    <View
      style={{
        flex: 1,
        width: '100%'
      }}
    >

      <CameraView
        ref={(camera) => (cameraRef.current = camera)}
      >
        <SafeArea>
          {previewVisible && capturedImage && <CameraPreview photo={capturedImage} savePhoto={() => { __savePhoto }} retakePicture={() => { __retakePicture }} images={images} />}

          <Col>
{/* <Row>
  <Text>action button</Text>
</Row> */}
            <Row>
              <CaptureButton
                onPress={__takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#fff',

                }}
              />
            </Row>

          </Col>
        </SafeArea>

      </CameraView>



    </View>
  );
}



const CameraPreview = ({ photo, retakePicture, savePhoto, images }) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        // flex: 1,
        width: '100%',
        height: '12%',
        position: 'absolute'
      }}
    >

      <ScrollView horizontal={true} >
        {
          images && images.map(ele => {
            return <Images
              source={{ uri: ele && ele.uri }}
              key={ele.uri}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  padding: 15,
                  justifyContent: 'flex-end'
                }}
              >
              </View>
            </Images>
          })
        }

      </ScrollView>




      {/* <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground> */}
    </View>
  )
}