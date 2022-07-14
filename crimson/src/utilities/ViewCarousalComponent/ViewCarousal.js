import React, { Children, Component, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Row, Col } from 'react-native-responsive-grid-system';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import styled from "styled-components";
import { Spacer } from "../../components/spacer/spacer.component";

import {
  CategoryButton,
  CategoryCard,
  PageIndicators,
  ArrowContainer,
  ActiveCircle,
  DotCirle
} from "./ViewCarousalStyles"

let scrollYPos = 0;



export const ViewCarousal = ({ children, setFormNum }) => {

  const screnWidth = Dimensions.get('window').width

  const [screenHeight, setScreenHeight] = React.useState(100);
  const [activePage, setActivePage] = React.useState(1)
  const scroller = useRef();
  const [width, setWidth] = useState(screnWidth);
  const page = useRef(0);
  const indicatorRef = useRef(0);
  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);
  const [showFormCategories,setShowFormCategories] = React.useState(false);



  const getPagerIndicator = () => {
    let pageCount =Math.round( scrollViewWidth / screnWidth);
    
    return [...Array(pageCount)].map((elementInArray, index) => {
      return activePage && (index + 1) == activePage ? <ActiveCircle key={index}  onLongPress={()=>{setShowFormCategories(true)}} onPress={() => { onIndicatorPress(index) }}  /> : <DotCirle key={index} onPress={() => { onIndicatorPress(index) }} onLongPress={()=>{setShowFormCategories(true)}} />

    })
  }

  const onIndicatorPress = (index) => {
    setActivePage(index + 1)
    scrollToPage(index)
    setFormNum(index)
  }


  let scrollRight = () => {
    if (page.current < 5) {
      page.current = page.current + 1;
      scrollYPos = width * page.current;
      scroller.current.scrollTo({ x: scrollYPos, y: 0 });
      setActivePage(page.current + 1)
      setFormNum(page.current)
    }
    return
  }
  let scrollLeft = () => {
    if (scrollYPos > 0) {
      page.current = page.current;
      scrollYPos = scrollYPos - width;
      scroller.current.scrollTo({ x: scrollYPos, y: 0 });
      page.current = page.current - 1;
      setActivePage(page.current + 1)
      setFormNum(page.current)
    }
    return
  }
  let scrollToTop = () => {
    scroller.current.scrollTo({ x: 0, y: 0 });
  }
  const scrollToPage = (pageIndicator) => {

    scrollYPos = screnWidth * pageIndicator
    page.current = pageIndicator;
    scroller.current.scrollTo({ x: scrollYPos, y: 0 });

  }

const setSelectedCategory= (pageNum) =>{
  scrollToPage(pageNum);
  setShowFormCategories(false);
  setFormNum(pageNum)

}


// onIndicatorsLongPress = () =>{

// }


const onCatogryCardPress = (pNum)=>{
  setSelectedCategory(pNum);
  setActivePage(pNum+1)
}

const showCategoryCard = () =>{
  return<>
              <CategoryCard>
              <Row>
              <CategoryButton onPress={()=>{onCatogryCardPress(0)}}><Text>Rooms</Text></CategoryButton>
              <CategoryButton onPress={()=>{onCatogryCardPress(1)}}><Text>General Rental</Text></CategoryButton>
              <CategoryButton onPress={()=>{onCatogryCardPress(2)}}><Text>Pools</Text></CategoryButton>
              <CategoryButton onPress={()=>{onCatogryCardPress(3)}}><Text>Exterior</Text></CategoryButton>
              <CategoryButton onPress={()=>{onCatogryCardPress(4)}}><Text>Interior</Text></CategoryButton>
              <CategoryButton onPress={()=>{onCatogryCardPress(5)}}><Text>Mechanical, Electrical and Plumbing Systems</Text></CategoryButton>
              </Row>
            </CategoryCard>
  </>
}


  return (<>
    <View >
    { showFormCategories && showCategoryCard()}
      <Row>
        <Col xs="2" md="2">
          <ArrowContainer  >
            <Icon onPress={(page) => { scrollLeft() }} name="arrow-left" size={20} color="black" />
          </ArrowContainer>
        </Col>
        <Col xs="8" md="8" >
          <PageIndicators onLongPress={()=>{setShowFormCategories(true)}} delayLongPress={100}>
            <Row>
              {getPagerIndicator()}
            </Row>
          </PageIndicators>
        </Col>
        <Col xs="2" md="2">
          <ArrowContainer >
            <Icon onPress={() => { scrollRight() }} name="arrow-right" size={20} color="black" />
          </ArrowContainer>
        </Col>
      </Row>
    </View>


    <Row>
      <ScrollView style={styles.container} ref={scroller} horizontal={true} 
        onContentSizeChange={width =>setScrollViewWidth(width)}>

        {children}

      </ScrollView>
    </Row>
  </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10
  },
  screen: {
    backgroundColor: 'yellow',
    flexDirection: 'column',
    height: Dimensions.get('window').width,
    justifyContent: 'center'
  },
  screenA: {
    backgroundColor: '#F7CAC9',
  },
  screenB: {
    backgroundColor: '#92A8D1',
  },
  screenC: {
    backgroundColor: '#88B04B',
  },
  letter: {
    color: '#000',
    fontSize: 60,
    textAlign: 'center'
  },
  scrollButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 40,
    marginTop: 50,
    width: Dimensions.get('window').width,
  },
  scrollButtonText: {
    padding: 20,
    textAlign: 'center',
  },
});