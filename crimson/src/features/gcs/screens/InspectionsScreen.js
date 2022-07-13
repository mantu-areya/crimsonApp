import React, { useContext } from "react";
import { Searchbar } from "react-native-paper";
import { SafeArea } from "../../../components/utility/safe-area.component";
import styled from "styled-components";
import { FlatList, View, ImageBackground, Pressable } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, SectionEnd } from "../components/ProcessRecordsInfoCardStyle";
import { Text } from "../../../components/typography/text.component"
import { SvgXml } from "react-native-svg";
import SortSvg from "../../../assets/svg/Sort.js";
import FilterSvg from "../../../assets/svg/Filter.js";
import { InspectionsInfoCard } from "../components/InspectionsInfoCard"
import { InspectionsContext } from "../../../services/inspections/inspections.contex"
import { ActivityIndicator, Colors } from "react-native-paper";
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const SearchContainer = styled(Searchbar)`
  margin-top:${(props) => props.theme.space[3]};
  height:40px;
`;

const CardList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 10,
    alignItems: "center",
  },
})``;

export const BackNavigator = styled(Pressable)`
width:100px;
height:30px;
margin-left:1px;
`;

const HeaderCard = styled(View)`
height:250px;
border-radius:55px;
border-bottom-left-radius: 28px;
border-bottom-right-radius: 28px;
background-color:"red";
`;

const HeaderCardCover = styled(ImageBackground)`
flex:1
`;

const HeaderCardBody = styled.View`
  margin:${(props) => props.theme.space[3]};
  margin-top:${(props) => props.theme.space[6]};
`;

const ActionsSection = styled.View`
  margin:${(props) => props.theme.space[3]};
`;

const AppBody = styled.View`
    flex:1;
    background-color:${(props) => props.theme.colors.bg.primary};
`;

const ListContainer = styled.View`
  margin-bottom:30px;
  flex:1;
`;

const LoadingContainer = styled.View`
  position: absolute;
  top: 50%;
  left: 50%;
`;
const Loading = styled(ActivityIndicator)`
  margin-left: -25px;
`;

export const InspectionsScreen = ({ navigation }) => {
  const { isLoading, inspections } = useContext(InspectionsContext);

  return (
    <>
      <AppBody >
        <HeaderCard  >
          <HeaderCardCover
            imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: 70 }}

            source={require("../../../assets/images/Background.png")}
          >
            <SafeArea>
              <BackNavigator onPress={() => { navigation.goBack() }}>
                <Row>
                  <Icon name="arrow-left" size={20} color="white" style={{ marginTop: 4 }} />
                  <Text variant="NavigationText">Back</Text>
                </Row>
              </BackNavigator>
              <HeaderCardBody>
                <Text variant="HeaderName">
                  Inspections
                </Text>
                <SearchContainer style={{ borderRadius: 15 }} placeholder="Search" />
              </HeaderCardBody>
            </SafeArea>
          </HeaderCardCover>
        </HeaderCard>
        <SafeArea>
          <Row>
            <SectionEnd>
              <ActionsSection>
                <Row>
                  <Spacer position="right" size="large">
                    <SvgXml xml={SortSvg} width={15} height={15} />
                  </Spacer>
                  <SvgXml xml={FilterSvg} width={15} height={15} />
                </Row>
              </ActionsSection>
            </SectionEnd>
          </Row>
          <Row>
            {inspections == null ? < LoadingContainer >
              <Loading size={50} animating={true} color={Colors.blue300} />
            </LoadingContainer>
              : <ListContainer>

                <CardList
                  data={inspections !== null && inspections.records}
                  keyExtractor={(item) => item.Name}
                  renderItem={(item) => (
                    <>
                      <Spacer position="bottom" size="large">
                        <InspectionsInfoCard data={item} navigation={navigation} />
                      </Spacer>
                    </>
                  )}
                />
              </ListContainer>}
          </Row>
        </SafeArea>
      </AppBody>
    </>
  )

}