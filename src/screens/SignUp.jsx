import React,{useState} from "react";

import {View,Text,  StyleSheet,ToucjableOpacity,Image, TextInput, TouchableOpacity,ScrollView,} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons";


const SignUp=()=>{


    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
   

    const handleSignUp = ()=>{
        console.log("name :",name);
        console.log("email : ",email);
    };
    return(
       <ScrollView contentContainerStyle={styles.scrollContainer}>
           
            <View style={styles.inputbox}>
 <Text style={styles.heading}>Create Account</Text>




 
            <TextInput  
            
            style={styles.input}
            placeholder = "Full Name"
            placeholderTextColor={"#888"}
            value = {name}
            onChangeText={setName}
            />
            <TextInput
            style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
       <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style = {styles.button}>
        <Text style = {styles.buttonText} onPress={handleSignUp}>SignUp</Text>
      </TouchableOpacity>
 <Text style={styles.orText}>────────  or  ────────</Text>
      <TouchableOpacity>
        <Text style={{color:"#bf9ae0ff", marginTop:7,marginBottom:20}}>Already have an account? Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={() => console.log("Google Sign In")}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>


    

</View>

        </ScrollView>
    )
}
export default SignUp;
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
   orText: {
    color: "#aaa",
    marginVertical: 15,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#b671f7ff",
    textAlign: "center", // ✅ "Topcenter" replace with valid "center"
    marginBottom: 20,    // ✅ "auto" not allowed, use number
  },
  inputbox: {
    width: "90%",
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 15, // ✅ no "px", just number
  },
  button: {
    backgroundColor: "#8A2BE2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleButtonText: {
    
    fontSize: 16,
    fontWeight: "600",
  },
});

