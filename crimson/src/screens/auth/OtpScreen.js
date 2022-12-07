import { Text, View ,Button} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator } from 'react-native-paper'
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import OTPTextInput from 'react-native-otp-textinput'
import { verifyOtp } from '../../services/authentication/authentication.service';


export const OtpScreen = ({ navigation, route }) => {
  const otpInput = useRef(null);
  const [otp, setOtp] = useState('')
  const { onOtpVerified } = useContext(AuthenticationContext);
  const [otpError, setOtpError] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearText = () => {
    otpInput.current.clear();
    setOtpError(null)
  }

  const verifyText = () => {
    const otpData = {
      "userName": route.params["userName"] && route.params["userName"],
      "OTP": otp && Number(otp)
    }
    setIsSubmitting(true);
    verifyOtp(otpData).then(Response => {
      console.log("OTP :", Response.data);
      onOtpVerified(Response.data.userdata)
      setIsSubmitting(false);
    }).catch(error => {
      console.log("OTP EROR", error.response.data);
      setOtpError("Invalid OTP")
      setIsSubmitting(false);
    })
  }

  useEffect(() => {
  }, [otpError])

  return (
    <Wrapper>
      {
        isSubmitting ? 
        <>
        <View style={{padding:16}}>
          <ActivityIndicator />
        </View>
        </>
          :
          <>
            <Text style={{ color: 'red' }}>{otpError && otpError}</Text>
            <OTPTextInput
              handleTextChange={(text) => setOtp(text)}
              textInputStyle={{ color: "white" }}
              inputCount={5}  
              ref={e => (otpInput.current = e)} />
            <InputWrapper>
            {console.log(otp,"otp")}
              <Button disabled = {otp.length <5} contentStyle={{color:"red"}} title="verify" onPress={() => verifyText()}   >Verify</Button>
              <Button title="clear" onPress={() => clearText()} ><Text>Clear</Text></Button>
            </InputWrapper></>
      }
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