// ReportCardScreen.js

import React,{useLayoutEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Button } from 'react-native';
import CustomHeader from "../components/CustomHeader";
const ReportCardScreen = ({ route, navigation }) => {
  const { totalScore, labScore, diagnosisScore,username } = route.params;


 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeader username={username} />,
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Text style={styles.headerRightText}>Score: {totalScore}</Text>
        </View>
      ),
    });
  }, [navigation, username, totalScore]);
  return (
    <View style={styles.container}>
      <Text style={styles.total}>Total Score: {labScore+diagnosisScore}</Text>
      <Text>Lab Score: {labScore}</Text>
      <Text>Diagnosis Score: {diagnosisScore}</Text>

     
   

      <Button
        title="Next Patient"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  total:{
    fontSize: 30,
  }
});

export default ReportCardScreen;
