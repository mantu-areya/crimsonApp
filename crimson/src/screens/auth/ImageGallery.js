import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { VendorFormContext } from '../../services/context/VendorForm/vendorForm.contex';
import styled from 'styled-components/native';
import Ionicons from "react-native-vector-icons/Ionicons"
import Overlay from 'react-native-modal-overlay';

const ImageGallery = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();

    const { inspId } = route.params;

    const { vendorFormDetails } = React.useContext(VendorFormContext);

    const inspData = vendorFormDetails[inspId]; // ! GET LINE ITMES IMAGS ARRAY


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
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) =>
                            <GalleryImageItem key={i} />
                        )
                    }
                </View>

            </GalleryWrapper>
        </View>
    )
}


function GalleryImageItem() {

    const [showPreview, setShowPreview] = React.useState(false);

    return (
        <TouchableOpacity onPress={() => setShowPreview(true)}>
            <Image  style={{
                width: Dimensions.get("window").width / 3,
                height: 128
            }} source={require("../../assets/images/Background.png")} />
            <Overlay childrenWrapperStyle={{ backgroundColor: 'black' }} containerStyle={{ backgroundColor: 'black' }} visible={showPreview} onClose={() => setShowPreview(false)} closeOnTouchOutside >
                <Ionicons onPress={() => setShowPreview(false)} name="close" color="white" size={32} />
                <Image source={require("../../assets/images/Background.png")} style={{ width: 480, height: 480, borderRadius: 16 }} />
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