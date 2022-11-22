import 'react-native-get-random-values';
import { View, Text, FlatList, TextInput } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native';
import Ionicons from "react-native-vector-icons/Ionicons"
import { ActivityIndicator, Avatar } from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat'
import { getInspectionsChat, postInspectionsChat } from '../services/inspections/inspections.service';
import { v4 as uuidv4 } from 'uuid';
import { InspectionsContext } from '../services/inspections/inspections.contex';

const Chat = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = React.useState([]);
    const { userId, userRole } = React.useContext(InspectionsContext);

    const { inspId } = route.params;


    async function InspectionsChat() {
        if (inspId) {
            const allChats = await getInspectionsChat(inspId);
            // console.log("Chats", allChats);
            const temp = allChats.reverse().map(({ actor, body, createdDate }) => {
                    console.log(actor);
                return {
                    _id: uuidv4(),
                    text: body.text,
                    user: {
                        _id: actor.id,
                        name: actor.displayName,
                        avatar: actor.photo.smallPhotoUrl,
                    },
                    isSenderText: actor.id === userId // ! NEED TO ADD AUTH HERE
                }
            });
            setMessages(temp)
        }
    }


    React.useEffect(() => {

            let refreshIntervalId = setInterval(() => {
                console.log("CHAT REFRESH");
                InspectionsChat();
            }, 5000);

        return () => {
            clearInterval(refreshIntervalId);
            console.log("CHAT REFRESH STOPPED");
        }
    }, [])


    React.useEffect(() => {
        InspectionsChat();
    }, [inspId])


    const [currentMsg, setCurrentMessage] = React.useState("");
    const [sending, setSending] = React.useState(false);

    const handleSendMessage = async () => {
        setSending(true);
        const res = await postInspectionsChat(inspId, currentMsg);
        if (res.status === 201) {
            setCurrentMessage("");
            setSending(false);
            InspectionsChat();
        }
    }

    return (
        <View style={{ paddingTop: insets.top, flex: 1 }}>
            <ToolBar>
                {/* back */}
                <Ionicons onPress={() => navigation.goBack()} name="arrow-back" color="white" size={24} />
                {/* Person Name */}
                <ToolBarHeading>Tim Repair_Estimator__r</ToolBarHeading>
            </ToolBar>
            {/* Chat Container */}
            <ChatContainer>

                <FlatList data={messages} keyExtractor={item => item._id} renderItem={({ item }) => <Message item={item} />} />

            </ChatContainer>

            <ChatInputWrapper>
                <ChatInput value={currentMsg} onChangeText={text => setCurrentMessage(text)} placeholder="Type Message Here" />
                {
                    sending ?
                        <ActivityIndicator animating={true} color={"black"} />
                        :
                        <Ionicons onPress={handleSendMessage} name="send" color="black" size={24} />
                }
            </ChatInputWrapper>

        </View>
    )
}

function Message({ item }) {
    return (
        <MessageWrapper isSender={item.isSenderText} >
            <Avatar.Text size={24} label={item.user.name} />
            <MessageTextWrapper isSender={item.isSenderText}>
                <MessageText isSender={item.isSenderText}>{item.text}</MessageText>
            </MessageTextWrapper>
        </MessageWrapper>
    )
}

const ToolBar = styled.View`
background-color: black;
padding: 16px;
flex-direction: row;
align-items:center;
`;

const ToolBarHeading = styled.Text`
font-size:18px;
font-family: 'URBAN_MEDIUM';
color: white;
margin-left: 16px;
`;

const ChatContainer = styled.View`
padding: 16px;
/* flex: 1; */
`;

const MessageWrapper = styled.View`
border-radius: 8px;
flex-direction: ${props => props.isSender ? "row-reverse" : "row"};
margin: 4px 0;
margin-left:  ${props => props.isSender ? "auto" : "0"};
`;

const MessageTextWrapper = styled.View`
background-color: ${props => props.isSender ? "white" : "#4B39EF"};
padding: 12px;
border-radius: 8px;
max-width: 320px;
`;

const MessageText = styled.Text`
color: ${props => props.isSender ? "black" : "white"};
font-family: 'URBAN_BOLD';
`;


const ChatInputWrapper = styled.View`
background-color: white;
flex-direction: row;
border-radius:50px;
align-items: center;
justify-content: space-between;
padding:16px 24px;
position: absolute;
bottom: 36px;
left: 0;
width: 100%;
`;
const ChatInput = styled.TextInput`
font-size:18px;
flex: .8;
font-family: 'URBAN_BOLD';
`;

export default Chat