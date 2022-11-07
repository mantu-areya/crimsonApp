import React, { useContext } from "react";
import { InspectionsContext } from "../services/inspections/inspections.contex"


import { Card } from 'react-native-paper';
import { ActivityIndicator, Dimensions, FlatList, Text, View } from "react-native";
import styled from "styled-components/native";

import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { differenceInDays } from 'date-fns'


const TopContainer = styled.View`
background-color:#14181B;
width: 100%;
position: relative;
padding: 24px 0 0;
`;


const BottomContainer = styled.View`
padding: 12px;
flex: 1;
width: 100%;
background-color: #F1F4F8;
`;


const TabMenuItemWrapper = styled.TouchableOpacity`
flex: 1;
border-bottom-width: ${props => props.isActive ? "5px" : 0} ;
border-bottom-color: #3AD2C0;
padding-bottom:16px;
`;

const TabMenuItemLabel = styled.Text`
font-family: 'URBAN_BOLD';
font-size: 18px;
text-align: center;
color: ${props => props.isActive ? "#3AD2C0" : "#94A1AC"} ;
`;

export default function Schedule({ navigation }) {
  const { isLoading, inspections } = useContext(InspectionsContext);
  const [currentSection, setCurrentSection] = React.useState("Upcoming");

  const completedInspections = inspections.filter((item) => item?.doCreateWAF__c); // TODO UPDATE LOGIC FOR COMPLETED
  const upcomingInspections = inspections.filter((item) => {
    return differenceInDays(new Date(item.GC_Inspection_Due_Date__c), new Date()) >= 2;
  })



  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'black' }}>
      {/* Top */}
      <TopContainer>
        {/* Heading */}
        <Text style={{ fontSize: 24, paddingLeft: 16, color: "white", fontFamily: "URBAN_BOLD", marginBottom: 4 }}>SCHEDULE</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {
            ["Upcoming", "Completed"].map((item, i) =>
              <TabMenuItemWrapper
                onPress={() => setCurrentSection(item)}
                isActive={currentSection === item}
                key={i}>
                <TabMenuItemLabel isActive={currentSection === item}>
                  {item}
                </TabMenuItemLabel>
              </TabMenuItemWrapper>
            )
          }
        </View>
      </TopContainer>
      {/*  Bottom */}
      <BottomContainer>

        {isLoading ?
          <View style={{ padding: 16 }}>
            <ActivityIndicator />
          </View> :
          <FlatList
            data={currentSection === "Upcoming" ? upcomingInspections : completedInspections}
            keyExtractor={(item) => item.Id}
            renderItem={({ item }) => (
              <ListViewCard data={item} />
            )}
          />
        }

      </BottomContainer>

    </View>
  )

}

function ListViewCard({ data }) {
  const navigation = useNavigation()
  let w = Dimensions.get('window').width - 12
  const inspectionData = data

  return (
    <Card onPress={() => navigation.navigate('InspectionsDetail', { inspectionData })} style={{ display: 'flex', alignItems: "center", flexDirection: "row", borderRadius: 8, marginBottom: 16 }}>
      <View style={{ display: 'flex', alignItems: "center", flexDirection: "row", padding: 16 }}>
        <View>
          <Text style={{ color: 'black', fontFamily: 'URBAN_MEDIUM', fontSize: 18, marginBottom: 4 }}  >{data?.Property_Address__c === '' ? 'Property Address NA' : data?.Property_Address__c}</Text>
          <Text style={{ color: '#A6AFB9', fontFamily: 'URBAN_REGULAR', fontSize: 16, marginBottom: 2 }} >GC SUBMITTED BID : {data?.Amount_Submitted_GC__c?.toLocaleString("en-IN", { style: "currency", currency: 'USD' })}</Text>
          <Text style={{ color: '#A6AFB9', fontFamily: 'URBAN_REGULAR', fontSize: 16, marginBottom: 2 }} >TARGET REHAB COMPLETE DATE : {data?.Target_Rehab_Complete_Date__c}</Text>
        </View>

      </View>
    </Card>
  )
}
