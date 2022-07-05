import React, { useContext, useEffect, useState } from "react";
import { Button, Searchbar, Alert } from "react-native-paper";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components";
import { StyleSheet, FlatList, View, StatusBar, Image, ScrollView, ImageBackground } from 'react-native';
import { ProcessRecordsInfoCard } from "../components/ProcessRecordsInfoCard"
import { Spacer } from "../../../components/spacer/spacer.component";
import { SectionLabel } from "./HomeScreenStyles"
import { FontAwesome5 } from '@expo/vector-icons';
import { Row, SectionEnd } from "../components/ProcessRecordsInfoCardStyle";
import { Text } from "../../../components/typography/text.component"
import { Card } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import ProfilePicture from "react-native-profile-picture"
import { QuickActionsList } from "../components/QuickActionsList"
import {InspectionsContext} from "../../../services/inspections/inspections.contex"
import {getInspectionsData} from "../../../services/inspections/inspections.service";
import NetInfo from "@react-native-community/netinfo";


const SearchContainer = styled(Searchbar)`
  margin-top:${(props) => props.theme.space[4]};
  height:40px;
`;

const CardList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 10,
  },
})``;

const ShowMoreView = styled(View)`
    flex:1;
    padding-right:10px;
    justify-content: center;
`;

const HeaderCard = styled(View)`

height:300px;
border-radius:55px;
backgroundImage: linear-gradient(to right, rgba(0, 224, 255, 1), rgba(0, 133, 255, 1))
border-bottom-left-radius: 28px;
border-bottom-right-radius: 28px;
`;

const HeaderCardCover = styled(ImageBackground)`
  flex:1
`;

const SectionHeader = styled.Text`
  font-size:${(props) => props.theme.fontSizes.h4};
  color:${(props) => props.theme.colors.text.inverse};
  font-weight:${(props) => props.theme.fontWeights.large};
`;

const HeaderCardBody = styled.View`
  margin:${(props) => props.theme.space[3]};
  margin-top:${(props) => props.theme.space[5]};
`;

const ScrolableView = styled(ScrollView)`

`;


const showMoreIcon = () => {
  return (<>
    <ShowMoreView>
      <FontAwesome5 name="arrow-circle-right" size={40} color="black" />
      <Text variant="CarContentList">Show All</Text>
    </ShowMoreView>
  </>
  )
}

const CircleBg = styled(Image)`
flex:1;
opacity: 0.3;
`;

const SectionStart = styled.View`

`;




const AppBody = styled.View`
    flex:1;
    background-color:${(props) => props.theme.colors.bg.primary};
`;



export const HomeScreen = ({ navigation }) => {
  const { isLoading,pendingInspection,isOnline,changeState } = useContext(InspectionsContext);
  const [newState,setNewState]= useState(null)
  const [online,setonline] = useState(isOnline)
  // useEffect(()=>{

  //   getInspectionsData();

  // },[])






const recheckStatus=()=>{
  changeState()
  setNewState(!newState);
  console.log("chking");
  setonline(isOnline.isConnected)
}

useEffect(()=>{
 navigation.addListener('focus', () => 
 NetInfo.fetch().then(networkState => {
  return setonline(networkState.isConnected)
  
})
 )
},[navigation])



  return (
    <>
      <AppBody >
        <ScrolableView
          verticle
        >
          <HeaderCard  >
            <HeaderCardCover
            imageStyle={{borderBottomLeftRadius: 30,borderBottomRightRadius: 30}}
              source={require("../../../assets/images/Background.png")}
            >
              <SafeArea>
                <HeaderCardBody>
                  <Row>
                    <SectionStart>
                      <SectionHeader >
                        Home
                      </SectionHeader>
                    </SectionStart>
                    <SectionEnd>
                      <ProfilePicture
                        width={35}
                        height={35}
                        isPicture={true}
                        requirePicture={require("../../../assets/images/ProfilePic.png")}
                        shape='rounded'
                      />
                    </SectionEnd>
                  </Row>
                  <Spacer position="top" size="large">
                  <Text variant="SectionLabel">
                    You have 3 Inspections Pending
                  </Text>
                  </Spacer>

                  <SearchContainer style={{ borderRadius: 15 }} placeholder="Search" />
                </HeaderCardBody>


              </SafeArea>
            </HeaderCardCover>
                {(isOnline==false||online==false)&&<Button onPress={()=>recheckStatus()}>click</Button>}
          </HeaderCard>
          <QuickActionsList  navigation = { navigation }/>
          <Spacer position="top" size="medium">
            <SectionLabel>
              <Text> Pending Inspections </Text>
            </SectionLabel>
          </Spacer>
          <Row>            
            <CardList
              horizontal
              data={ pendingInspection && pendingInspection.records}
              ListFooterComponent={showMoreIcon}
              keyExtractor={(item) => item.Name}
              renderItem={(item,i) => (
                <>
                  <Spacer position="right" size="large">
                    <ProcessRecordsInfoCard data={ item.item} />
                  </Spacer>
                  {item.index == item.lenght && <FontAwesome5 name="arrow-circle-right" size={24} color="black" />}
                </>
              )}
            />
          </Row>
        </ScrolableView>
      </AppBody>

    </>
  )

}