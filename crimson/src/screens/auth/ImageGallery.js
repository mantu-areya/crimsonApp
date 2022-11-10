import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { VendorFormContext } from '../../services/context/VendorForm/vendorForm.contex';
import styled from 'styled-components/native';
import Ionicons from "react-native-vector-icons/Ionicons"
import Overlay from 'react-native-modal-overlay';
import { getVendorFormDetails } from '../../services/inspections/inspections.service';

const ImageGallery = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();

    const { inspId } = route.params;

    const [allImages, setAllImages] = React.useState([]);

    async function getLineItemImages() {
        const data = await getVendorFormDetails(inspId);
        setAllImages(data.Images)
    }

    React.useEffect(() => {
        getLineItemImages();
    }, [inspId])



    return (
        <View style={{ paddingTop: insets.top, flex: 1 }}>
            <ToolBar>
                {/* back */}
                <Ionicons onPress={() => navigation.goBack()} name="arrow-back" color="black" size={24} />
                {/* Person Name */}
                <ToolBarHeading>Image Gallery</ToolBarHeading>
            </ToolBar>
            <GalleryWrapper>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {
                        allImages.length > 0 && allImages.map((item, i) =>
                            <GalleryImageItem key={i} img={item} />
                        )
                    }

                </View>

                {
                    allImages.length <= 0 &&
                    <View style={{ padding: 16 }}>
                        <Text style={{ fontFamily: 'URBAN_BOLD', fontSize:24 }}>No images to Show</Text>
                    </View>
                }

            </GalleryWrapper>
        </View>
    )
}


function GalleryImageItem({ img }) {

    const [showPreview, setShowPreview] = React.useState(false);

    return (
        <TouchableOpacity onPress={() => setShowPreview(true)}>
            <Image style={{
                width: Dimensions.get("window").width / 3,
                height: 128
            }} source={{ uri: img.file_public_url }} />
            <Overlay childrenWrapperStyle={{ backgroundColor: 'black' }} containerStyle={{ backgroundColor: 'black' }} visible={showPreview} onClose={() => setShowPreview(false)} closeOnTouchOutside >
                <Ionicons onPress={() => setShowPreview(false)} name="close" color="white" size={32} />
                <Image source={{ uri: img.file_public_url }} style={{ width: 480, height: 480, borderRadius: 16 }} />
            </Overlay>
        </TouchableOpacity>
    )
}



const ToolBar = styled.View`
/* background-color: black; */
padding: 16px;
flex-direction: row;
align-items:center;
`;

const ToolBarHeading = styled.Text`
font-size:18px;
font-family: 'URBAN_MEDIUM';
color: black;
margin-left: 16px;
`;

const GalleryWrapper = styled.ScrollView`
flex: 1;
`;


export default ImageGallery