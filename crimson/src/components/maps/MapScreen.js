import React, { useContext, useState, useEffect,useRef } from "react";
import MapView,{Marker} from "react-native-maps";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';

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
    </>
  );
};
