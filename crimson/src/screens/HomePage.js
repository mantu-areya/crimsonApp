import React, { useContext } from "react";
import { InspectionsContext } from "../services/inspections/inspections.contex"


import { Searchbar as PaperSearchBar, Colors, IconButton, Menu, Button, Card } from 'react-native-paper';
import { ActivityIndicator, Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const backIcon = <Icon name="arrow-left" size={16} />;
const rightArr = <Icon name="angle-right" size={48} color="white" />;
const caretDown = <Icon name="caret-down" size={16} color="white" />;


const TopContainer = styled.View`
background-color:#14181B;
width: 100%;
position: relative;
padding: 24px 16px 12px;
`;


const BottomContainer = styled.View`
padding: 12px;
flex: 1;
width: 100%;
background-color: #F1F4F8;
`;

export const HomePage = ({ navigation }) => {
  const { isLoading, inspections } = useContext(InspectionsContext);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState('Inspection/Rehab Bid Queue (Pending Vendor Submission)');
  const [open, setOpen] = React.useState(false);

  const onChangeSearch = query => {
    setSearchQuery(query);
  }
  const filterInspections = inspections?.filter((ins) => ins?.Name.toLowerCase().includes(searchQuery.toLowerCase()) || ins?.Property_Address__c.toLowerCase().includes(searchQuery.toLowerCase()) || ins?.Property_City__c?.toLowerCase()?.includes(searchQuery.toLowerCase()));

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'black' }}>
      {/* Top */}
      <TopContainer>
        {/* Heading */}
        <Text style={{ fontSize: 24, color: "white", fontFamily: "URBAN_BOLD", marginBottom: 4 }}>Welcome!</Text>
        {/* Menu */}
        <Text style={{ fontSize: 18, color: "#94A1AC", fontFamily: "URBAN_MEDIUM" }} onPress={() => setOpen(!open)}>{selectedOption} {caretDown} </Text>
        <View style={{borderRadius:8, backgroundColor: 'white', display: open ? 'flex' : 'none',marginTop:8,padding:16,width:"100%" }}>
          {
            [
              "Inspection/Rehab Bid Queue (Pending Vendor Submission)",
              "Inspection/Rehab Upcoming Preconstruction Look Ahead",
              // "Turn Bid Queue (Pending Vendor Submission)",
              // "Turn WAF Queue"
            ].map((option, index) =>
              <Text key={index} style={{padding:4,fontSize:18, fontFamily: 'URBAN_MEDIUM',width:"100%" }} onPress={() => { setSelectedOption(option); setOpen(false) }} >
                {option}
              </Text>
            )
          }
        </View>
        {/* Searchbar */}
        <View style={{ backgroundColor: '#F1F4F8', justifyContent: "space-between", alignItems: 'center', flexDirection: 'row', padding: 12, marginVertical: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="search" color="grey" size={18} />
            <TextInput onChangeText={onChangeSearch} placeholder="Address, city, state.." style={{ fontFamily: "URBAN_BOLD", backgroundColor: "transparent", marginLeft: 16, fontSize: 18 }} />
          </View>
          <Button labelStyle={{ fontFamily: "URBAN_BOLD" }} style={{ backgroundColor: "#4B39EF", padding: 8 }} mode="contained">Search</Button>
        </View>

      </TopContainer>
      {/*  Bottom */}
      <BottomContainer>

        {isLoading ?
          <View style={{ padding: 16 }}>
            <ActivityIndicator />
          </View> :
          <FlatList
            data={filterInspections ?? []}
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
