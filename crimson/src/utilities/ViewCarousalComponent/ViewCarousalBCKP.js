
// import React, { useEffect, useState, useRef } from 'react'
// import { ScrollView,Text,View, Dimensions, StyleSheet} from 'react-native'


// export const ViewCarousal = ({ children,width,hideIndicators,indicatorSize,indicatorSpace,indicatorAtBottom,indicatorOffset,indicatorColor,inactiveIndicatorColor,indicatorText,inactiveIndicatorText }) => {

//   // const [activePage,setActivepage] = useState(0);

//   useEffect(()=> {
//     if (initialPage > 0) {
//       refs.pager.scrollToPage(this.props.initialPage, false);
//     }

//     // if (this.props.animate && this.props.children){
//     //     this._setUpTimer();
//     // }
//   })


// const scrollView = useRef()

//   function getWidth(){
//     if (width !== null) {
//       return width;
//     } else {
//       return Dimensions.get('window').width;
//     }
//   }


//   function animateNextPage() {
//     if (activePage < children.length - 1) {
//         activePage = activePage + 1;
//     } else if (!this.props.loop) {
//         return;
//     }

//     indicatorPressed(activePage);
//     // setUpTimer();
//  }

//  function indicatorPressed  (activePage) {
//   // setActivepage({activePage});
//   // this.refs.pager.scrollToPage(activePage);
// }

//   function renderPageIndicator() {
//     if (hideIndicators === true) {
//       return null;
//     }

//     var indicators = [],
//         indicatorStyle = indicatorAtBottom ? { bottom: indicatorOffset } : { top: indicatorOffset },
//         style, position;

//     // position = {
//     //   width: children.length * indicatorSpace,
//     // };
//     // position.left = (getWidth() - position.width) / 2;

//     for (var i = 0, l = children.length; i < l; i++) {
//       if (typeof children[i] === "undefined") {
//         continue;
//       }
// let activePage=0
//       style = i === activePage ? { color: indicatorColor } : { color: inactiveIndicatorColor };
//       indicators.push(
//          <Text
//             style={[style, { fontSize: indicatorSize }]}
//             key={i}
//             onPress={indicatorPressed(i)}
//           >
//              { i === activePage  ? indicatorText : inactiveIndicatorText }
//              *
//           </Text>
//       );
//     }

//     if (indicators.length === 1) {
//       return null;
//     }

//     return (
//       <View style={[styles.pageIndicator, position, indicatorStyle]}>
//         {indicators}
//       </View>
//     );
//   }




//   return <><ScrollView
//     horizontal={true}
//     width={getWidth()}
//     height={500}
//     pagingEnabled={true}
//     ref={scrollView}


//   >

// {children}

//   </ScrollView>
//   {renderPageIndicator()}

//   </>


// }


// var styles = StyleSheet.create({
//   pageIndicator: {
//     // position: 'absolute',
//     flexDirection: 'row',
//     flex: 1,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     alignSelf: 'center',
//     backgroundColor:'red',
//   },
// });