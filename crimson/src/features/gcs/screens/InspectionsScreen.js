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
import { ActivityIndicator, Dimensions, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
const backIcon = <Icon name="arrow-left" size={16} />;
const rightArr = <Icon name="angle-right" size={48} color="white" />;


const TopContainer = styled.View`

height: 180px;
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

  const filterInspections = inspections?.filter((ins) => ins?.Name.includes(searchQuery))

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

        {isLoading ?
          <View style={{ padding: 16 }}>
            <ActivityIndicator />
          </View> :
          <CardList
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
  let w = Dimensions.get('window').width - 48
  const inspectionData = data.item;

  return (
    <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('InspectionsDetail', { inspectionData })}>
      <View style={{ alignItems: "center", flexDirection: "row", borderRadius: 8, width: w, marginBottom: 16, padding: 8, backgroundColor: "#6A579A" }}>
        <View style={{ width: "80%" }}>
          <Text style={{ color: 'white', fontFamily: 'SF_BOLD', fontSize: 14, marginBottom: 4 }}  >{data.item.Property_Address__c === '' ? 'Property Address NA' : data.item.Property_Address__c}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 12, marginBottom: 2 }} >Repair estimator : {data.item?.Repair_Estimator__r?.Name}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 12, marginBottom: 2 }} >HHM Field PM : {data.item.HHM_Field_PM__r.Name}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 12, marginBottom: 2 }} >Inspection Due Date: {data.item.GC_Inspection_Due_Date__c}</Text>
          <Text style={{ color: 'white', fontFamily: 'SF_LIGHT', fontSize: 12, marginBottom: 2 }} >Bid Recommendation: {data.item.HHM_Bid_Recommendation__c && `$${data.item.HHM_Bid_Recommendation__c}`}</Text>

        </View>
        <View >
          <TouchableOpacity onPress={() => navigation.navigate('InspectionsDetail', { inspectionData })} style={{ justifyContent: "center", alignItems: "center" }}>
            {rightArr}
          </TouchableOpacity>
          <Text style={{ marginTop: 16, color: 'white', fontFamily: 'SF_LIGHT', fontSize: 10 }} >
            {data.item.Name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}