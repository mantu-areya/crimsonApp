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

let scrollYPos = 0;

const DotCirle = styled(TouchableOpacity)`
height: 25px;
width: 25px;
background-color: #bbb;
border:1px #bbb;
border-radius: 50%;
display: inline-block;
margin-right:5px;
`;

const ActiveCircle = styled(TouchableOpacity)`
height: 25px;
width: 25px;
border:1px #bbb;
border-radius: 50%;
display: inline-block;
margin-right:5px;
`;

const ArrowContainer = styled.View`
  alignItems:center;
`;


const PageIndicators = styled(Pressable)`
  alignItems:center;
`;



export const ViewCarousal = ({ children,setModelView, localState1 }) => {

  const screnWidth = Dimensions.get('window').width

  const [screenHeight, setScreenHeight] = React.useState(100);
  const [activePage, setActivePage] = React.useState(1)
  const scroller = useRef();
  const [width, setWidth] = useState(screnWidth);
  const page = useRef(0);
  const indicatorRef = useRef(0);
  const [scrollViewWidth, setScrollViewWidth] = React.useState(0);



  const getPagerIndicator = () => {
    let pageCount = scrollViewWidth / screnWidth;
    return [...Array(pageCount)].map((elementInArray, index) => {
      return activePage && (index + 1) == activePage ? <ActiveCircle key={index}  onLongPress={()=>{setModelView(true)}} onPress={() => { onIndicatorPress(index) }} /> : <DotCirle key={index} onPress={() => { onIndicatorPress(index) }} onLongPress={()=>{setModelView(true)}} />

    })
  }

  const onIndicatorPress = (index) => {
    setActivePage(index + 1)
    scrollToPage(index)
  }


  let scrollRight = () => {
    if (page.current < 5) {
      page.current = page.current + 1;
      scrollYPos = width * page.current;
      scroller.current.scrollTo({ x: scrollYPos, y: 0 });
      setActivePage(page.current + 1)
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



// onIndicatorsLongPress = () =>{

// }


  useEffect(() => {
    setModelView(false)
    scrollToPage(localState1)
    console.log("state");
  }, [localState1])


  return (<>


    <View >
      <Row>
        <Col xs="2" >
          <ArrowContainer  >
            <Icon onPress={(page) => { scrollLeft() }} name="arrow-left" size={20} color="black" />
          </ArrowContainer>
        </Col>
        <Col xs="8"  >
          <PageIndicators onLongPress={()=>{setModelView(true)}}>
            <Row>
              {getPagerIndicator()}
            </Row>
          </PageIndicators>
        </Col>
        <Col xs="2" >
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