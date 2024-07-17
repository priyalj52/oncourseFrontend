// ReportCardScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Button } from 'react-native';

const ReportCardScreen = ({ route, navigation }) => {
  const { totalScore, labScore, diagnosisScore } = route.params;

  return (
    <View style={styles.container}>
      <Text>Total Score: {totalScore}</Text>
      <Text>Lab Score: {labScore}</Text>
      <Text>Diagnosis Score: {diagnosisScore}</Text>

     
   

      <Button
        title="Next Patient"
        onPress={() => navigation.navigate('Chat')}
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
});

export default ReportCardScreen;
