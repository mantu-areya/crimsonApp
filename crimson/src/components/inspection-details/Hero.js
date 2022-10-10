import { View, Text, ImageBackground, Image } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import Ionicons from "react-native-vector-icons/Ionicons"


import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from '@react-navigation/native';

const image = { uri: 'https://reactjs.org/logo-og.png' };

const Hero = () => {
    const visibility = NavigationBar.useVisibility()

    const navigation = useNavigation()

    console.log({ visibility });

    return (
        <Container>
            {/* Image Background */}
            <ImageBackgroundWrapper>

                <Image source={image} style={{ width: '100%', height: 320, borderRadius: 16 }} />

                <InsideContentWrapper>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* Back Icon */}
                        <GoBackButton handleGoBack={() => navigation.goBack()} />
                        {/* Meta Info */}
                        <MetaInfo />
                    </View>
                    {/* Short Summary */}
                    <ShortSummary />
                </InsideContentWrapper>

            </ImageBackgroundWrapper>
            {/* Description */}
            <DescriptionWrapper>
                <Text style={{ color: 'black', fontFamily: 'URBAN_BOLD', fontSize: 16 }}>DESCRIPTION</Text>
                <DescriptionText style={{marginTop: 14}}>
                    2137 Janett Ln, Willingmington, WV 24921 is a 3 Bed Room Property with 4 Baths and 2400 Sq Ft. Built in 2022 this property is a New Construction.
                </DescriptionText>
                <DescriptionText style={{marginTop: 16}}>
                    Inspection Schedule Date - 15.02.2022
                </DescriptionText>
                <DescriptionText>
                    Target Rehab Complete Date - 20.02.2023
                </DescriptionText>
            </DescriptionWrapper>
        </Container>
    )
}


function GoBackButton({ handleGoBack }) {
    return (
        <BackButtonWrapper onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={32} color="white" />
        </BackButtonWrapper>
    )
}

function MetaInfo({ }) {
    return (
        <MetaInfoWrapper>
            <MetaInfoText>Pending GC Inspection</MetaInfoText>
            <MetaInfoText>7 days pending</MetaInfoText>
            <Ionicons style={{ marginTop: 16 }} name="cloud-download" size={32} color="white" />
        </MetaInfoWrapper>
    )
}

function ShortSummary({ }) {
    return (
        <ShortSummaryWrapper>
            {/* Address */}
            <ShortSummaryAddress>
                2137 Janett Ln
            </ShortSummaryAddress>
            {/* Bed | Bath | Sq Feet */}
            <BedBathSqftText>
                3 BEDS | 4 BATHS | 2400 SQFT
            </BedBathSqftText>
        </ShortSummaryWrapper>
    )
}


const Container = styled.View`
padding:32px;
background-color:white;
width: 100%;
`;

const ImageBackgroundWrapper = styled.TouchableOpacity`

`;

const InsideContentWrapper = styled.View`
/* background-color:red; */
position: absolute;
padding: 16px;
width: 100%;
`;

const BackButtonWrapper = styled.TouchableOpacity`
width: 48px;
height: 48px;
justify-content: center;
align-items: center;
background-color: #171C1F;
border-radius: 8px;
`

const MetaInfoWrapper = styled.View`
align-items: flex-end;
margin-top: 8px;
`;

const MetaInfoText = styled.Text`
font-size: 16px;
font-family: 'URBAN_REGULAR';
color: white;
`

const ShortSummaryWrapper = styled.View`
margin-top: 150px;
align-items: flex-end;
`;

const ShortSummaryAddress = styled.Text`
font-size: 24px;
color: white;
font-family: 'URBAN_REGULAR';
`;

const BedBathSqftText = styled.Text`
font-size:12px;
color: #84919B;

`;


const DescriptionWrapper = styled.View`

padding: 16px 16px 0;

`

const DescriptionText = styled.Text`

color: #96A1AC;

font-family: 'URBAN_BOLD';
font-size: 16px;

`


export default Hero