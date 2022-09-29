import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from "react";
import { getVendorFormDetails } from "../../../../services/inspections/inspections.service";
import { ActivityIndicator } from "react-native-paper";





export default function BidReviewSummaryCard({ inspId }) {
    const [isOpen, setIsOpen] = React.useState(true) // keep open in start
    const handleCollapseToggle = () => {
        setIsOpen(!isOpen);
    }

    const [summary, setSummary] = React.useState()


    const getBidReviewSummary = async () => {
        try {


            const res = await getVendorFormDetails(inspId)
            setSummary(res.BidReviewSummary)

        } catch (error) {
            console.log(error);

        }
    }


    React.useEffect(() => {
        getBidReviewSummary();
    }, [inspId])

    /* 
     "BidReviewSummary": {
         "% Variance Percentage": "$-0.882205915395320563845407565198762",
         "$ Variance": "$-20260.00",
         "totalApprovedItems": "10",
         "countApprovedasNoted": "0",
         "countApproved": "10",
         "countSubmitted": "12",
         "totalBidApproved": "$2,705.16",
         "totalBidSubmitted": "$22,965.16"
     }
    */



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
                    {
                        !summary ?
                            <View>
                                <ActivityIndicator />
                            </View> : <>
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
                                            <TabelRowItemValue  >{summary?.totalBidSubmitted}</TabelRowItemValue>
                                        </View>
                                        <View style={{ width: '25%' }}>
                                            <TableRowItemHeading style={{ textAlign: 'center' }} >$ Variance</TableRowItemHeading>
                                        </View>
                                        <View style={{ width: '25%' }}>
                                            <TabelRowItemValue   >{summary['$ Variance']}</TabelRowItemValue>
                                        </View>
                                    </TableRowWrapper>
                                    <TableRowWrapper style={{ flexDirection: 'row' }}>
                                        <View style={{ width: '25%' }}>
                                            <TableRowItemHeading >HHM Approved Amount</TableRowItemHeading>
                                        </View>
                                        <View style={{ width: '25%' }}>
                                            <TabelRowItemValue   >{summary?.totalBidApproved}</TabelRowItemValue>
                                        </View>
                                        <View style={{ width: '25%' }}>
                                            <TableRowItemHeading style={{ textAlign: 'center' }} >% Variance</TableRowItemHeading>
                                        </View>
                                        <View style={{ width: '25%' }}>
                                            <TabelRowItemValue >{summary['% Variance Percentage']}%</TabelRowItemValue>
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
                                            { title: 'Approved' },
                                            { title: 'Approved as Noted' },
                                            { title: 'Decline' },
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
                                        <TabelRowItemValue >{summary?.totalApprovedItems}</TabelRowItemValue>
                                    </View>
                                    <View style={{ width: '25%' }}>
                                        <TabelRowItemValue >${0}</TabelRowItemValue>
                                    </View>
                                    <View style={{ width: '25%' }}>
                                        <TabelRowItemValue >{0}%</TabelRowItemValue>
                                    </View>
                                </TableHeader>
                            </>
                    }
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




/* 



*/