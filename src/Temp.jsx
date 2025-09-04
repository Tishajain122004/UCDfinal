import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import img1 from './assets/image/img1.png';

const Temp = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('GetStarted'); // go to GetStarted after 3 sec
    }, 1500);

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <View style={styles.container}>
      <Image source={img1} style={styles.image} />
    </View>
  );
};

export default Temp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 150,
    transform: [
      { perspective: 1000 },
      { rotateY: "15deg" },
      { rotateX: "5deg" },
    ],
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
});
