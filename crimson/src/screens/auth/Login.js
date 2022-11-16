import { View, Text, TextInput } from 'react-native'
import React, { useContext, useEffect } from 'react'
import styled from 'styled-components/native'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, IconButton } from 'react-native-paper'
// import { AuthenticationContext } from "../../services/authentication/authentication.context";
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Spacer } from '../../components/spacer/spacer.component';
import { sendOtp } from "../../services/authentication/authentication.service"

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,

  elevation: 3,
}

const Login = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const [userName, setEmail] = React.useState("");
  // const [password, setPassword] = React.useState("");
  // const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null)

  // const { onLogin, error,fBLoginData,otpSent } = useContext(AuthenticationContext);

  const handleLogin = (userName) => {
    let data = {
      userName: userName
    }
    data && sendOtp(data).then(data => {
      setError(null)
      data == "OTP Send" && navigation.navigate("OtpScreen", { userName })
    }).catch(error => {
      setError(JSON.parse(error.request._response)[0].message)
    })
  }


  return (
    <Wrapper style={{ paddingTop: insets.top }}>
      <FormWrapper style={[shadowStyle]}>
        {/* Title */}
        <Title>
          CRIMSON
        </Title>
        {/* Email */}
        <Text style={{ paddingHorizontal: 16, marginBottom: 4, color: 'white', fontSize: 16, fontFamily: 'URBAN_BOLD' }}>Email Address</Text>
        <InputWrapper
        >
          <TextInput
            style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'URBAN_BOLD'
            }}
            onChangeText={userName => setEmail(userName)}
            value={userName}
            placeholderTextColor={"#7E8892"}
            placeholder="Enter your userName here"
          />
        </InputWrapper>

        {/* Passowrd */}
        {/* <Text style={{ paddingHorizontal: 16, marginBottom: 4, color: 'white', fontSize: 16, fontFamily: 'URBAN_BOLD' }}>Password</Text> */}
        {/* <InputWrapper>
                    <TextInput
                        style={{
                            color: 'white',
                            fontSize: 16,
                            fontFamily: 'URBAN_BOLD'
                        }}
                        value={password}
                        onChangeText={password => setPassword(password)}
                        secureTextEntry={showPassword}
                        placeholderTextColor={"#7E8892"}
                        placeholder="Enter your Password here"
                    />
                    <MaterialCommunityIcons size={24} onPress={() => setShowPassword(!showPassword)} name={showPassword ? "eye" : "eye-off"} color="#7E8892" />
                </InputWrapper> */}
        {error && (
          <Spacer size="large">
            <Text style={{ color: 'red' }}>{error}</Text>
          </Spacer>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
          {/* Forgot Password */}
          {/* <ForgotPasswordLink>Forgot Password?</ForgotPasswordLink> */}
          {/* Login Button */}
          <StyledLoginButton
            onPress={() => handleLogin(userName)}
            labelStyle={{
              fontFamily: 'URBAN_BOLD',
              fontSize: 18
            }} mode="contained">
            Login
          </StyledLoginButton>
        </View>
      </FormWrapper>
    </Wrapper>
  )
}

export default Login


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
width: 100%;
flex-direction: row;
padding: 24px;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
border-width: 1px;
border-radius: 8px;
border-color: #14181B;


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