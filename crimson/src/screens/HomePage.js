import React, { useContext } from "react";
import { InspectionsContext } from "../services/inspections/inspections.contex"


import { Searchbar as PaperSearchBar, Colors, IconButton, Menu, Button, Card } from 'react-native-paper';
import { ActivityIndicator, Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const [selectedOption, setSelectedOption] = React.useState('PENDING HM REVIEW');
  const [open, setOpen] = React.useState(false);

  const onChangeSearch = query => setSearchQuery(query);

  const filterInspections = inspections?.filter((ins) => ins?.Name.includes(searchQuery))

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Top */}
      <TopContainer>
        {/* Heading */}
        <Text style={{ fontSize: 24, color: "white", fontFamily: "URBAN_BOLD", marginBottom: 4 }}>Welcome!</Text>
        {/* Menu */}
        <Text style={{ fontSize: 18, color: "#94A1AC", fontFamily: "URBAN_MEDIUM" }} onPress={() => setOpen(!open)}>{selectedOption} {caretDown} </Text>
        <View style={{ backgroundColor: 'white', display: open ? 'flex' : 'none', margin: 8, maxWidth: 128 }}>
          <Menu.Item leadingIcon="redo" onPress={() => { }} title="Redo" />
          <Menu.Item leadingIcon="undo" onPress={() => { }} title="Undo" />
          <Menu.Item leadingIcon="content-cut" onPress={() => { }} title="Cut" />
        </View>
        {/* Searchbar */}
        <View style={{ backgroundColor: '#F1F4F8', justifyContent: "space-between", alignItems: 'center', flexDirection: 'row', padding: 12, marginVertical: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="search" color="grey" size={18} />
            <TextInput placeholder="Address, city, state.." style={{ fontFamily: "URBAN_BOLD", backgroundColor: "transparent", marginLeft: 16, fontSize: 18 }} />
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
            keyExtractor={(item) => item.Name}
            renderItem={(item) => (
              <ListViewCard data={item} />
            )}
          />
        }

      </BottomContainer>

    </SafeAreaView>
  )

}

function ListViewCard({ data }) {
  const navigation = useNavigation()
  let w = Dimensions.get('window').width - 12
  const inspectionData = data.item;

  return (
    <Card onPress={() => navigation.navigate('InspectionsDetail', { inspectionData })} style={{ display: 'flex', alignItems: "center", flexDirection: "row", borderRadius: 8, marginBottom: 16 }}>
      <View style={{ display: 'flex', alignItems: "center", flexDirection: "row", padding: 16 }}>
        <View>
          <Text style={{ color: 'black', fontFamily: 'URBAN_MEDIUM', fontSize: 18, marginBottom: 4 }}  >{data.item.Property_Address__c === '' ? 'Property Address NA' : data.item.Property_Address__c}</Text>
          <Text style={{ color: '#A6AFB9', fontFamily: 'URBAN_REGULAR', fontSize: 16, marginBottom: 2 }} >GC SUBMITTED BID : {data.item?.Repair_Estimator__r?.Name}</Text>
          <Text style={{ color: '#A6AFB9', fontFamily: 'URBAN_REGULAR', fontSize: 16, marginBottom: 2 }} >TARGET REHAB COMPLETE DATE : {data.item?.Target_Rehab_Complete_Date__c}</Text>
        </View>
       
      </View>
    </Card>
  )
}
