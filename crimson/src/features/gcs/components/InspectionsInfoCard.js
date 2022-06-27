import React from "react";
// import open from "../../../../assets/open";
// import { Spacer } from "../../../components/spacer/spacer.component";
import { Text, } from "../../../components/typography/text.component";
import { TouchableOpacity, View } from "react-native"
import { Spacer } from "../../../components/spacer/spacer.component";

import {
  InspectionCard,
  Info,
  Section,
  SectionEnd,
  Row,
  CardBody,
  InspectionListCard,
} from "./ProcessRecordsInfoCardStyle";
export const InspectionsInfoCard = ({ data = {}, navigation }) => {
  // const {
  //   name = "Some Restaurant",
  //   photos = [
  //     "https://pixabay.com/images/id-2483336/",
  //   ],
  //   icon = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png",
  //   address = "100 some random street",
  //   isOpenNow = true,
  //   rating = 4,
  //   isClosedTemporarily = true,
  // } = restaurant;

  // const ratingArray = Array.from(new Array(Math.floor(rating)));
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
  const inspectionData = data.item;


  return (
    <TouchableOpacity onPress={() => navigation.navigate('InspectionsDetail',{inspectionData})}>

      <InspectionListCard >

        <CardBody start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 0 }} colors={["#F4F4F4", "#e3dfdf00"]} >
          <Row>
            <Text variant="CarContentHeader">{data.item.Property_Address__c}</Text>
          </Row>
          <Row>
            <Text variant="CarContentList">HHM Inspection : {data.item.Name}</Text>
            <Spacer position="right" size="large"></Spacer>
            <Text variant="CarContentList">Stage : {data.item.Inspection_Stage__c}</Text>
            <Spacer position="right" size="large"></Spacer>
            <Text variant="CarContentList">HHM Bid Recommendation : {data.item.HHM_Bid_Recommendation__c? data.item.HHM_Bid_Recommendation__c : 'NA'}</Text>

          </Row>
          <Row>
            <Text variant="CarContentList">Created Date : {formatDateTime(data.item.CreatedDate)}</Text>

            <Spacer position="right" size="large"></Spacer>
            <Text variant="CarContentList">General Contractor : {data.item.General_Contractor__c ? data.item.General_Contractor__c : "NA"}</Text>

          </Row>
          <SectionEnd>
            <Text variant="CarContentList">Tap to open</Text>
          </SectionEnd>
        </CardBody>



      </InspectionListCard>
    </TouchableOpacity>

  );
};
