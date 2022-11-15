import React, { useContext, useState, useEffect,useRef } from "react";
import MapView,{Marker} from "react-native-maps";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button,Platform } from "react-native";
import * as Linking from 'expo-linking';

const Map = styled(MapView)`
  height: 200px;
  width: 98%;
`;

export const MapScreen = ({ navigation,inspections }) => {
const [mocklocations,setMockLocations] = useState(null)
  const [latDelta, setLatDelta] = useState(0);
  const mapRef = useRef();

  console.log(mocklocations &&  mocklocations['antwerp']);
  const { Property_Latitude__c, Property_Longitude__c } = inspections;


  const handleGetDirections = () => {
    const data = {

      destination: {
        latitude: Property_Latitude__c,
        longitude: Property_Longitude__c
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
    }

    Platform.select({
      ios: () => {
             Linking.openURL('http://maps.apple.com/maps?daddr='+Property_Latitude__c+','+Property_Longitude__c+'&dirflg=d&t=m');
      },
      android: () => {
          Linking.openURL('http://maps.google.com/maps?daddr=' +Property_Latitude__c+ ',' +Property_Longitude__c);
      }
  })();
  }

  return (
    <>
    {/* {console.log(mocklocations.Property_Latitude__c)} */}
      <Map
              region={{
                latitude: Property_Latitude__c,
                longitude: Property_Longitude__c,
                latitudeDelta: 5,
                longitudeDelta: 5,
              }}
      >
            <Marker

               coordinate={{
                latitude:Property_Latitude__c,
                longitude:Property_Longitude__c,

               }}
            >
            </Marker>
      </Map>
      <Button onPress={()=>handleGetDirections()} title="Get Directions" />
    </>
  );
};
