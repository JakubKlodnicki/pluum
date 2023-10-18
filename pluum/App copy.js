import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image, TouchableOpacity } from 'react-native';
import { createClient } from "@supabase/supabase-js";
import React, { FC, ReactElement, useState } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");


  const supabaseUrl = 'https://wnptybnjuixwjfuugzac.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducHR5Ym5qdWl4d2pmdXVnemFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NzQ0NDEwNCwiZXhwIjoyMDEzMDIwMTA0fQ.eSOzMTEyADa6NXOEI3Ba0wMe4U-K5u3gTrIDlq9oHXw'
  const supabase = createClient(supabaseUrl, supabaseKey)


 const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSaveData = async () => {
    try {
      // Use the Supabase client to save data to your database
      const { data, error } = await supabase
        .from('your_table_name')
        .upsert([
          {
            column1: inputValue, // Replace with your column names
          },
        ]);

      if (error) {
        console.error('Error saving data:', error);
      } else {
        console.log('Data saved successfully:', data);
        setInputValue(''); // Clear the input field after saving
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  return (
    <><View style={styles.container}>
      <Image style={styles.logo} source={require('./assets/icon.png')} />
    </View><View style={styles.container2}>
        <TextInput
          style={styles.input}
          textAlign="center"
          value={inputValue}
          onChangeText={handleInputChange}
          // value={username}
          placeholder={"Username"}
          // onChangeText={(text) => setUsername(text)}
          autoCapitalize={"none"} />
        <TextInput
          style={styles.input}
          textAlign="center"
          value={mail}
          placeholder={"Email"}
          onChangeText={(text) => setMail(text)}
          autoCapitalize={"none"} />
        <TextInput
          style={styles.input}
          textAlign="center"
          value={password}
          placeholder={"Password"}
          secureTextEntry
          onChangeText={(text) => setPassword(text)} />
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSaveData}>
          <Text style={styles.buttonText} >Sign Up</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View></>
  );
}
const styles = StyleSheet.create({
  container2: {
    flex: 1,
    backgroundColor: '#3535ce',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  container: {
    backgroundColor: '#3535ce',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 200,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  logo: {
    width: 300,
    height: 300,
  },
  buttonContainer: {
    backgroundColor: 'blue',
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
