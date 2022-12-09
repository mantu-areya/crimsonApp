import React, { useContext } from "react";
import { InspectionsContext } from "../services/inspections/inspections.contex"
import { compareAsc, differenceInDays } from 'date-fns'

import { Searchbar as PaperSearchBar, Colors, IconButton, Menu, Button, Card, Provider, Avatar } from 'react-native-paper';
import { ActivityIndicator, Dimensions, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const backIcon = <Icon name="arrow-left" size={16} />;
const rightArr = <Icon name="angle-right" size={48} color="white" />;
const caretDown = <Icon name="caret-down" size={16} color="white" />;
import { AuthenticationContext } from "../services/authentication/authentication.context";

import { useIsFocused } from '@react-navigation/native';

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
  const { isLoading, inspections, reloadInspectionContext, userRole } = useContext(InspectionsContext);
  const [searchQuery, setSearchQuery] = React.useState('');



  const allInspectionsTypes = [
    userRole === "Contractor" ? "Pending Vendor Submission" : "Pending Review",
    userRole === "Contractor" ? "Pending Review" : "Approval Submitted",
    "WA Generated",
    "Upcoming Preconstruction",
    "Next 7days Projected Rehab Complete Date"
  ];

  // ! For GC's ONLY
  const pendingInspectionsForGC = inspections?.filter(insp => insp.Inspection_Stage__c === "Bid Reviewer Assigned" && insp.Inspection_Form_Stage__c !== "Vendor Form Completed")
  // ! For Contractor's ONLY
  const pendingInspectionsForReviewer = inspections?.filter(insp => insp.Inspection_Stage__c === "Bid Reviewer Assigned" && insp.Inspection_Form_Stage__c === "Vendor Form Completed")
  const pendingSubmittedForApprovalByContractor = inspections?.filter(insp => insp.Inspection_Stage__c === "Inspection Complete" && insp.Inspection_Form_Stage__c === "Reviewer Form Completed")
  // ! for BOTH
  const waGenerated = inspections?.filter(insp => insp.Inspection_Stage__c === "Work Authorization Form Created")



  let TODAY = new Date().toISOString().split("T")[0];

  const upcomingPreconstruction = inspections?.filter(insp => {
    let isValidRehabStage = insp?.Initial_Rehab_Operating_Stage__c === "2 - Pre-Construction";
    let isPreConDateValid = false;
    if (insp?.Initial_Rehab_ID__r?.Pre_Con_Meeting_Date__c) {
      isPreConDateValid = compareAsc(new Date(insp.Initial_Rehab_ID__r.Pre_Con_Meeting_Date__c), new Date(TODAY)) === 0 || compareAsc(new Date(insp.Initial_Rehab_ID__r.Pre_Con_Meeting_Date__c), new Date(TODAY)) === 1;
    }
    if (isValidRehabStage && isPreConDateValid && insp?.General_Contractor__c) {
      return insp;
    }
  })
  const next7DaysProjectedRehab = inspections?.filter(insp => {
    let isValidRehabStage = insp?.Initial_Rehab_Operating_Stage__c === "3 - Under Rehab";
    let isPreConDateEqualToToday = false;
    if (insp?.Initial_Rehab_ID__r?.Pre_Con_Meeting_Date__c) {
      isPreConDateEqualToToday = compareAsc(new Date(insp.Initial_Rehab_ID__r.Pre_Con_Meeting_Date__c), new Date(TODAY)) === 0;
    }
    let isValidProjectRehabDate = false;
    if (insp?.Initial_Rehab_ID__r?.Projected_Rehab_Complete_Date__c ) {
      isValidProjectRehabDate = differenceInDays(new Date(insp?.Initial_Rehab_ID__r?.Projected_Rehab_Complete_Date__c), new Date(TODAY)) >= 7
    }
    if (isValidRehabStage && (isPreConDateEqualToToday || isValidProjectRehabDate)) {
      return insp;
    }
  })

  const [selectedOption, setSelectedOption] = React.useState(allInspectionsTypes[0]);
  const [currentSelectedInspections, setCurrentSelectedInspections] = React.useState(userRole === "Contractor" ? pendingInspectionsForGC : pendingInspectionsForReviewer)


  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "WA Generated") {
      setCurrentSelectedInspections(waGenerated)
    }
    if (option === "Pending Review") {
      setCurrentSelectedInspections(pendingInspectionsForReviewer)
    }
    if (option === "Approval Submitted") {
      setCurrentSelectedInspections(pendingSubmittedForApprovalByContractor)
    }
    if (option === "Pending Vendor Submission") {
      setCurrentSelectedInspections(pendingInspectionsForGC)
    }
    if (option === "Upcoming Preconstruction") {
      setCurrentSelectedInspections(upcomingPreconstruction);
    }
    if (option === "Next 7days Projected Rehab Complete Date") {
      setCurrentSelectedInspections(next7DaysProjectedRehab);
    }
  }






  const onChangeSearch = query => {
    setSearchQuery(query);
  }
  const filterInspections = currentSelectedInspections?.filter((ins) => ins?.Name.toLowerCase().includes(searchQuery.toLowerCase()) || ins?.Property_Address__c.toLowerCase().includes(searchQuery.toLowerCase()) || ins?.Property_City__c?.toLowerCase()?.includes(searchQuery.toLowerCase()));

  const insets = useSafeAreaInsets();

  const { onLogout } = React.useContext(AuthenticationContext);

  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showInspectionsMenu, setShowInspectionsMenu] = React.useState(false);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      console.log("GETTING LATEST INSPECTION");
      reloadInspectionContext();
    }
  }, [isFocused])


  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'black' }}>
      {/* Top */}
      <TopContainer>
        {/* Heading */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 24, color: "white", fontFamily: "URBAN_BOLD", marginBottom: 4 }}>Welcome!</Text>
          <Menu
            visible={showUserMenu}
            onDismiss={() => setShowUserMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => setShowUserMenu(true)}>
                <Avatar.Image size={36} source={require('../assets/images/ProfilePic.png')} />
              </TouchableOpacity>}>
            <Menu.Item onPress={() => setShowUserMenu(false)} title="Profile" />
            <Menu.Item onPress={() => {
              setShowUserMenu(false)
              onLogout();
            }} title="Logout" />
          </Menu>
        </View>
        {/* Menu */}
        <Menu
          visible={showInspectionsMenu}
          onDismiss={() => setShowInspectionsMenu(false)}
          anchor={
            <Text style={{ fontSize: 18, color: "#94A1AC", fontFamily: "URBAN_MEDIUM" }} onPress={() => setShowInspectionsMenu(true)}>{selectedOption} {caretDown} </Text>
          }
        >
          {
            allInspectionsTypes.map((option, index) =>
              <Menu.Item key={index} onPress={() => { handleOptionSelect(option); setShowInspectionsMenu(false) }} title={option} />
            )
          }
        </Menu>
        {/* Searchbar */}
        <View style={{ backgroundColor: '#F1F4F8', justifyContent: "space-between", alignItems: 'center', flexDirection: 'row', padding: 8, marginVertical: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: .9 }}>
            <Icon name="search" color="grey" size={18} />
            <TextInput value={searchQuery} onChangeText={onChangeSearch} placeholder="Address, city, state.." style={{ fontFamily: "URBAN_BOLD", backgroundColor: "transparent", fontSize: 18, padding: 16, width: "100%" }} />
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
