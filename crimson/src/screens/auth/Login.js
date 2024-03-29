import { View, Text, TextInput, Image, Platform } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"
import KeyboardSpacer from 'react-native-keyboard-spacer';


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

  const [error, setError] = React.useState(null)


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
        <View style={{justifyContent: 'center',alignItems: 'center',marginVertical:8}}>
          <Image style={{ width: 128, height: 128, borderRadius: 100 }} source={require("../../../assets/icon.png")} />
        </View>
        {/* Email */}
        <Text style={{ paddingHorizontal: 16, marginBottom: 4, color: 'white', fontSize: 16, fontFamily: 'URBAN_BOLD' }}>Username</Text>
        <InputWrapper
        >
          <TextInput
            style={{
              color: 'white',
              fontSize: 16,
              padding: 16,
              width: "100%",
              flex: .9,
              fontFamily: 'URBAN_BOLD'
            }}
            onChangeText={userName => setEmail(userName)}
            value={userName}
            placeholderTextColor={"#7E8892"}
            placeholder="Enter your username here"
            autoCorrect={false}
          />
          <Ionicons style={{ flex: .1 }} onPress={() => handleLogin(userName)} size={36} color="#E45679" name="arrow-forward-circle" />
        </InputWrapper>

        {error && (
          <Spacer size="large">
            <Text style={{ color: 'red' }}>{error}</Text>
          </Spacer>
        )}
      </FormWrapper>
      {Platform.OS == 'ios' && <KeyboardSpacer/>} 
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
padding: 6px 0;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
border-width: 1px;
border-radius: 8px;
border-color: #14181B;
`
