import React, { useContext } from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, SectionEnd } from "../components/ProcessRecordsInfoCardStyle";
// import { Text } from "../../../components/typography/text.component"
import { SvgXml } from "react-native-svg";
import SortSvg from "../../../assets/svg/Sort.js";
import FilterSvg from "../../../assets/svg/Filter.js";
import { InspectionsInfoCard } from "../components/InspectionsInfoCard"
import { InspectionsContext } from "../../../services/inspections/inspections.contex"


import {
  SearchContainer,
  CardList,
  BackNavigator,
  HeaderCard,
  Loading,
  LoadingContainer,
  ListContainer,
  AppBody,
  ActionsSection,
  HeaderCardBody,
  HeaderCardCover
} from './InspectionScreenStyles'

import { Searchbar as PaperSearchBar, Colors, IconButton } from 'react-native-paper';
import { ActivityIndicator, Dimensions, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
const backIcon = <Icon name="arrow-left" size={16} />;
const rightArr = <Icon name="angle-right" size={48} color="white" />;


const TopContainer = styled.View`

height: 25%;
background-color:#2B243E;
width: 100%;
border-bottom-left-radius:24px ;
border-bottom-right-radius:24px ;
position: relative;
padding: 16px;


`;

const BackNavigatorButton = styled.Text`
color:white;
font-size:18px;
font-weight:bold;
`;

const BottomContainer = styled.View`
padding: 8px 24px;
flex: 1;
width: 100%;
`;

export const InspectionsScreen = ({ navigation }) => {
  const { isLoading, inspections } = useContext(InspectionsContext);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  if (isLoading) {
    return <View style={{flex:1}}>
      <ActivityIndicator />
    </View>
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {/* Top */}
      <TopContainer>
        {/* Back Button */}
        <BackNavigatorButton onPress={() => navigation.goBack()}>
          {backIcon} Home
        </BackNavigatorButton>

        {/* Heading */}
        <Text style={{ width: "100%", marginTop: 40, textAlign: "center", color: "white", fontSize: 18, fontWeight: "bold" }}>All Inspections</Text>

        {/* Searchbar */}
        <PaperSearchBar onChangeText={onChangeSearch}
          value={searchQuery} style={{ borderRadius: 48, marginTop: 12 }} placeholder="Search inspections..." />

      </TopContainer>
      {/*  Bottom */}
      <BottomContainer>

        <CardList
          data={inspections !== null && inspections}
          keyExtractor={(item) => item.Name}
          renderItem={(item) => (
            <ListViewCard data={item} />
          )}
        />

      </BottomContainer>

    </SafeAreaView>
  )

}

function ListViewCard({ data }) {
  const navigation = useNavigation()
  let w = Dimensions.get('window').width - 48
  const inspectionData = data.item;
  let formatDateTime = (date) => {
    let DateArray = date.split('+')
    let FormatedDateTime = new Date(DateArray[0]).toLocaleDateString("en-US", {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    return FormatedDateTime
  }


  return (
    <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('InspectionsDetail', { inspectionData })}>
      <View style={{ alignItems: "center", flexDirection: "row", borderRadius: 8, width: w, marginBottom: 16, padding: 8, backgroundColor: "#6A579A" }}>
        <View style={{ flex: .8, }}>
          <Text style={{ color: 'white', fontFamily: 'SF_BOLD', fontSize: 18,marginBottom:4 }}  >{data.item.Property_Address__c === '' ? 'Property Address NA' : data.item.Property_Address__c}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 14 }} >Zip Code: {data.item.Property_Zip_Code__c}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 14 }} >Repair estimator : {data.item.Repair_Estimator_Email__c}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 14 }} >HHM FIELD PM : {data.item.HHM_Field_PM_Email__c}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 14 }} >Inspection Due Date: {data.item.GC_Inspection_Due_Date__c}</Text>

        </View>
        <TouchableOpacity style={{ flex: .2, justifyContent: "center", alignItems: "center" }}>
          {rightArr}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}