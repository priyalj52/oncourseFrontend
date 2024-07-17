// CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = ({ username }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{username}</Text>
      {/* <Text style={styles.headerText}>Score: {score}/10</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display:"flex",
    width:"100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
