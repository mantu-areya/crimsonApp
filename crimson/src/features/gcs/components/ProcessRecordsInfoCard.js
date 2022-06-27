import React from "react";
import { SvgXml } from "react-native-svg";
import star from "../../../../assets/star";
// import open from "../../../../assets/open";
// import { Spacer } from "../../../components/spacer/spacer.component";
import { Text, } from "../../../components/typography/text.component";
import { TouchableOpacity, View } from "react-native"

import {
  InspectionCard,
  Info,
  Section,
  SectionEnd,
  Icon,
  Address,
  SectionBottom,
  Row,
  ImageCardBody,
} from "./ProcessRecordsInfoCardStyle";
export const ProcessRecordsInfoCard = ({ data = {} }) => {
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

  return (
    <InspectionCard > 
               <TouchableOpacity >

          <ImageCardBody 
          borderRadius={10}

        
          source={require("../../../assets/images/House1.png")}>

      <SectionBottom>
      <Text variant="CardID">{data.Name}</Text> 
      </SectionBottom>
      </ImageCardBody>

       </TouchableOpacity>


    </InspectionCard>
  );
};
