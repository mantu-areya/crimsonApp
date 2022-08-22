import React, { useEffect, useContext } from "react";
import { View, Pressable, ScrollView, TextInput, Platform } from "react-native";
import { CollapseSectionHeader, SectionHeaderEnd, SectionContainer, FormCard, CardHeader, CardBody } from "./VendorFormPageStyles"
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from "../../../components/typography/text.component";
import { Col, Row } from "react-native-responsive-grid-system";
import { TotalContainer, TextArea, NumberInput } from "./VendorFormPageStyles";
import ContentLoader, { Rect } from 'react-content-loader/native'
import styled from "styled-components/native";




export const WorkAuthBidReviewForm = ({ bidReviewSummary }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const handlePress = (setIsCollapsed, isCollapsed) => setIsCollapsed(!isCollapsed);
  const [length, setLength] = React.useState(false);
  const [approvedItemsData, setApprovedItemsData] = React.useState([]);



  const MyLoader = () => {
    const getRowLoader = (y) => {
      let height = Platform.isPad ? 30 : 15
      return (<>
        <ContentLoader interval="0.01" backgroundColor="#D3D3D3" style={{ height: height, flex: 1 }} viewBox="0 0 600 1">
          <Rect x="1" y="0" rx="3" ry="3" width="180" height="10" />
          <Rect x="200" y="0" rx="4" ry="4" width="60" height="10" />
          <Rect x="300" y="0" rx="3" ry="3" width="60" height="10" />
          <Rect x="400" y="0" rx="3" ry="3" width="60" height="10" />
          <Rect x="500" y="0" rx="3" ry="3" width="60" height="10" />
        </ContentLoader>

      </>
      )
    }
    return <>
      {getRowLoader()}
      {getRowLoader()}
      {getRowLoader()}
    </>
  }

  const displayRows = () => {
    let hhm_approved_amount = bidReviewSummary && (bidReviewSummary.totalApproved_Amount + bidReviewSummary.approvedasNotedAmount)
    let variance = (hhm_approved_amount - bidReviewSummary.totalBidAmount)
    let percentVariance = variance / bidReviewSummary.totalBidAmount * 100
    let totalcount = bidReviewSummary && bidReviewSummary.approvedItemsCount + bidReviewSummary.approved_as_Noted_Count + bidReviewSummary.declined_Count
    let total$ = bidReviewSummary.totalApproved_Amount + bidReviewSummary.declinedAmount + bidReviewSummary.approvedasNotedAmount
    let approvedAmntPercent = bidReviewSummary && ((bidReviewSummary.totalApproved_Amount / bidReviewSummary.totalBidAmount) * 100)
    let approvedAsNotedAmntPercent = bidReviewSummary && ((bidReviewSummary.approvedasNotedAmount / bidReviewSummary.totalBidAmount) * 100)
    let declinedAmntPercent = parseFloat(bidReviewSummary && ((bidReviewSummary.declinedAmount / bidReviewSummary.totalBidAmount) * 100))
    let totalPercent = approvedAmntPercent + approvedAsNotedAmntPercent + declinedAmntPercent
    return (
      <>
        <Row >
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">CONTRACTOR BID SUBMITTED AMOUNT</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${bidReviewSummary  && bidReviewSummary.totalBidAmount.toLocaleString("en-US")}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">APPROVED</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{bidReviewSummary && bidReviewSummary.approvedItemsCount}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${bidReviewSummary && bidReviewSummary.totalApproved_Amount.toLocaleString("en-US",)}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{(approvedAmntPercent > 0  ? approvedAmntPercent:0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% </Text>
          </Col>
        </Row>
        <Row >
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">HHM APPROVED AMOUNT</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${bidReviewSummary && (hhm_approved_amount).toLocaleString("en-US")}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">APPROVED AS NOTED</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{bidReviewSummary && bidReviewSummary.approved_as_Noted_Count}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${bidReviewSummary && bidReviewSummary.approvedasNotedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{(approvedAsNotedAmntPercent > 0 ? approvedAsNotedAmntPercent:0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
          </Col>
        </Row>
        <Row >
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">$ VARIANCE</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${(variance == 0 ?0: variance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">DECLINED</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{bidReviewSummary && bidReviewSummary.declined_Count}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${bidReviewSummary && bidReviewSummary.declinedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{((declinedAmntPercent==0|| isNaN(declinedAmntPercent))?0:declinedAmntPercent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
          </Col>
        </Row>
        <Row >
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">% VARIANCE</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{((percentVariance==0 || isNaN(percentVariance))  ?0:percentVariance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">TOTAL</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{totalcount && totalcount}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">${total$ && total$.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          </Col>
          <Col xs="2" md="2" style={{ textAlign: "center" }}>
            <Text variant="body">{(totalPercent > 0 ? totalPercent:0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</Text>
          </Col>
        </Row>

      </>
    )
  }

  return (
    <>
      <SectionContainer>
        <FormCard>
          <CardHeader>
            <Row >
              <Col xs="2" md="2">
                <Text variant="formHeader">SCOPE</Text>
              </Col>
              <Col xs="2" md="2">
                <Text variant="formHeader"  >QTY</Text>
              </Col>
              <Col xs="2" md="2">
                <Text variant="formHeader" >STATUS</Text>
              </Col>
              <Col xs="2" md="2">
                <Text variant="formHeader" >COUNT SUBMITTED</Text>
              </Col>
              <Col xs="2" md="2">
                <Text variant="formHeader" >$</Text>
              </Col>
              <Col xs="2" md="2">
                <Text variant="formHeader" >% OF CONTRACTOR BID AMT</Text>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {
              // approvedItemsData.length <1 ?
              //   MyLoader()
              //   :
              displayRows()
            }
            <Row>
              <Col >
                {/* <Text>${GetToalSqFt().toLocaleString("en-US")}</Text> */}
              </Col>
            </Row>
          </CardBody>
        </FormCard>
      </SectionContainer>
    </>
  )
}