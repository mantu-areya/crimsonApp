import React, { useContext } from "react";
import { SafeArea } from "../../../components/utility/safe-area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Row, SectionEnd } from "../components/ProcessRecordsInfoCardStyle";
import { Text } from "../../../components/typography/text.component"
import { SvgXml } from "react-native-svg";
import SortSvg from "../../../assets/svg/Sort.js";
import FilterSvg from "../../../assets/svg/Filter.js";
import { InspectionsInfoCard } from "../components/InspectionsInfoCard"
import { InspectionsContext } from "../../../services/inspections/inspections.contex"
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import {
    SearchContainer,
    CardList,
    BackNavigator,
    HeaderCard,
    Loading,
    LoadingContainer,
    ListContainer,
    AppBody,
    ActionsSection,
    HeaderCardBody,
    HeaderCardCover
} from './InspectionScreenStyles'

import { Colors } from "react-native-paper";

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