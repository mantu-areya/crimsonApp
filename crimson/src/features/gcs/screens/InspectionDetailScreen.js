import React from "react";

import { VendorFormsPage } from "../components/VendorFormsPage"



export const InspectionDetailScreen = ({ route }) => {
  const { inspectionData } = route.params;


  return (
    <>
 
<VendorFormsPage inspectionData={inspectionData} /> 
    </>
  )

}