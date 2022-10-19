import React from 'react'
import styled from 'styled-components/native'
import Ionicons from "react-native-vector-icons/Ionicons"


const CTA = ({ handleOnSubmit, handleOnChat }) => {
    const shadowStyle = {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
    return (
        <Wrapper>
            <SubmitButtonWrapper style={shadowStyle} onPress={handleOnSubmit}>
                <ButtonText color="white">
                    Submit for Review
                </ButtonText>
            </SubmitButtonWrapper>
            <ChatButtonWrapper style={shadowStyle} onPress={handleOnChat}>
                <Ionicons name="chatbubbles-sharp" size={24} color="black" />
                <ButtonText marginLeft={8} >
                    Chat
                </ButtonText>
            </ChatButtonWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.View`
flex-direction: row;
`

const SubmitButtonWrapper = styled.TouchableOpacity`
background-color:#8477EB;
padding: 8px 16px;
flex: 1;
`;

const ChatButtonWrapper = styled.TouchableOpacity`
background-color: #E2F1DE;
flex: 1;
padding: 8px 16px;
flex-direction: row;
justify-content: center;
align-items: center;

`;

const ButtonText = styled.Text`
font-size:18px;
font-family: 'URBAN_BOLD';
text-transform: uppercase;
color: ${props => props.color || 'black'};
margin-left: ${props => `${props.marginLeft || 0}px`} ;
`;



export default CTA