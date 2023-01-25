import { View, Text, Button, ActivityIndicator, Dimensions, Platform, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { useCallback } from 'react'
import styled from 'styled-components/native';
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Menu, Portal, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo'
import NetInfo from "@react-native-community/netinfo";
import { deleteLineItem, getCoForms, submitForApproval } from '../../services/co-forms/co-api';
import { CoFormContext } from '../../services/co-forms/co-context';
import Swipeable from 'react-native-swipeable';
import Animated, { interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import ComposedGestureWrapper from '../animated/ComposedGestureWrapper';
import CostCategory from '../../constants/ cost-category';
import { showMessage } from "react-native-flash-message";

import { useSafeAreaInsets } from 'react-native-safe-area-context'


const CoForms = ({ isForReviewerView, isSubmitted, readOnly, inspectionData, navigation }) => {

    const {
        isDataLoading,
        coForms,
        getAllCoForms,
        updateCoFormContext,
        updateCoLineItemToSf,
        initRehabId,
        addNewLineItem
    }
        = React.useContext(CoFormContext);


    const [currentForm, setCurrentForm] = React.useState(0);
    const [dataList, setDataList] = React.useState([])
    const [isSubmittedForGC, setIsSubmittedForGC] = React.useState(false)
    const [isSubmittedForRV, setIsSubmittedForRV] = React.useState(false)
    const [sequenceCo1, setSequenceCo1] = React.useState()
    const [sequenceCo2, setSequenceCo2] = React.useState()
    const [sequenceCo3, setSequenceCo3] = React.useState()



    const [searchQuery, setSearchQuery] = React.useState('');


    const onChangeSearch = query => {
        setSearchQuery(query);
    }

    const getLastSequence = (form) => {
        const seq = [];
        if (form.length === 0) {
            return 0;
        }
        form.forEach(item => {
            seq.push(item.Sequence)
        })
        return seq.sort(function (a, b) { return a - b; }).pop()
    }

    const setSequenceByForms = (forms) => {
        console.log("1", getLastSequence(forms[0].lstCOFormsData));
        console.log("2", getLastSequence(forms[1].lstCOFormsData));
        console.log("3", getLastSequence(forms[2].lstCOFormsData));
        setSequenceCo1(getLastSequence(forms[0].lstCOFormsData))
        setSequenceCo2(getLastSequence(forms[1].lstCOFormsData))
        setSequenceCo3(getLastSequence(forms[2].lstCOFormsData))


    }

    React.useEffect(() => {
        if (coForms && coForms.length > 0) {
            setDataList(coForms[currentForm].lstCOFormsData)
            setSequenceByForms(coForms)
            setIsSubmittedForGC(coForms[currentForm].SubmissionComplete)
            setIsSubmittedForRV(coForms[currentForm].SubmittedForApproval)
        }
    }, [currentForm, coForms])


    React.useEffect(() => {
        if (inspectionData.Id) {
            getAllCoForms(inspectionData.Id);
        }
    }, [])

    function refreshCOData() {
        if (inspectionData.Id) {
            getAllCoForms(inspectionData.Id);
        }
    }



    const getDynamicPropsForNewLineItem = (currentForm) => {

        let seq;

        if (currentForm === 0) {
            seq = sequenceCo1
        }
        if (currentForm === 1) {
            seq = sequenceCo2
        }
        if (currentForm === 2) {
            seq = sequenceCo3
        }

        return {
            "Scope_Notes": "New Line Item #" + Number(seq + 1),
            "Sequence": Number(seq + 1),
            "Contract_Type": `CO-${currentForm + 1}`,
            "UniqueKey": inspectionData.Id + "#" + `CO-${currentForm + 1}` + "#" + Number(seq + 1),
            "Lookup_To_Parent": initRehabId,
            "Total": 0,
            "Rate": 0,
            "Quantity": 0,

        }
    }

    const handleAddNewLineItem = async () => {
        let newItem = getDynamicPropsForNewLineItem(currentForm)
        if (currentForm === 0) {
            setSequenceCo1(prev => Number(prev + 1))
        }
        if (currentForm === 1) {
            setSequenceCo2(prev => Number(prev + 1))
        }
        if (currentForm === 2) {
            setSequenceCo3(prev => Number(prev + 1))
        }
        console.log({ newItem });
        await addNewLineItem(newItem);
        getAllCoForms(inspectionData.Id)
    };

    const handleDeleteLineItem = async (id) => {
        try {
            const res = await deleteLineItem(id);
            console.log({ res });
            refreshCOData();
        } catch (error) {
            console.log("DELETE LI ERROR");
        }
    }

    const handleOnChangeLineItem = async (field, value, key) => {
        const updatedDataList = dataList.map((obj) => {
            if (obj.UniqueKey === key) {
                let formatedVal = ["Scope_Notes", "Cost_Category", "Adj_U_M", "U_M", "Owner_Clarification"].includes(field) ? value : parseFloat(value)
                let newValues = { ...obj, [field]: formatedVal };
                let newTotal, approvedAmt;

                if (field === "Adj_Quantity" || field === "Adj_Rate" || field === 'Owner_Clarification') {
                    approvedAmt = newValues && (newValues.Adj_Quantity * newValues.Adj_Rate)
                    return { ...obj, [field]: formatedVal, ["Total"]: obj?.Total, ["Approved_Amount"]: approvedAmt };

                } else {
                    newTotal = newValues && (newValues.Quantity * newValues.Rate)
                    // added = (oldTotal > newTotal);
                    // let diff = (oldTotal - newTotal);
                    // let newGrandTotal = added ? grandTotal + diff : grandTotal - diff;
                    // newGrandTotal && setGrandTotal(newGrandTotal);
                    return { ...obj, [field]: formatedVal, ["Total"]: newTotal, ["Approved_Amount"]: obj?.Approved_Amount };
                }
            }
            return obj;
        })
        setDataList(updatedDataList);
        updateCoFormContext(updatedDataList, currentForm);
    }

    function handleOnSave(modifiedLineItem) {
        updateCoFormContext(dataList, currentForm);
        modifiedLineItem && updateCoLineItemToSf(modifiedLineItem)
    }

   async function handleApprovedAsNoted(modifiedLineItem) {
        updateCoFormContext(dataList, currentForm);
        modifiedLineItem && await updateCoLineItemToSf({
            ...modifiedLineItem,
            "Approval_Status": "Approved as Noted"
        })
        refreshCOData();
    }

    async function handleApproveALineItem(item) {

        updateCoFormContext(dataList, currentForm);
        item && await updateCoLineItemToSf({
            ...item,
            "Approval_Status": "Approved"
        })
        refreshCOData();
    }

   async function handleDeclineALineItem(item) {
        updateCoFormContext(dataList, currentForm);
        item && await updateCoLineItemToSf({
            ...item,
            "Approval_Status": "Declined"
        })
        refreshCOData();
    }

    function getSubmitForGCData() {
        if (currentForm === 0) {
            return {
                "Id": initRehabId,
                "CO1SubmissionComplete": true,
                "CO1SubmittedForApproval": false
            }
        } else if (currentForm === 1) {
            return {
                "Id": initRehabId,
                "CO2SubmissionComplete": true,
                "CO2SubmittedForApproval": false
            }
        } else if (currentForm === 2) {
            return {
                "Id": initRehabId,
                "CO3SubmissionComplete": true,
                "CO3SubmittedForApproval": false
            }
        }
    }

    function getSubmitForRVData() {
        if (currentForm === 0) {
            return {
                "Id": initRehabId,
                "CO1SubmittedForApproval": true
            }
        } else if (currentForm === 1) {
            return {
                "Id": initRehabId,
                "CO2SubmittedForApproval": true
            }
        } else if (currentForm === 2) {
            return {
                "Id": initRehabId,
                "CO3SubmittedForApproval": true
            }
        }
    }


    const [isSubmitting, setIsSubmitting] = React.useState(false);


    async function handleCOSubmit() {
        setIsSubmitting(true)
        try {
            const data = getSubmitForGCData();
            const res = await submitForApproval(data)
            showMessage({
                type: "success",
                message: "Submitted for approval"
            })
            navigation.goBack();
            console.log({ res });
        } catch (error) {
            console.log("SUBMIT CO ERROR");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleCOSubmitByRV() {
        setIsSubmitting(true)
        try {
            const data = getSubmitForRVData();
            const res = await submitForApproval(data)
            showMessage({
                type: "success",
                message: "Submitted for approval"
            })
            navigation.goBack();
            console.log({ res });
        } catch (error) {
            console.log("SUBMIT CO ERROR");
        } finally {
            setIsSubmitting(false);
        }
    }

    function getCurrentCoFormTotal() {
        let total = 0;
        dataList.length > 0 && dataList.forEach(item => {
            total = total + item.Total
        })
        return total
    }


    return (
        <View>
            {
                isSubmitted &&
                <>
                    <MenuWrapper style={{ justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            <MaterialCommunityIcons size={28} name='home-city' color={"#DE9B67"} />
                            <Text style={{ marginLeft: 8, color: '#C2CBD0', fontFamily: 'URBAN_BOLD', fontSize: 24 }}>CO Forms</Text>
                        </View>
                    </MenuWrapper>
                    {/* CO Tabs */}
                    <View style={{ flexDirection: "row" }}>
                        {
                            [0, 1, 2].map((item, i) =>
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => setCurrentForm(item)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: currentForm === item ? "#8477EB" : "white",
                                        padding: 8,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                    <Text style={{
                                        color: currentForm === item ? "white" : "#8477EB",
                                        fontFamily: "URBAN_BOLD", fontSize: 16
                                    }}>CO {item + 1}</Text>
                                </TouchableOpacity>)
                        }
                    </View>
                    {/* Total & Submit */}
                    <View style={{ marginTop: 16, marginBottom: 8, flexDirection: "row", paddingHorizontal: 8 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 16 }}>TOTAL : {getCurrentCoFormTotal()}</Text>
                        </View>

                        {
                            !isForReviewerView ?
                                <>
                                    <View style={{ flex: 1 }}>
                                        {
                                            !isSubmittedForGC ?
                                                !isSubmitting ?
                                                    <TouchableOpacity style={{ padding: 8, backgroundColor: "#e50d59", borderRadius: 4 }} onPress={handleCOSubmit}>
                                                        <Text style={{ fontFamily: "URBAN_BOLD", color: "white", fontSize: 16, textAlign: "center" }}> Submit For Review</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <ActivityIndicator />
                                                :
                                                <TouchableOpacity style={{ padding: 8, backgroundColor: "grey", borderRadius: 4, }}>
                                                    <Text style={{ fontFamily: "URBAN_BOLD", color: "white", fontSize: 16, textAlign: "center" }}> Submitted</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </>
                                :
                                <>
                                    <View style={{ flex: 1 }}>
                                        {
                                            !isSubmittedForRV ?
                                                !isSubmitting ?
                                                    <TouchableOpacity style={{ padding: 8, backgroundColor: "#e50d59", borderRadius: 4 }} onPress={handleCOSubmitByRV}>
                                                        <Text style={{ fontFamily: "URBAN_BOLD", color: "white", fontSize: 16, textAlign: "center" }}> Submit For Approval</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <ActivityIndicator />
                                                :
                                                <TouchableOpacity style={{ padding: 8, backgroundColor: "grey", borderRadius: 4, }}>
                                                    <Text style={{ fontFamily: "URBAN_BOLD", color: "white", fontSize: 16, textAlign: "center" }}> Submitted</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </>
                        }


                    </View>
                    {/* Search & Add */}
                    <View style={{ margin: 8, flexDirection: "row" }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 4, paddingHorizontal: 16, backgroundColor: "white", flex: 1, borderRadius: 4 }}>
                            <Icon name="search" color="grey" style={{ flex: .1, }} size={18} />
                            <TextInput value={searchQuery} onChangeText={onChangeSearch} placeholder={"Search Scope Notes ..."} style={{ flex: .8, fontFamily: "URBAN_REGULAR", backgroundColor: "transparent", fontSize: 18, padding: 12, width: "100%" }} />
                            {
                                searchQuery.length > 0 &&
                                <EntypoIcon onPress={() => setSearchQuery("")} name="cross" color="grey" style={{ flex: .1 }} size={24} />
                            }
                        </View>
                        {
                            !isForReviewerView
                                ?
                                <>
                                    {
                                        !isSubmittedForGC && <View style={{ flex: .3, marginHorizontal: 4 }}>
                                            <AddNewBtn onPress={handleAddNewLineItem}>
                                                <Text style={{ fontFamily: "URBAN_BOLD", color: "white" }}> Add New</Text>
                                            </AddNewBtn>
                                        </View>
                                    }
                                </>
                                :
                                <>
                                    {
                                        !isSubmittedForRV && <View style={{ flex: .3, marginHorizontal: 4 }}>
                                            <AddNewBtn onPress={handleAddNewLineItem}>
                                                <Text style={{ fontFamily: "URBAN_BOLD", color: "white" }}> Add New</Text>
                                            </AddNewBtn>
                                        </View>
                                    }
                                </>
                        }
                    </View>

                    {/* CO Line Items */}
                    <ScrollView style={{ minHeight: 240 }}>
                        {
                            isDataLoading ?
                                <ActivityIndicator /> :
                                dataList.filter(item => item?.Scope_Notes?.includes(searchQuery)).map((item, i) => <CoFormLineItem navigation={navigation} inspId={inspectionData.Id} handleDeleteLineItem={handleDeleteLineItem} isSubmittedForRV={isSubmittedForRV} isSubmittedForGC={isSubmittedForGC} refreshCOData={refreshCOData} handleDeclineALineItem={handleDeclineALineItem} handleApproveALineItem={handleApproveALineItem} handleApprovedAsNoted={handleApprovedAsNoted} handleOnChangeLineItem={handleOnChangeLineItem} isForReviewer={isForReviewerView} key={i} item={item} handleOnSave={handleOnSave} />)
                        }
                    </ScrollView>
                </>
            }
        </View>
    )
}

function CoFormLineItem({ handleDeleteLineItem, refreshCOData, item, isSubmittedForRV, isSubmittedForGC, isForReviewer, handleApproveALineItem, handleDeclineALineItem, handleOnChangeLineItem, handleOnSave, handleApprovedAsNoted, inspId, navigation }) {

    const insets = useSafeAreaInsets()


    const rightButtons = [
        <TouchableOpacity onPress={() => handleDeleteLineItem(item.id)} style={{ backgroundColor: '#F3206F', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
            <View>
                <MaterialCommunityIcons name="delete" size={24} color="white" />
            </View>
        </TouchableOpacity>,
        <TouchableOpacity onPress={() => navigation.navigate("CameraScreen", { inspId: { inspId }, lineItemId: item.id })} style={{ backgroundColor: '#1d1f69', justifyContent: 'center', alignItems: 'center', width: 64, flex: 1 }}>
            <View>
                <MaterialCommunityIcons name="camera" size={24} color="white" />
            </View>
        </TouchableOpacity>
    ];


    const swipeableRef = React.useRef();

    const [showModal, setShowModal] = React.useState(false);

    const {
        U_M,
        Total,
        Scope_Notes,
        Rate,
        Quantity,
        Adj_Quantity,
        Adj_Rate,
        Adj_U_M,
        Owner_Clarification,
        Cost_Category,
        Approval_Status,
        UniqueKey,
        Approved_Amount
    } = item

    function getBackgroundColor() {
        if (Approval_Status === "Approved") {
            return "#7CDD9B";
        } else if (Approval_Status === "Declined") {
            return "#E02E2E";
        } else {
            return "#3983EF";
        }
    }
    function getCardBackgroundColor() {
        if (Approval_Status === "Approved") {
            return "#E7F5CE";
        } else if (Approval_Status === "Declined") {
            return "#F9DAD4";
        } else if (Approval_Status === "Approved as Noted") {
            return "#FDF2BF";
        } else {
            return "#fff"
        }
    }

    const [showCostCategoryMenu, setShowCostCategoryMenu] = React.useState(false);


    if (isForReviewer) {
        const offset = useSharedValue({ x: 0 });
        const start = useSharedValue({ x: 0 });

        const [show, setShow] = React.useState(false);

        const handleLongPressState = (state) => {
            setShow(state);
        }


        const longPressGesture = Gesture.LongPress()
            .onEnd(() => {
                runOnJS(handleLongPressState)(true)
            })



        const dragGesture = Gesture.Pan()
            .averageTouches(true)
            .onUpdate((e) => {
                console.log(e.translationX);
                offset.value = {
                    x: (e.translationX + start.value.x)
                };
            })
            .onEnd(() => {
                start.value = {
                    x: offset.value.x,
                };
            });

        const animatedStyles = useAnimatedStyle(() => {
            return {
                transform: [
                    { translateX: offset.value.x },
                ],
            };
        });


        const obj = useDerivedValue(() => {
            if (offset.value.x < 0) {
                return {
                    color: "red",
                    limit: -200
                }
            }
            if (offset.value.x > 0) {
                return {
                    color: "green",
                    limit: 100
                }
            }
        }, [offset.value.x])

        const animatedStyleforBackground = useAnimatedStyle(() => {

            let bColor = "#c4c4c490";

            if (obj.value) {
                bColor = interpolateColor(offset.value.x, [0, obj.value.limit], ["grey", obj.value.color])
            }

            return {
                backgroundColor: bColor,
            }
        });


        const handleAlert = () => {
            if (offset.value.x < -100 && offset.value.x > -200) {
                if (isSubmittedForRV) {
                    setShowModal(false);
                    offset.value = {
                        x: 0
                    }
                    start.value = {
                        x: 0
                    }
                    setShow(false)
                    return;
                }
                console.log("INSIDE CANCEL BY REV");
                refreshCOData()// * Reset Old Data
                setShowModal(false);
                showMessage({
                    message: "Discarding changes...",
                    type: "danger",
                });
                offset.value = {
                    x: 0
                }
                start.value = {
                    x: 0
                }
                setShow(false)
            }

            if (offset.value.x > 100) {
                if (isSubmittedForRV) {
                    setShowModal(false);
                    offset.value = {
                        x: 0
                    }
                    start.value = {
                        x: 0
                    }
                    setShow(false)
                    return;
                }
                console.log("SAVING FOR REV..");
                item && handleApprovedAsNoted(item); // * Call SAVE TO CONTEXT FUNCTION
                setShowModal(false);
                showMessage({
                    message: "Saving Changes...",
                    type: "success",
                });
                offset.value = {
                    x: 0
                }
                start.value = {
                    x: 0
                }
                setShow(false)
            }
        }

        useDerivedValue(() => {

            if ((offset.value.x > 100) || (offset.value.x < 0 && offset.value.x > -200)) {
                runOnJS(handleAlert)(offset.value.x)
            }

        }, [offset.value.x, item])


        const composed = Gesture.Simultaneous(longPressGesture, dragGesture);



        return (

            (!isSubmittedForRV) ?
                <Provider>
                    <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={rightButtons}>
                        <ReviewerLineItemWrapper backgroundColor={getCardBackgroundColor()} >
                            <CurrentFormHeading>{Scope_Notes}</CurrentFormHeading>
                            <Text style={{ fontSize: 12, fontFamily: "URBAN_MEDIUM" }}>Cost Category : {Cost_Category}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: .2 }}>
                                    <ReviewerPreviewLabel>Qty {Quantity}</ReviewerPreviewLabel>
                                    <ReviewerPreviewLabel>Rate {Rate}</ReviewerPreviewLabel>
                                    <ReviewerPreviewLabel>Total {Total}</ReviewerPreviewLabel>
                                </View>
                                <View style={{ flex: .8, flexDirection: "row", alignItems: "center" }}>
                                    <ReviewerActionBtn onPress={() => handleApproveALineItem(item)} backgroundColor={Approval_Status === "Approved" ? "grey" : "#7CDD9B"}>
                                        <Text>A</Text>
                                    </ReviewerActionBtn>
                                    <ReviewerActionBtn onPress={() => setShowModal(true)} backgroundColor={Approval_Status === "Approved as Noted" ? "grey" : "#3983EF"} >
                                        <Text>R</Text>
                                    </ReviewerActionBtn>
                                    <ReviewerActionBtn onPress={() => handleDeclineALineItem(item)} backgroundColor={Approval_Status === "Declined" ? "grey" : "#E02E2E"}>
                                        <Text>D</Text>
                                    </ReviewerActionBtn>
                                </View>
                            </View>
                        </ReviewerLineItemWrapper>
                    </Swipeable>
                    <Modal transparent visible={showModal} onClose={() => setShowModal(false)} >
                        <Portal.Host>
                            <ComposedGestureWrapper gesture={composed}>
                                <>
                                    {/* MESSAGE */}
                                    {
                                        show &&
                                        <Animated.View style={{ position: 'absolute', bottom: 120, width: "100%", paddingHorizontal: 12 }}>
                                            <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                                <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Up to save</Text>
                                            </Animated.View>
                                            <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Down to Cancel</Text>
                                            </Animated.View>
                                        </Animated.View>
                                    }
                                    <Animated.View style={[{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 36 }, animatedStyleforBackground]}>

                                        {/* Fixed Banner */}
                                        <View style={{ padding: 8, paddingTop: insets.top, position: "absolute", top: 0, backgroundColor: "#000", width: Dimensions.get("screen").width }}>
                                            <View>
                                                <FormLabel style={{ fontSize: 12, color: "white", fontFamily: "URBAN_BOLD" }}>Scope Notes</FormLabel>
                                                <ScrollView showsVerticalScrollIndicator style={{ height: 26, marginBottom: 12 }}>
                                                    <Text style={{ fontSize: 18, color: "white", fontFamily: "URBAN_BOLD" }}>{Scope_Notes}</Text>
                                                </ScrollView>
                                            </View>
                                            <View style={{ flexDirection: "row" }}>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12, color: "white" }}>Qty</FormLabel>
                                                    <FormValue >{`${Quantity}`} </FormValue>
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12, color: "white" }}>UM</FormLabel>
                                                    <FormValue >{`${U_M ?? ''}`}</FormValue>
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12, color: "white" }}>Rate</FormLabel>
                                                    <FormValue >{`${Rate}`}</FormValue>
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12, color: "white" }}>Total</FormLabel>
                                                    <FormValue >{`${Total}`}</FormValue>
                                                </View>
                                            </View>
                                        </View>

                                        <Animated.View style={[{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }, animatedStyles]}>

                                            <View>
                                                <FormLabel style={{ fontSize: 12 }}>Owner Clarification</FormLabel>
                                                <View
                                                    style={{
                                                        backgroundColor: "#f1f4f8",
                                                        borderRadius: 8

                                                    }}>
                                                    <TextInput
                                                        editable
                                                        multiline
                                                        onChangeText={(text) => {
                                                            handleOnChangeLineItem("Owner_Clarification", text, UniqueKey)
                                                        }}
                                                        value={Owner_Clarification}
                                                        style={{ padding: 10, height: 96 }}
                                                    />
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12 }}>Adj Qty</FormLabel>
                                                    <FormInput onChangeText={(text) => {
                                                        handleOnChangeLineItem("Adj_Quantity", text, UniqueKey)
                                                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${Adj_Quantity ?? 0}`} />
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12 }}>Adj UM</FormLabel>
                                                    <FormInput onChangeText={(text) => {
                                                        handleOnChangeLineItem("Adj_U_M", text, UniqueKey)
                                                    }} style={{ fontSize: 16 }} value={`${Adj_U_M ?? ''}`} />
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12 }}>Adj Rate</FormLabel>
                                                    <FormInput onChangeText={(text) => {
                                                        handleOnChangeLineItem("Adj_Rate", text, UniqueKey)
                                                    }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${Adj_Rate ?? 0}`} />
                                                </View>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12 }}>Appr. Amt</FormLabel>
                                                    <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{`${Approved_Amount ?? 0}`} </FormValue>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                                <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                    <FormLabel style={{ fontSize: 12 }}>Cost Category</FormLabel>
                                                    <Menu
                                                        visible={showCostCategoryMenu}
                                                        onDismiss={() => setShowCostCategoryMenu(false)}
                                                        anchor={
                                                            <TouchableOpacity style={{ backgroundColor: "#f1f4f8", padding: 8, borderRadius: 4 }} onPress={() => setShowCostCategoryMenu(true)}>
                                                                <Text style={{ fontSize: 16, fontFamily: "URBAN_MEDIUM" }} >{Cost_Category}</Text>
                                                            </TouchableOpacity>
                                                        }
                                                    >
                                                        {
                                                            CostCategory.map((option, index) =>
                                                                <Menu.Item key={index} onPress={() => {
                                                                    handleOnChangeLineItem("Cost_Category", option, UniqueKey)
                                                                    setShowCostCategoryMenu(false)
                                                                }} title={option} />
                                                            )
                                                        }
                                                    </Menu>
                                                </View>
                                            </View>
                                        </Animated.View>
                                    </Animated.View>
                                </>
                            </ComposedGestureWrapper>
                        </Portal.Host>
                    </Modal>


                </Provider>
                :
                <>

                    <ReviewerLineItemWrapper onPress={() => setShowModal(true)} backgroundColor={getCardBackgroundColor()} >
                        <Text style={{ fontSize: 12, fontFamily: "URBAN_MEDIUM" }}>Cost Category : {Cost_Category}</Text>
                        <CurrentFormHeading>{Scope_Notes}</CurrentFormHeading>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1, flexDirection: "row" }}>
                                <ReviewerPreviewLabel>Qty {Quantity}</ReviewerPreviewLabel>
                                <ReviewerPreviewLabel>Rate {Rate}</ReviewerPreviewLabel>
                                <ReviewerPreviewLabel>Total {Total}</ReviewerPreviewLabel>
                            </View>
                            {/* <View style={{ flex: .8, flexDirection: "row", alignItems: "center" }}>
                                <ReviewerActionBtn onPress={() => handleApproveALineItem(item)} backgroundColor={Approval_Status === "Approved" ? "grey" : "#7CDD9B"}>
                                    <Text>A</Text>
                                </ReviewerActionBtn>
                                <ReviewerActionBtn onPress={() => setShowModal(true)} backgroundColor={Approval_Status === "Approved as Noted" ? "grey" : "#3983EF"} >
                                    <Text>R</Text>
                                </ReviewerActionBtn>
                                <ReviewerActionBtn onPress={() => handleDeclineALineItem(item)} backgroundColor={Approval_Status === "Declined" ? "grey" : "#E02E2E"}>
                                    <Text>D</Text>
                                </ReviewerActionBtn>
                            </View> */}
                        </View>
                    </ReviewerLineItemWrapper>
                    <Modal transparent visible={showModal} onClose={() => setShowModal(false)} >
                        <ComposedGestureWrapper gesture={composed}>
                            <>
                                {/* MESSAGE */}
                                {
                                    show &&
                                    <Animated.View style={{ position: 'absolute', bottom: 120, width: "100%", paddingHorizontal: 12 }}>
                                        <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                            <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Up to save</Text>
                                        </Animated.View>
                                        <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Down to Cancel</Text>
                                        </Animated.View>
                                    </Animated.View>
                                }
                                <Animated.View style={[{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 36 }]}>

                                    {/* Fixed Banner */}
                                    <View style={{ padding: 8, paddingTop: insets.top, position: "absolute", top: 0, backgroundColor: "#000", width: Dimensions.get("screen").width }}>
                                        <View>
                                            <FormLabel style={{ fontSize: 12, color: "white", fontFamily: "URBAN_BOLD" }}>Scope Notes</FormLabel>
                                            <ScrollView showsVerticalScrollIndicator style={{ height: 26, marginBottom: 12 }}>
                                                <Text style={{ fontSize: 18, color: "white", fontFamily: "URBAN_BOLD" }}>{Scope_Notes}</Text>
                                            </ScrollView>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12, color: "white" }}>Qty</FormLabel>
                                                <FormValue >{`${Quantity}`} </FormValue>
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12, color: "white" }}>UM</FormLabel>
                                                <FormValue >{`${U_M ?? ''}`}</FormValue>
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12, color: "white" }}>Rate</FormLabel>
                                                <FormValue >{`${Rate}`}</FormValue>
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12, color: "white" }}>Total</FormLabel>
                                                <FormValue >{`${Total}`}</FormValue>
                                            </View>
                                        </View>
                                    </View>

                                    <Animated.View style={[{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }, animatedStyles]}>

                                        <View>
                                            <FormLabel style={{ fontSize: 12 }}>Owner Clarification</FormLabel>
                                            <View>
                                                <TextInput
                                                    editable={false}
                                                    multiline
                                                    value={Owner_Clarification}
                                                    style={{ padding: 10, height: 96 }}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12 }}>Adj Qty</FormLabel>
                                                <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{Adj_Quantity ?? 0}</FormValue>
                                                {/* <FormInput onChangeText={(text) => {
                                                    handleOnChangeLineItem("Adj_Quantity", text, UniqueKey)
                                                }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${Adj_Quantity ?? 0}`} />
                                            */}
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12 }}>Adj UM</FormLabel>
                                                <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{Adj_U_M ?? ''}</FormValue>
                                                {/* <FormInput onChangeText={(text) => {
                                                    handleOnChangeLineItem("Adj_U_M", text, UniqueKey)
                                                }} style={{ fontSize: 16 }} value={`${Adj_U_M ?? ''}`} /> */}
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12 }}>Adj Rate</FormLabel>
                                                <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{Adj_Rate ?? 0}</FormValue>

                                                {/* <FormInput onChangeText={(text) => {
                                                    handleOnChangeLineItem("Adj_Rate", text, UniqueKey)
                                                }} style={{ fontSize: 16 }} keyboardType="number-pad" value={`${Adj_Rate ?? 0}`} /> */}
                                            </View>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12 }}>Appr. Amt</FormLabel>
                                                <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{`${Approved_Amount ?? 0}`} </FormValue>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                            <View style={{ flex: 1, marginHorizontal: 2 }}>
                                                <FormLabel style={{ fontSize: 12 }}>Cost Category</FormLabel>
                                                <FormValue style={{ color: "black", padding: 8, fontSize: 16 }}>{`${Cost_Category ?? ''}`} </FormValue>
                                            </View>
                                        </View>
                                    </Animated.View>
                                </Animated.View>
                            </>
                        </ComposedGestureWrapper>
                    </Modal>
                </>
        )
    }


    const offset = useSharedValue({ x: 0 });
    const start = useSharedValue({ x: 0 });

    const [show, setShow] = React.useState(false);

    const handleLongPressState = (state) => {
        setShow(state);
    }


    const longPressGesture = Gesture.LongPress()
        .onEnd(() => {
            runOnJS(handleLongPressState)(true)
        })



    const dragGesture = Gesture.Pan()
        .averageTouches(true)
        .onUpdate((e) => {
            console.log(e.translationX);
            offset.value = {
                x: (e.translationX + start.value.x)
            };
        })
        .onEnd(() => {
            start.value = {
                x: offset.value.x,
            };
        });

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: offset.value.x },
            ],
        };
    });


    const obj = useDerivedValue(() => {
        if (offset.value.x < 0) {
            return {
                color: "red",
                limit: -200
            }
        }
        if (offset.value.x > 0) {
            return {
                color: "green",
                limit: 100
            }
        }
    }, [offset.value.x])

    const animatedStyleforBackground = useAnimatedStyle(() => {

        let bColor = "#c4c4c490";

        if (obj.value) {
            bColor = interpolateColor(offset.value.x, [0, obj.value.limit], ["#c4c4c490", obj.value.color])
        }

        return {
            backgroundColor: bColor,
        }
    });

    const handleAlert = () => {

        if (offset.value.x < -100 && offset.value.x > -200) {
            if (isSubmittedForGC) {
                setShowModal(false);
                offset.value = {
                    x: 0
                }
                start.value = {
                    x: 0
                }
                setShow(false)
                return;
            }
            console.log("INSIDE CANCEL");
            refreshCOData()// * Reset Old Data
            setShowModal(false);
            showMessage({
                message: "Discarding changes...",
                type: "danger",
            });
            offset.value = {
                x: 0
            }
            start.value = {
                x: 0
            }
            setShow(false)
        }
        if (offset.value.x > 100) {
            if (isSubmittedForGC) {
                setShowModal(false);
                offset.value = {
                    x: 0
                }
                start.value = {
                    x: 0
                }
                setShow(false)
                return;
            }
            console.log("SAVING..");
            item && handleOnSave(item); // * Call SAVE TO CONTEXT FUNCTION
            setShowModal(false);
            showMessage({
                message: "Saving Changes...",
                type: "success",
            });
            offset.value = {
                x: 0
            }
            start.value = {
                x: 0
            }
            setShow(false)
        }


    }

    useDerivedValue(() => {

        if ((offset.value.x > 100) || (offset.value.x < 0 && offset.value.x > -200)) {
            runOnJS(handleAlert)(offset.value.x)
        }

    }, [offset.value.x, item])



    const composed = Gesture.Simultaneous(longPressGesture, dragGesture);



    return (
        <>
            <Swipeable onRef={(ref) => swipeableRef.current = ref} rightButtons={isSubmittedForGC ? null : rightButtons}>
                <TouchableOpacity style={{ padding: 8 }} onPress={() => {
                    !isSubmittedForGC && setShowModal(true);
                }}>
                    <CurrentFormHeading>{Scope_Notes}</CurrentFormHeading>
                    <View style={{ flexDirection: "row" }}>
                        <PreviewLabel>Qty {Quantity}</PreviewLabel>
                        <PreviewLabel>Rate {Rate}</PreviewLabel>
                        <PreviewLabel>Total {Total}</PreviewLabel>
                    </View>
                </TouchableOpacity>
            </Swipeable>

            <Modal transparent visible={showModal} onDismiss={() => setShowModal(false)} >
                <ComposedGestureWrapper gesture={composed}>
                    {/* Animated Message */}
                    <>
                        {
                            show &&
                            <Animated.View style={{ position: 'absolute', bottom: 120, width: "100%", paddingHorizontal: 12 }}>
                                <Animated.View style={{ marginLeft: "auto", justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Right to save</Text>
                                </Animated.View>
                                <Animated.View style={{ marginRight: "auto", justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ backgroundColor: "#8477EB", padding: 8, color: "white", fontFamily: "URBAN_BOLD", fontSize: 16 }}>Swipe Left to Cancel</Text>
                                </Animated.View>
                            </Animated.View>
                        }

                        <Animated.View style={[{ backgroundColor: "#d4d4d490", flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 48 }, animatedStyleforBackground]}>
                            <Animated.View style={[{ backgroundColor: "white", padding: 12, width: "100%", borderRadius: 8 }, animatedStyles]}>
                                <View>
                                    <FormLabel style={{ fontSize: 12 }}>Scope Notes</FormLabel>
                                    <TextInput
                                        editable
                                        multiline
                                        onChangeText={(text) => {
                                            handleOnChangeLineItem("Scope_Notes", text, UniqueKey)
                                        }}
                                        value={Scope_Notes}
                                        style={{ padding: 10, height: 96, backgroundColor: "#f1f4f8", borderRadius: 8 }}
                                    />
                                </View>
                                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Quantity</FormLabel>
                                        <FormInput keyboardType="number-pad" onChangeText={(text) => {
                                            handleOnChangeLineItem("Quantity", text, UniqueKey)
                                        }} style={{ fontSize: 16 }} value={`${Quantity}`} />
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>U/M</FormLabel>
                                        <FormInput onChangeText={(text) => {
                                            handleOnChangeLineItem("U_M", text, UniqueKey)
                                        }} style={{ fontSize: 16 }} value={`${U_M ?? ""}`} />
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Rate</FormLabel>
                                        <FormInput keyboardType="decimal-pad" onChangeText={(text) => {
                                            handleOnChangeLineItem("Rate", text, UniqueKey)
                                        }} style={{ fontSize: 16 }} value={`${Rate}`} />
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 2 }}>
                                        <FormLabel style={{ fontSize: 12 }}>Total</FormLabel>
                                        <Text style={{ fontSize: 16, padding: 8 }}>{`${Total}`} </Text>
                                    </View>
                                </View>
                            </Animated.View>
                        </Animated.View>
                    </>
                </ComposedGestureWrapper>
            </Modal>
        </>
    )
}

const windowWidth = Dimensions.get('window').width;

const MenuWrapper = styled.View`
margin:16px 0;
background-color: #1E2429;
flex-direction: row;
padding:12px;
justify-content: center;
width: ${windowWidth}px ;
`;


const CurrentFormHeading = styled.Text`
font-family: 'URBAN_BOLD';
text-transform: uppercase;
font-size: ${Platform.OS === "android" ? 12 : 16}px;

`;


const PreviewLabel = styled.Text`
font-family: 'URBAN_MEDIUM';
font-size: ${Platform.OS === "android" ? 12 : 16}px;
color: green;
flex: 1;
`;

const AddNewBtn = styled.TouchableOpacity`
background-color:#8477EB;
flex: 1;
justify-content:center;
align-items:center;
border-radius:4px;
`;


const FormLabel = styled.Text`
font-family: 'URBAN_BOLD';
font-size: ${Platform.OS === "android" ? 12 : 16}px;
margin-bottom: 4px;
`

const FormInput = styled.TextInput`
background-color: #f1f4f8;
padding: 8px;
font-family: 'URBAN_MEDIUM';
border-radius: 4px;
`;

const FormValue = styled.Text`
font-family: 'URBAN_MEDIUM';
color: #fff;
font-size: 18px;
`;

const ReviewerActionBtn = styled.TouchableOpacity`
background-color: ${props => props.backgroundColor};
flex: 1;
margin: 0 16px;
padding: 8px 16px;
border-radius: 16px;
justify-content: center;
align-items:center;
`;

const ReviewerLineItemWrapper = styled.TouchableOpacity`
padding: 8px;
background-color: ${props => props.backgroundColor};
`;

const ReviewerPreviewLabel = styled(PreviewLabel)`
font-size: ${Platform.OS === "android" ? 10 : 12}px;
`;



export default CoForms