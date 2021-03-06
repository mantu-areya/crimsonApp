import React, { useContext, useEffect, useState } from "react";
import { VendorFormsPage } from "../components/VendorFormsPage"
import { VendorFormContext } from "../../../services/context/VendorForm/vendorForm.contex"
import { getVendorFormDetails } from "../../../services/inspections/inspections.service"
import NetInfo from "@react-native-community/netinfo";
import { View, ScrollView, Pressable } from "react-native";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { TotalContainer, InfoTextArea, ActionContainer, HeaderCardCover, BackNavigator, HeaderCard, Body, CarousalScrren } from "../components/VendorFormPageStyles";
import { Row, Col } from 'react-native-responsive-grid-system';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Spacer } from "../../../components/spacer/spacer.component";
import { InspectionDetailTile } from "../components/InspectionDetailTile";
import { InspectionDetailsCard } from "../components/InspectionDetailsCard"
import { Text } from "../../../components/typography/text.component";
import { FormSections,FormSectionsContainer } from "./InspectionDetailScreenStyles"
import { WorkAuthFormPage } from "../components/WorkAuthFormPage";

export const InspectionDetailScreen = ({ route, navigation }) => {


  const [formName, setFormaName] = useState('VF')
  const { inspectionData } = route.params;
  const { vendorFormDetails, addToVfContex } = useContext(VendorFormContext);
  const setVendorFormData = async () => getVendorFormDetails(inspectionData.Id)
    .then(data => addToVfContex(data, inspectionData));

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      if (networkState.isConnected) {
        setVendorFormData();
      }
      return
    })
  }, []);


  return (
    <>
      <SafeArea>
        <ScrollView keyboardDismissMode={'on-drag'}>
          <HeaderCard  >
            <BackNavigator onPress={() => { navigation.goBack() }}>
              <Row>
                <Icon name="arrow-left" size={20} color="white" style={{ marginTop: 4 }} />
                <Text variant="NavigationText">Back</Text>
              </Row></BackNavigator>
            <View>
              <FormSections>
                <Row>
                  <FormSectionsContainer variant={formName=='VF'?"active":''} onPress={() => setFormaName('VF')}>
                    <Text variant={formName=='VF'?"DetailcardHeaderactive":"DetailcardHeader"}>Vendor Forms</Text>
                  </FormSectionsContainer>
                  <Spacer position="right" size="medium" />
                  <FormSectionsContainer variant={formName=='WF'?"active":''} onPress={() => setFormaName('WF')}>
                    <Text variant={formName=='WF'?"DetailcardHeaderactive":"DetailcardHeader"} >Work Auth Forms</Text>
                  </FormSectionsContainer>
                </Row>
              </FormSections>
              <Spacer position="bottom" size="medium" />
            </View>
            <View>
              <Row>
                <Text variant="InspectionHeaderName">{inspectionData.Name} | </Text>
                {formName == 'VF' ? <Text variant="InspectionHeaderName">VENDOR ESTIMATE FORM</Text>
                  : formName == 'WF' && <Text variant="InspectionHeaderName">WORK AUTH FORM</Text>}
              </Row>
              <Text variant="HeaderName">{inspectionData.Property_Address__c} </Text>
            </View>
            <Spacer position="top" size="large" />
            <InspectionDetailsCard inspectionData={inspectionData} />
            <Spacer position="bottom" size="medium" />
          </HeaderCard  >
          {formName == 'VF' && <VendorFormsPage inspectionData={inspectionData} navigation={navigation} />}
          {formName == 'WF' && <WorkAuthFormPage inspectionData={inspectionData} navigation={navigation} />}
        </ScrollView>
      </SafeArea>
    </>
  )

}