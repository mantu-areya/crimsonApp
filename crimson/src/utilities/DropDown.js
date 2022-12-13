import React, { useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const Dropdown= ({ label, data, callBack,children,selectKey }) => {
  const DropdownButton = useRef();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState(null);

  const toggleDropdown = () => {
    isCollapsed ? setIsCollapsed(false) : setIsCollapsed(true);
  };

  const onItemPress = (item)=> {
    setSelected(item);
     callBack(selectKey,item.value);
    setIsCollapsed(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}  onPress={() => onItemPress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <>
       <Collapsible collapsed={isCollapsed}  >
         <TouchableOpacity
          onPress={() => setIsCollapsed(true)}
        >
          <View style={styles.flatList} >
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              />
          </View>
        </TouchableOpacity>
      </Collapsible>
      </>
    );
  };

  return (
    <>
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={()=>toggleDropdown()}

    >
      <Text style={styles.buttonText}>
        {(!!selected && selected.label) || label}
      </Text>
      <Icon style={styles.icon} size={25} name={`${isCollapsed?"keyboard-arrow-down":"keyboard-arrow-up"}`} />
    </TouchableOpacity>
          {renderDropdown()}
          </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    height: 35,
    zIndex: 1,
    borderRadius:5,
    borderWidth:.5,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  flatList:{
    backgroundColor: '#AEAEAE',
    borderRadius:5,

  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '40%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    alignItems: 'center',
    paddingVertical: 5,
    // borderWidth: 1,
  },
  
});

export default Dropdown;