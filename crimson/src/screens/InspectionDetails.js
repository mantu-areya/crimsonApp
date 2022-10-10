import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'
import Hero from '../components/inspection-details/Hero'
import CTA from '../components/inspection-details/CTA'

const InspectionDetails = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Hero */}
      <Hero />
      {/* CTA's */}
      <CTA handleOnChat={() => alert("Chat")} handleOnSubmit={() => alert("Submit")} />
      {/* Forms */}
      {/* Call Now */}
      <CallNow />
    </SafeAreaView>
  )
}



export default InspectionDetails