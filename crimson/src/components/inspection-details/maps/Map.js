import React, { useContext, useState, useEffect, useRef } from "react";
import MapView, { Marker,PROVIDER_GOOGLE } from "react-native-maps";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform } from "react-native";

const StyledMapView = Platform.OS === "ios" ? styled(MapView)`
height: 360px;
width: 98%;
border-radius: 16px;
`: styled(MapView).attrs({
  provider: PROVIDER_GOOGLE
})`
  height: 360px;
  width: 98%;
  border-radius: 16px;
`;

export const Map = ({ inspections }) => {

    const { Property_Latitude__c, Property_Longitude__c } = inspections;

    console.log({ Property_Latitude__c, Property_Longitude__c });




    return (
        <>
            <StyledMapView
                region={{
                    latitude: Property_Latitude__c,
                    longitude: Property_Longitude__c,
                    latitudeDelta: .01,
                    longitudeDelta: .01,
                }}
            >
                <Marker

                    coordinate={{
                        latitude: Property_Latitude__c,
                        longitude: Property_Longitude__c,

                    }}
                >
                </Marker>
            </StyledMapView>
        </>
    );
};