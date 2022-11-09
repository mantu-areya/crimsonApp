import { Text } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { Button } from 'react-native-paper'
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import OTPTextInput from 'react-native-otp-textinput'
import { verifyOtp } from '../../services/api/authentication/auth.services'


export const OtpScreen = ({ navigation }) => {
  const otpInput = useRef(null);
  const [otp, setOtp] = useState(null)
  const { fBLoginData, onOtpVerified } = useContext(AuthenticationContext);
  const [otpError, setOtpError] = useState(null)

  const clearText = () => {
    otpInput.current.clear();
    setOtpError(null)
  }

  const verifyText = () => {
    const otpData = {
      "EmailId": fBLoginData && fBLoginData.user.email,
      "OTP": otp && Number(otp)
    }
    verifyOtp(otpData).then(Response => {
      onOtpVerified(Response.data.access_token)
    }).catch(error => {
      console.log(JSON.stringify(error));
      setOtpError("invalid Otp")
    })
  }

  useEffect(() => {
  }, [otpError])

  return (
    <Wrapper>
      <Text style={{ color: 'red' }}>{otpError && otpError}</Text>
      <OTPTextInput
        handleTextChange={(text) => setOtp(text)}
        textInputStyle={{ color: "white" }}
        inputCount={5}
        ref={e => (otpInput.current = e)} />
      <InputWrapper>
        <Button title="verify" onPress={() => verifyText()}  ><Text>Verify</Text></Button>
        <Button title="clear" onPress={() => clearText()} ><Text>Clear</Text></Button>
      </InputWrapper>
    </Wrapper>
  )
}



const Wrapper = styled.View`
flex:1;
justify-content: center;
align-items: center;
padding: 16px 8px;
background-color: #000;
`;

const FormWrapper = styled.View`
width: 100%;
padding: 48px 8px;
border-radius: 8px;
background-color: #000;
`;


const Title = styled.Text`
font-size: 32px;
font-family: URBAN_BOLD;
color: #96A1AC;
margin-bottom: 64px;
color: white;
text-align: center;
`;

const InputWrapper = styled.View`
width: 80%;
flex-direction: row;
padding: 24px;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;


`


const ForgotPasswordLink = styled.Text`
font-size: 18px;
font-family: URBAN_BOLD;
color: white;
`;

const StyledLoginButton = styled(Button)`
padding: 12px 24px;
border-radius: 16px;
background-color: #E45679;
`;