import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import React, { FC, ReactElement, useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <><View style={styles.container}>
      <Image style={styles.logo} source={require('./assets/icon.png')} />
    </View><View style={styles.container2}>
        <TextInput
          style={styles.input}
          value={username}
          placeholder={"Username"}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize={"none"} />
        <TextInput
          style={styles.input}
          value={password}
          placeholder={"Password"}
          secureTextEntry
          onChangeText={(text) => setPassword(text)} />
        <Button style={styles.button} title={"Sign Up"} onPress={() => { } } />
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
  input:placeholder {
    alignItems: 'center',
  }
  logo: {
    width: 300,
    height: 300,
  },
  button: {
    color: '#fff',
  }
});
