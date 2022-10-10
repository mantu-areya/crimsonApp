import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context"
import CallNow from '../components/inspection-details/CallNow'

const InspectionDetails = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>InspectionDetails</Text>
      {/* Hero */}
      {/* CTA's */}
      {/* Forms */}
      {/* Call Now */}
      <CallNow />
    </SafeAreaView>
  )
}



export default InspectionDetails