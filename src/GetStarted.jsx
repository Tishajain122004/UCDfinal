import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";


const GetStarted = ({navigation}) => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.heading}>Welcome to Study Buddy</Text>
      <Text style={styles.subtitle}>
        Your personal study companion to help you focus and learn efficiently.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 220,
    height: 150,
    marginBottom: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8A2BE2",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
