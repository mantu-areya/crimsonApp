import React from 'react'
import styled from 'styled-components/native'
import Ionicons from "react-native-vector-icons/Ionicons"
import { Platform } from 'react-native'


const CTA = ({ formStatus = "Vendor Form Completed", handleOnSubmit, role, handleOnChat, handleViewImages, handleSignature, isSubmitted }) => {
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
            {
                !isSubmitted &&
                <>
                    {
                        role === "Contractor"
                        &&
                        ((formStatus === "Vendor Form Completed")
                            ?
                            <SubmitButtonWrapper  style={[shadowStyle, {
                                backgroundColor: "grey"
                            }]} >
                                <ButtonText style={{ textAlign: 'center' }} color="white">
                                    Submitted
                                </ButtonText>
                            </SubmitButtonWrapper>
                            :
                            <SubmitButtonWrapper style={shadowStyle} onPress={handleOnSubmit}>
                                <ButtonText style={{ textAlign: 'center', fontSize:16 }} color="white">
                                    Submit for Review
                                </ButtonText>
                            </SubmitButtonWrapper>)
                    }
                    {
                        role === "Reviewer"
                        &&
                        ((formStatus === "Reviewer Form Completed")
                            ?
                            <SubmitButtonWrapper style={[shadowStyle, {
                                backgroundColor: "grey"
                            }]} >
                                <ButtonText style={{ textAlign: 'center', }} color="white">
                                    Submitted
                                </ButtonText>
                            </SubmitButtonWrapper>
                            :
                            <SubmitButtonWrapper style={shadowStyle} onPress={handleOnSubmit}>
                                <ButtonText style={{ textAlign: 'center', fontSize:16  }} color="white">
                                    Submit for Approval
                                </ButtonText>
                            </SubmitButtonWrapper>)
                    }
                    {/* Chat */}
                    <ChatButtonWrapper style={shadowStyle} onPress={handleOnChat}>
                        <Ionicons name="chatbubbles-sharp" size={24} color="black" />
                        <ButtonText marginLeft={8} >
                            Chat
                        </ButtonText>
                    </ChatButtonWrapper>
                </>


            }
            {
                isSubmitted && <>
                    <SubmitButtonWrapper style={shadowStyle} onPress={handleSignature}>
                        <ButtonText style={{ textAlign: 'center' }} color="white">
                            Sign
                        </ButtonText>
                    </SubmitButtonWrapper>
                    <ChatButtonWrapper style={shadowStyle} onPress={handleViewImages}>
                        <Ionicons name="list" size={24} color="black" />
                        <ButtonText marginLeft={8} >
                            View Images
                        </ButtonText>
                    </ChatButtonWrapper>
                </>
            }
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
justify-content:center;
align-items:center;
`;

const ChatButtonWrapper = styled.TouchableOpacity`
background-color: #E2F1DE;
flex: 1;
padding: ${Platform.OS === "android" ? 4 : 8}px ${Platform.OS === "android" ? 9 : 16}px;
flex-direction: row;
justify-content: center;
align-items: center;

`;

const ButtonText = styled.Text`
font-size:${Platform.OS === "android" ? 16 : 18}px;
font-family: 'URBAN_BOLD';
text-transform: uppercase;
color: ${props => props.color || 'black'};
margin-left: ${props => `${props.marginLeft || 0}px`} ;
`;



export default CTA