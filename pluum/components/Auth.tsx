import React, { useState } from 'react'
import { Alert, StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/icon.png')} />
      <View style={[styles.verticallySpaced, styles.mt20]}>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        style={styles.input}
      />
      </View>
      <View style={styles.verticallySpaced}>
      <TextInput
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize="none"
        style={styles.input}
      />
      </View>
      <View>
        <TouchableOpacity style={styles.buttonContainer} onPress={signInWithEmail}>
          <Text style={styles.buttonText} >Sign In</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.buttonContainer} onPress={signUpWithEmail}>
          <Text style={styles.buttonText} >Sign Up</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3535ce',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  container2: {
    flex: 1,
    backgroundColor: '#3535ce',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 250,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 300,
  },
  buttonContainer: {
    backgroundColor: 'white',
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
})