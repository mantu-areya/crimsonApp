import { View, Text, Platform } from 'react-native'
import React from 'react'
import styled from "styled-components/native"
import  Ionicons  from "react-native-vector-icons/Ionicons"
import * as Linking from "expo-linking";


const CallNow = ({isForReviewerView,data}) => {
    const {
        HHM_Field_PM__r,
        HHM_Field_PM_Email__c,
        GC_Email__c,
        General_Contractor__r,
        HHM_Field_PM_Phone__c,
    } = data;

const handleCall = (phNumber)=>{
  console.log("call",phNumber);
  return Platform.select({
    ios: () => {
        Linking.openURL(`telprompt:${phNumber}`);
    },
    android: () => {
        Linking.openURL(`tel:${phNumber}`);
    }
})();
}

    return (
        <Container>
            {/* Text */}
            <TextWrapper>
                {/* Name */}
                <Title>
                {!isForReviewerView ? HHM_Field_PM__r?.Name : `${General_Contractor__r?.Name} GC Contractor`}
                </Title>
                {/* Mobile No */}
                <SubTitle>
                    +12345678 
                    {/* // ! need field for mobile */}
                </SubTitle>
                {/* Mobile No */}
                <SubTitle>
                    {!isForReviewerView ? HHM_Field_PM_Email__c : GC_Email__c}
                </SubTitle>
            </TextWrapper>
            {/*  Button */}
            <CallButtonWrapper onPress={() => handleCall(HHM_Field_PM_Phone__c)}>
                <Ionicons name="call" color="white" size={18} />
                <CallButtonText >
                    Call Now
                </CallButtonText>
            </CallButtonWrapper>
        </Container>
    )
}

const Container = styled.View`
background-color: #1E2428;
padding: 16px;
position: absolute;
bottom: 0;
width: 100%;
flex-direction: row;
justify-content: space-between;
align-items: center;
z-index: 9999;
`;

const TextWrapper = styled.View``;

const Title = styled.Text`
color: white;
font-size: 20px;
margin-bottom: 4px;
font-family: 'URBAN_BOLD';
`;

const SubTitle = styled.Text`
font-size: 14px;
font-family: 'URBAN_BOLD';
color: #7A8791;
`;


const CallButtonWrapper = styled.TouchableOpacity`
flex-direction: row;
`;

const CallButtonText = styled.Text`
font-size: 18px;
font-family: 'URBAN_BOLD';
color: white;
margin-left: 8px;

`;



export default CallNow