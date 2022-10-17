import { View, Text } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { TextInput, Button } from 'react-native-paper'
import { AuthContext } from '../../contexts/AuthContext'


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
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const { handleLogin } = React.useContext(AuthContext);


    return (
        <Wrapper style={{ paddingTop: insets.top }}>
            <FormWrapper style={[shadowStyle]}>
                {/* Title */}
                <Title>
                    CRIMSON
                </Title>
                {/* Sub Title */}
                <SubTitle>
                    Welcome Back,
                </SubTitle>
                {/* Email */}
                <StyledTextInput
                    label="Email"
                    placeholder="Enter Your Email"
                    placeholderColor="#E1EDF9"
                    value={email}
                    mode="outlined"
                    outlineColor="#E1EDF9"
                    activeOutlineColor="#4B39EF"
                    right={<TextInput.Icon color="#96A1AC" icon={"email"} />}
                    onChangeText={email => setEmail(email)}
                />
                {/* Password */}
                <StyledTextInput
                    label="Password"
                    placeholder="Enter Your Password"
                    placeholderColor="#E1EDF9"
                    value={password}
                    mode="outlined"
                    secureTextEntry={showPassword}
                    outlineColor="#E1EDF9"
                    activeOutlineColor="#4B39EF"
                    right={<TextInput.Icon color="#96A1AC" onPress={() => setShowPassword(!showPassword)} icon={showPassword ? "eye" : "eye-off"} />}
                    onChangeText={password => setPassword(password)}
                />
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', marginVertical: 16}}>
                    {/* Forgot Password */}
                    <ForgotPasswordLink>Forgot Password?</ForgotPasswordLink>
                    {/* Login Button */}
                    <StyledLoginButton
                        onPress={() => {
                            handleLogin();
                            navigation.navigate("Home");
                        }}
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
padding: 16px;
`;

const FormWrapper = styled.View`
width: 100%;
padding: 48px 32px;
border-radius: 8px;
background-color: #fff;
`;


const Title = styled.Text`
font-size: 32px;
font-family: URBAN_BOLD;
color: #96A1AC;
margin-bottom: 24px;
`;

const SubTitle = styled.Text`
font-size: 24px;
font-family: URBAN_BOLD;
margin-bottom: 12px;
`;

const StyledTextInput = styled(TextInput)`
margin: 8px 0;
font-family: URBAN_MEDIUM;
border-radius: 8px;
`;

const ForgotPasswordLink = styled.Text`
font-size: 16px;
font-family: URBAN_BOLD;
`;

const StyledLoginButton = styled(Button)`
padding: 8px;
background-color: #4B39EF;
`;