import { View, Text, ImageBackground, Image, Dimensions, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'
import Ionicons from "react-native-vector-icons/Ionicons"
import { differenceInDays } from 'date-fns'
import { useNavigation } from '@react-navigation/native';
import Overlay from 'react-native-modal-overlay';
import { getVendorFormDetails, postSendFileEmail } from '../../services/inspections/inspections.service';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Map } from './maps/Map'
import * as Linking from "expo-linking";
import { ActivityIndicator } from 'react-native-paper'



const image = require("../../../assets/black-bg.jpg");
const img2 = require("../../../assets/images/DetailsCardBg.webp");

const Hero = ({ totalBidSubmitted, roomMeasurementTotal, data, isSubmitted, sectionTotals, handleViewImageGallery }) => {

    const navigation = useNavigation()
    const [overlayVisible, setOverlayVisible] = React.useState(false);

    async function handleFileDownload() {
        const res = await postSendFileEmail(data.Id, GC_Email__c);
        alert("WAF sent to Email Address")
        console.log("FILE EMAIl SEND", res);
    }

    const [allImages, setAllImages] = React.useState([]);
    const [imagesLoading, setImagesLoading] = React.useState(false);

    async function getLineItemImages(inspId) {
        try {
            setImagesLoading(true);
            const res = await getVendorFormDetails(inspId);
            setAllImages(res.Images)
        } catch (error) {
            console.log("GET LINE ITEM IMAGES ERROR", error);
        } finally {
            setImagesLoading(false);
        }

    }

    React.useEffect(() => {
        if (data && data.Id) {
            getLineItemImages(data.Id);
        }
    }, [data])


    const {
        Property_Street_Address__c,
        Target_Rehab_Complete_Date__c,
        GC_Inspection_Due_Date__c,
        Inspection_Form_Stage__c,
        GC_Email__c,
        Prospect_ID__r: { Baths__c, Bed__c, Square_Feet__c, Year_Built__c },
        doCreateWAF__c,
        Is_New_Construction__c,
        Work_Authorization_Signed_Date_GC__c: gcSignDate,
        Work_Authorization_Date_Signed__c: rSignDate
    } = data;

    const pendingDays = differenceInDays(
        new Date(GC_Inspection_Due_Date__c),
        new Date()
    )

    const areBothSignPresent = gcSignDate && rSignDate


    const isCarousel = React.useRef(null);

    const [index, setIndex] = React.useState(0)


    function CarouselCardItem({ index }) {
        if (index == 0) {
            return (
                <ImageBackgroundWrapper onPress={() => setOverlayVisible(true)} >

                    <Image source={image} style={{ width: '100%', height: 360, borderRadius: 16 }} />

                    <InsideContentWrapper>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {/* Back Icon */}
                            <GoBackButton handleGoBack={() => navigation.goBack()} />
                            {/* Meta Info */}
                            <MetaInfo {...{ areBothSignPresent, pendingDays, Inspection_Form_Stage__c, handleFileDownload, doCreateWAF__c }} />
                        </View>
                        {/* Short Summary */}
                        <ShortSummary {...{ Property_Street_Address__c, Baths__c, Bed__c, Square_Feet__c }} />

                    </InsideContentWrapper>

                </ImageBackgroundWrapper>
            )
        }
        return (
            <MapBackgroundWrapper>
                <BackButtonWrapper style={{ position: 'absolute', top: 16, left: 16, zIndex: 9, backgroundColor: "#23252645" }} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={32} color="white" />
                </BackButtonWrapper>
                <BackButtonWrapper onPress={handleOpenMap} style={{ width: 148, flexDirection: "row", position: 'absolute', bottom: 10, right: 16, zIndex: 9, backgroundColor: "#23252685" }}>
                    <Ionicons name="navigate" size={18} color="white" />
                    <Text style={{ fontFamily: "URBAN_BOLD", fontSize: 14, color: "white" }}>Get Directions</Text>
                </BackButtonWrapper>
                <Map inspections={data} />
            </MapBackgroundWrapper>
        )
    }

    const width = Dimensions.get("screen").width - 30

    const { Property_Latitude__c, Property_Longitude__c } = data;


    const handleOpenMap = () => {
        Platform.select({
            ios: () => {
                Linking.openURL("http://maps.apple.com/maps?daddr=" + Property_Latitude__c + "," + Property_Longitude__c);
            },
            android: () => {
                Linking.openURL("http://maps.google.com/maps?daddr=" + Property_Latitude__c + "," + Property_Longitude__c);
            }
        })();
    }




    return (
        <Container>
            <View>
                <Carousel
                    layout="default"
                    layoutCardOffset={2}
                    ref={isCarousel}
                    data={[1, 2]}
                    renderItem={({ item, index }) => <CarouselCardItem {...{ item, index }} />}
                    sliderWidth={width}
                    itemWidth={width}
                    inactiveSlideShift={0}
                    useScrollView={false}
                    onSnapToItem={(index) => setIndex(index)}
                />
                <Pagination
                    dotsLength={[1, 2].length}
                    activeDotIndex={index}
                    carouselRef={isCarousel}
                    dotStyle={{
                        width: 24,
                        height: 24,
                        borderRadius: 24/2,
                        marginHorizontal: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.92)'
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    tappableDots={true}
                />

            </View>


            <Overlay childrenWrapperStyle={{ backgroundColor: 'black' }} containerStyle={{ backgroundColor: 'black' }} visible={overlayVisible} onClose={() => setOverlayVisible(false)} closeOnTouchOutside >
                <Ionicons onPress={() => setOverlayVisible(false)} name="close" color="white" size={32} />
                <Image source={image} style={{ width: 320, height: 320, borderRadius: 16 }} />
            </Overlay>
            {/* Image Gallery */}
            {
                imagesLoading
                    ? <ActivityIndicator />
                    : <ImageGallery handleViewImageGallery={handleViewImageGallery} allImages={allImages} />
            }
            {/* Description */}
            <DescriptionWrapper>
                <Text style={{ color: 'black', fontFamily: 'URBAN_BOLD', fontSize: 16 }}>DESCRIPTION</Text>
                <DescriptionText style={{ marginTop: 14 }}>
                    {Property_Street_Address__c} is a {Bed__c} Room Property with {Baths__c} Baths and {Square_Feet__c} Sq Ft. Built in {Year_Built__c}. {Is_New_Construction__c && "this property is a New Construction"}
                </DescriptionText>
                <DescriptionText style={{ marginTop: 16 }}>
                    Inspection Schedule Date - {GC_Inspection_Due_Date__c}
                </DescriptionText>
                <DescriptionText>
                    Target Rehab Complete Date - {Target_Rehab_Complete_Date__c}
                </DescriptionText>
                <DescriptionText style={{ marginTop: 16 }}>
                    Total Bid Submitted - {totalBidSubmitted}
                </DescriptionText>
                <DescriptionText>
                    Room Measurements Total - {roomMeasurementTotal}
                </DescriptionText>
            </DescriptionWrapper>
        </Container>
    )
}

function ImageGallery({ handleViewImageGallery, allImages }) {

    let initialImages = [];

    if (allImages.length > 5) {
        initialImages = allImages.slice(0, 5)
    } else {
        initialImages = allImages
    }

    return (
        <View style={{ paddingHorizontal: 16, }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {
                    initialImages.map((img, i) => <GalleryImageItem key={i} img={img} />)
                }
                {
                    allImages.length > 5 &&

                    < TouchableOpacity
                        onPress={handleViewImageGallery}
                        style={{
                            height: 48,
                            width: (Dimensions.get("screen").width - 86) / 6,
                            marginHorizontal: 2,
                            backgroundColor: "#00000070",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 4
                        }}>
                        <Text style={{ fontSize: 12, color: "white", fontFamily: "URBAN_BOLD" }}>See More</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}


function GalleryImageItem({ img }) {

    const [showPreview, setShowPreview] = React.useState(false);

    return (
        <TouchableOpacity onPress={() => setShowPreview(true)}>
            <Image
                source={{ uri: img.file_public_url }}
                style={{
                    height: 48,
                    width: (Dimensions.get("screen").width - 86) / 6,
                    marginHorizontal: 2,
                    borderRadius: 4
                }} />
            <Overlay childrenWrapperStyle={{ backgroundColor: 'black' }} containerStyle={{ backgroundColor: 'black' }} visible={showPreview} onClose={() => setShowPreview(false)} closeOnTouchOutside >
                <Ionicons onPress={() => setShowPreview(false)} name="close" color="white" size={32} />
                <Image source={{ uri: img.file_public_url }} style={{ width: 480, height: 480, borderRadius: 16 }} />
            </Overlay>
        </TouchableOpacity>
    )
}


function GoBackButton({ handleGoBack }) {
    return (
        <BackButtonWrapper onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={32} color="white" />
        </BackButtonWrapper>
    )
}

function MetaInfo({ areBothSignPresent, pendingDays, Inspection_Form_Stage__c, handleFileDownload, doCreateWAF__c }) {
    return (
        <MetaInfoWrapper>
            {
                areBothSignPresent
                    ?
                    <MetaInfoText>Signed</MetaInfoText>
                    :
                    <>
                        <MetaInfoText>{Inspection_Form_Stage__c}</MetaInfoText>
                        <MetaInfoText>{pendingDays} days pending</MetaInfoText>
                    </>
            }

            {doCreateWAF__c && <Ionicons onPress={handleFileDownload} style={{ marginTop: 16 }} name="cloud-download" size={32} color="white" />}
        </MetaInfoWrapper>
    )
}

function ShortSummary({ Property_Street_Address__c, Baths__c, Bed__c, Square_Feet__c }) {
    return (
        <ShortSummaryWrapper>
            {/* Address */}
            <ShortSummaryAddress>
                {Property_Street_Address__c}
            </ShortSummaryAddress>
            {/* Bed | Bath | Sq Feet */}
            <BedBathSqftText>
                {Bed__c} BEDS | {Baths__c} BATHS | {Square_Feet__c} SQFT
            </BedBathSqftText>
        </ShortSummaryWrapper>
    )
}


const Container = styled.View`
padding:15px;
background-color:white;
width: 100%;
`;

const ImageBackgroundWrapper = styled.TouchableOpacity`

`;

const MapBackgroundWrapper = styled.TouchableOpacity`

`;

const InsideContentWrapper = styled.View`
position: absolute;
padding: 16px;
width: 100%;
height: 360px;
`;

const BackButtonWrapper = styled.TouchableOpacity`
width: 48px;
height: 48px;
justify-content: center;
align-items: center;
background-color: #171C1F;
border-radius: 8px;
`

const MetaInfoWrapper = styled.View`
align-items: flex-end;
margin-top: 8px;
`;

const MetaInfoText = styled.Text`
font-size: 16px;
font-family: 'URBAN_REGULAR';
color: white;
`

const ShortSummaryWrapper = styled.View`
margin-top: auto;
margin-left: auto;
`;

const ShortSummaryAddress = styled.Text`
font-size: 18px;
color: white;
width: 100%;
font-family: 'URBAN_REGULAR';
`;

const BedBathSqftText = styled.Text`
font-size:12px;
color: #84919B;

`;


const DescriptionWrapper = styled.View`
padding: 16px 16px 0;
`

const DescriptionText = styled.Text`

color: #96A1AC;

font-family: 'URBAN_BOLD';
font-size: 16px;

`


export default Hero