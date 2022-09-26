import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from "react";
import { Col, Row } from "react-native-responsive-grid-system";





export default function BidReviewSummaryCard({ bidReviewSummary }) {
    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }

    let hhm_approved_amount = bidReviewSummary && Number(bidReviewSummary.totalApproved_Amount + bidReviewSummary.approvedasNotedAmount)
        let variance = Number(hhm_approved_amount - bidReviewSummary.totalBidAmount)
        let percentVariance = variance > 0 ? variance / bidReviewSummary?.totalBidAmount * 100 : 0
        let totalcount = bidReviewSummary && bidReviewSummary.approvedItemsCount + bidReviewSummary.approved_as_Noted_Count + bidReviewSummary.declined_Count
        let total$ = bidReviewSummary.totalApproved_Amount + bidReviewSummary.declinedAmount + bidReviewSummary.approvedasNotedAmount
        let approvedAmntPercent = bidReviewSummary && ((bidReviewSummary.totalApproved_Amount / bidReviewSummary.totalBidAmount) * 100)
        let approvedAsNotedAmntPercent = bidReviewSummary && ((bidReviewSummary.approvedasNotedAmount / bidReviewSummary.totalBidAmount) * 100)
        let declinedAmntPercent = parseFloat(bidReviewSummary && ((bidReviewSummary.declinedAmount / bidReviewSummary.totalBidAmount) * 100))
        let totalPercent = (approvedAmntPercent + approvedAsNotedAmntPercent + declinedAmntPercent)



    return (
        <Wrapper>
            {/* Header */}
            <View flexDirection="row" alignItems="center" justifyContent="space-between">
                <Heading>Bid Review Summary</Heading>
                <TouchableOpacity onPress={handleCollapseToggle}>
                    <Icon name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} color="white" size={36} />
                </TouchableOpacity>
            </View>
            {/* Body */}
            {isOpen &&
                <BodyWrapper>
                    {/* Section 1 */}
                    <View>
                        {/* Table Header */}
                        <TableHeader>
                            <View style={{ width: '25%' }}>
                                <TableSectionHeadings >Scope</TableSectionHeadings>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TableSectionHeadings style={{ textAlign: 'center' }}  >Amount</TableSectionHeadings>
                            </View>
                        </TableHeader>
                        <TableRowWrapper style={{ flexDirection: 'row' }}>
                            <View style={{ width: '25%' }}>
                                <TableRowItemHeading>Contractor Bid Submitted Amount</TableRowItemHeading>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TabelRowItemValue  >${bidReviewSummary?.totalBidAmount.toFixed(2)}</TabelRowItemValue>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TableRowItemHeading style={{ textAlign: 'center' }} >$ Variance</TableRowItemHeading>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TabelRowItemValue   >${variance?.toFixed(2)}</TabelRowItemValue>
                            </View>
                        </TableRowWrapper>
                        <TableRowWrapper style={{ flexDirection: 'row' }}>
                            <View style={{ width: '25%' }}>
                                <TableRowItemHeading >HHM Approved Amount</TableRowItemHeading>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TabelRowItemValue   >${hhm_approved_amount?.toFixed(2)}</TabelRowItemValue>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TableRowItemHeading style={{ textAlign: 'center' }} >% Variance</TableRowItemHeading>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TabelRowItemValue >{percentVariance?.toFixed(2)}%</TabelRowItemValue>
                            </View>
                        </TableRowWrapper>
                    </View>
                    {/* Section 2 */}
                    <View style={{}}>
                        {/* Table Header */}
                        <TableHeader>
                            <View style={{ width: '25%' }}>
                                <TableSectionHeadings >Status</TableSectionHeadings>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TableSectionHeadings style={{ textAlign: 'center' }}  >Count Submitted</TableSectionHeadings>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TableSectionHeadings style={{ textAlign: 'center' }}  >$</TableSectionHeadings>
                            </View>
                            <View style={{ width: '25%' }}>
                                <TableSectionHeadings style={{ textAlign: 'center' }}  >% of Contractor Bid Amt</TableSectionHeadings>
                            </View>
                        </TableHeader>
                        {
                            [
                                {title: 'Approved'},
                                {title: 'Approved as Noted'},
                                {title: 'Decline'},
                            ].map((item, i) =>
                                <TableRowWrapper key={i} style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '25%' }}>
                                        <TableRowItemHeading >{item.title}</TableRowItemHeading>
                                    </View>
                                    <View style={{ width: '25%' }}>
                                        <TabelRowItemValue >000.00</TabelRowItemValue>
                                    </View>
                                    <View style={{ width: '25%' }}>
                                        <TabelRowItemValue >000.00</TabelRowItemValue>
                                    </View>
                                    <View style={{ width: '25%' }}>
                                        <TabelRowItemValue >000.00</TabelRowItemValue>
                                    </View>
                                </TableRowWrapper>)
                        }
                    </View>
                    {/* Total */}
                    {/* Table Header */}
                    <TableHeader>
                        <View style={{ width: '25%' }}>
                            <TableSectionHeadings >Total</TableSectionHeadings>
                        </View>
                        <View style={{ width: '25%' }}>
                            <TabelRowItemValue >{totalcount}</TabelRowItemValue>
                        </View>
                        <View style={{ width: '25%' }}>
                            <TabelRowItemValue >${total$?.toFixed(2)}</TabelRowItemValue>
                        </View>
                        <View style={{ width: '25%' }}>
                            <TabelRowItemValue >{isNaN(totalPercent) ? `0.00` : totalPercent.toFixed(2)}%</TabelRowItemValue>
                        </View>
                    </TableHeader>
                </BodyWrapper>
            }
        </Wrapper>
    )
}

const Wrapper = styled.View`
background-color: #6A579A;
padding:16px;
border-radius: 8px;
margin: 16px 0;
`

const Heading = styled.Text`
color: white;
font-size: 16px;
font-family: SF_BOLD;
`;

const BodyWrapper = styled.View`
background-color: #B5A8D7;
padding:8px;
border-radius:4px;
`
const TableHeader = styled.View`
flex-direction: row;
background-color:#D3C7EF;
align-items: center;
padding: 8px;
border-radius:4px;
`

const TableRowWrapper = styled.View`
padding: 8px;
`

const TableSectionHeadings = styled.Text`
font-size: 12px;
font-family: SF_BOLD;
`

const TableRowItemHeading = styled.Text`
font-family: SF_LIGHT;
`

const TabelRowItemValue = styled.Text`
text-align: center;
font-size: 12px;
`