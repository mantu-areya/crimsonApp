import styled from "styled-components/native";
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "expo-camera";
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator } from "react-native-paper";
import { Text } from "../../components/typography/text.component";
import { SafeArea } from "../../components/utility/safe-area.component";
import { StyleSheet, View, TouchableOpacity, Alert, ImageBackground, Image, FlatList, ScrollView, Dimensions } from 'react-native'
import { Spacer } from "../../components/spacer/spacer.component";
import { uploadSignImage } from "../../services/inspections/inspections.service";
import { Col, Row } from "react-native-responsive-grid-system";
import { uploadCOLineItemImages } from "../../services/co-forms/co-api";
let w = Dimensions.get("window").width;
let h = Dimensions.get("window").height;
const CameraView = styled(Camera)`
  width: ${w}px;
  flex :1 ;
  position: relative;
`;

const CaptureButton = styled(TouchableOpacity)`
margin: 640px auto 0;
`;

const ReTakeButton = styled(TouchableOpacity)`
margin: 660px auto 0;
`;

const ConfirmButton = styled(TouchableOpacity)`
 margin: 660px auto 0;
`;

const Images = styled(ImageBackground).attrs({
})`
margin:3px;
width:50px;
`;

const Loading = styled(ActivityIndicator)`
  margin-left: -25px;
`;

const LoadingContainer = styled.View`
margin-top:50%;
`;

export const CameraScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef();
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [images, setImages] = useState([]);
  const { params } = route

  console.log({params});


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
    const photo = await cameraRef.current.takePictureAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1
    })
    const base64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: 'base64' });
    console.log(photo.uri, "ee")
    const newImages = [...images];
    newImages.push({ uri: photo.uri, imagData: base64 });
    setImages(newImages);

    setPreviewVisible(true)
    setStartCamera(false)
    setCapturedImage(photo)
  }

  const __savePhoto = () => {
    var imagelst = [];

    var recId;
    var linItemId;
    navigation.getState().routes.forEach(element => {
      if (element.name == 'CameraScreen') {
        linItemId = element.params.lineItemId;
        recId = element.params.inspId.inspId;
        console.log(element.params.lineItemId)
        console.log(element.params.inspId.inspId)
      }
    });
    var i = 1;
    // FOR CO's
    if (params.currentCOForm) {
      console.log("INSIDE CO ", params.currentCOForm);
      images.forEach(img => {

        var imageData = {
          "file_name": linItemId + '_' + Date.now() + i,
          "image_data": img.imagData,
          "parent_record_id": recId,
          "image_type": "CO_line_item",
          "line_item_id": linItemId,
        }
        imagelst.push(imageData);
        i++;
      })
      uploadCOLineItemImages(imagelst, recId).then(result => {
        console.log('CO IMAGE RES', result)
      })
      return navigation.goBack();
    }

    // FOR VENDOR FORMS
    images.forEach(img => {

      var imageData = {
        "file_name": linItemId + '_' + i,
        "image_data": img.imagData,
        "parent_record_id": recId,
        "image_type": "line_item",
        "line_item_id": linItemId,
      }
      imagelst.push(imageData);
      i++;
    })
    uploadSignImage(imagelst, recId).then(result => {
      console.log('hjhjjh')
    })

    navigation.goBack();
  }
  const __retakePicture = async () => {
    const photo = await cameraRef.current.takePictureAsync();
    images.pop()
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeArea>
      <View
        style={{
          flex: 1,
          width: '100%',
        }}
      >

        <CameraView
          ref={(camera) => (cameraRef.current = camera)}
        >
          {/* <SafeArea> */}


          {previewVisible && capturedImage && <CameraPreview photo={capturedImage} savePhoto={() => { __savePhoto }} retakePicture={() => { __retakePicture }} images={images} />}

          <Col>
            <Row>
              <ReTakeButton onPress={__retakePicture} >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  Re-take
                </Text>
              </ReTakeButton>
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
              <ConfirmButton onPress={__savePhoto}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  Confirm
                </Text>
              </ConfirmButton>
            </Row>

          </Col>
          {/* </SafeArea> */}

        </CameraView>


      </View>
    </SafeArea>

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