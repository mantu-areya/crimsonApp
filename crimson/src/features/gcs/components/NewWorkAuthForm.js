import { Image, Modal, Text, View } from 'react-native'
import React from 'react'
import { VendorFormContext } from '../../../services/context/VendorForm/vendorForm.contex'
import BidReviewSummaryCard from "./workAuth/BidReviewSummaryCard"
import { ApprovedItemsTable } from './workAuth/ApprovedItemsTable';
import SafeAreaView from 'react-native-safe-area-view';
import * as ImagePicker from "expo-image-picker";
import { Button as PaperButton } from "react-native-paper"
import Sign from './workAuth/Sign';




export default function NewWorkAuthForm({ inspectionData, navigation }) {
    let [general_Rental, setGeneral_Rental] = React.useState([])
    let [pools, setPools] = React.useState([])
    let [exterior, setExterior] = React.useState([])
    let [interior, setInterior] = React.useState([])
    let [mech_Elec_Plumb, setMech_Elec_Plumb] = React.useState([])
    let [grandTotal, setGrandTotal] = React.useState(0.00)
    let [isWorkAuthCreated, setIsWorkAuthCreated] = React.useState(false)
    let [approvedItemsData, setApprovedItemsData] = React.useState([])
    let [vendorFormData, setVendorFormData] = React.useState([])
    // const { vendorFormDetails, updateToSf } = React.useContext(VendorFormContext);
    const { vendorFormDetails, updateToSf, addSignature, contextImages } = React.useContext(VendorFormContext);

    const [selectedCategory, setSelectedCategory] = React.useState('')
    const [formNum, setFormNum] = React.useState('')
    const [bidReviewSummary, BidReviewSummary] = React.useState({ totalApproved_Amount: 0, approvedItemsCount: 0, grandTotal: 0, totalBidAmount: 0, approvedasNotedAmount: 0, approved_as_Noted_Count: 0, declinedAmount: 0, declined_Count: 0, approved_as_Noted_Count: 0 })

    const [img, setImg] = React.useState(null)

    const [modalVisible, setModalVisible] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false)

    const uploadImage = async () => {

        try {

            setIsLoading(true);



            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "Images",
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });

            result = result.base64

            if (result) {
                console.log(result, "kkk");
                // setImg(result);
                updateSignToContext(result)
                setIsLoading(true);
            }

        } catch (error) {

            setIsLoading(false);
            console.log(error);
            alert('Upload Error' + error)

        }

    }

    const GetDataByCategory = (inspData) => {
        let approvedItems = [];
        let category1 = [];
        let category2 = [];
        let category3 = [];
        let category4 = [];
        let category5 = [];
        let approvedTotal = 0
        let grandTtl = 0.00;
        let approved_Items_Count = 0;
        let totalBidAmount = 0;
        let approved_as_Noted_Count = 0;
        let approvedasNotedAmount = 0;
        let declined_Count = 0;
        let declinedAmount = 0;

        Object.keys(inspData).map(item => {
            if (inspData[item].Approval_Status === "Approved") {
                approvedTotal += inspData[item].Approved_Amount
                approved_Items_Count += 1
            }
            if (inspData[item].Category === "General Rental Operations Scope") {
                category1.push(inspData[item])
            } else if (inspData[item].Category === "Pools") {
                category2.push(inspData[item])

            } else if (inspData[item].Category === "Exterior") {
                category3.push(inspData[item])

            } else if (inspData[item].Category === "Interior") {
                category4.push(inspData[item])

            } else if (inspData[item].Category === "Mechanical, Electrical and Plumbing Systems") {
                category5.push(inspData[item])

            }
            if (inspData[item].Category !== "Room Measurements") {
                grandTtl = grandTtl + (inspData[item].Total)
            }
            if (inspData[item].Approval_Status === "Declined") {
                declinedAmount += inspData[item].Approved_Amount
                declined_Count += 1
            }
            if (inspData[item].Quantity > 0) {
                totalBidAmount += inspData[item].Total
            }
            if (inspData[item].Approval_Status === "Approved as Noted") {
                approvedasNotedAmount += inspData[item].Approved_Amount
                approved_as_Noted_Count += 1
            }

            if (inspData[item].Approval_Status === "Approved" || inspData[item].Approval_Status === "Approved as Noted") {
                approvedItems.push(inspData[item])
            }
        })
        setApprovedItemsData(approvedItems);
        setGeneral_Rental(category1);
        setPools(category2);
        setExterior(category3);
        setInterior(category4);
        setMech_Elec_Plumb(category5);
        setGrandTotal(grandTtl)
        setVendorFormData(inspData)
        BidReviewSummary({ ...bidReviewSummary, ["totalApproved_Amount"]: approvedTotal, ["approvedItemsCount"]: approved_Items_Count, ["grandTotal"]: grandTtl, ["totalBidAmount"]: totalBidAmount, ["approvedasNotedAmount"]: approvedasNotedAmount, ["approved_as_Noted_Count"]: approved_as_Noted_Count, ["declined_Count"]: declined_Count, ["declinedAmount"]: declinedAmount })
    }



    React.useEffect(() => {
        let contexRecord = vendorFormDetails[inspectionData.Id]
        if (contexRecord) {
            if (inspectionData.doCreateWAF__c) {
                setIsWorkAuthCreated(true)
                GetDataByCategory(contexRecord)
            }
            else {
            }
        }
    }, [vendorFormDetails]);


    const updateSignToContext = (image) => {
        addSignature(inspectionData.Id, image)
    }

    React.useEffect(() => {
        contextImages[inspectionData.Id] && contextImages[inspectionData.Id].map(ele => {
            if (ele.file_name == "Contractor signature.jpeg") {
                console.log(ele.file_public_url, "vfvfvfv");
                setImg(ele.file_public_url)
                return
            }
        })
    }, [contextImages])


    if (!isWorkAuthCreated) {
        return (
            <View>
                <Text style={{ fontSize: 18, color: 'white', fontFamily: 'SF_LIGHT' }}>
                    Work Auth form not created.
                </Text>
            </View>
        )
    }







    return (
        <SafeAreaView style={{ flex: 1 }}>

            <BidReviewSummaryCard bidReviewSummary={bidReviewSummary} />
            <ApprovedItemsTable approvedItems={approvedItemsData} />

            <View style={{ flexDirection: "row" }}>
                {/* Contractor Signature */}
                <View style={{ padding: 16, flex: .5 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'SF_BOLD', color: 'white' }}>Contractor Signature</Text>
                    {img &&
                        <View style={{ justifyContent: 'center', marginVertical: 8, padding: 4 }}>
                            <Image style={{
                                width: 80,
                                height: 80
                            }} source={{ uri: img }} />
                        </View>}
                    {img && <Text style={{ fontSize: 12 }}>Date : {new Date().toDateString()}</Text>}
                    {!img && <>
                        <PaperButton style={{
                            backgroundColor: 'black',
                            color: "white",
                            marginVertical: 2,
                            marginTop: 4,
                            width: 100,
                            fontSize: 28
                        }} mode="contained" onPress={() => setModalVisible(true)}>
                            Sign
                        </PaperButton>
                        <PaperButton style={{
                            backgroundColor: 'black',
                            color: "white",
                            marginVertical: 2,
                            width: 100,
                        }} loading={isLoading} mode="contained" onPress={uploadImage}>
                            Upload
                        </PaperButton>
                    </>}
                    {/* <Button title="Sign"  /> */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>

                        {/* <Sign onOK={(e) => {
                            setImg(e);
                            setModalVisible(!modalVisible);
                        }} text='Contractor Sign' /> */}

                        <Sign onOK={(e) => {
                            let bs64dataArray = e.split(',')
                            setImg(e);
                            setModalVisible(!modalVisible);
                            updateSignToContext(bs64dataArray[1])
                            setIsLoading(true);
                        }} text='Contractor Sign' />


                    </Modal>

                </View>
                {/* HHM Signature */}
                <View style={{ padding: 16, flex: .5, alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 12, fontFamily: 'SF_BOLD', color: 'white' }}>HHM Signature</Text>
                    {/* {img &&
                      <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginVertical: 8, padding: 4 }}>
                        <Image style={{
                          width: 80,
                          height: 80
                        }} source={{ uri: img }} />
                      </View>}
                    <Text style={{ fontSize: 12 }}>Date : {new Date().toDateString()}</Text> */}
                </View>
            </View>

        </SafeAreaView>
    )
}






