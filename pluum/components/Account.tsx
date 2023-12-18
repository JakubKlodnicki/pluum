import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Button as RNButton, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Session } from '@supabase/supabase-js';

interface AccountSwitcherProps {
  session: Session;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showProfile, setShowProfile] = useState<number | null>(1);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, description, avatar_url`)
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || '');
        setDescription(data.description || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleProfileButtonClick = () => {
    setShowProfile(1);
  };

  const handleHomeButtonClick = () => {
    setShowProfile(2);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      console.log(session.user.id);
      console.log(username);
      console.log(description);
      
      const { data, error } = await supabase
        .from('posty')
        .upsert([{ 
          username,
          description,
        }]);
    
      if (error) {
        console.error('Upsert error:', error); // Zaloguj błąd
        throw error;
      }
    
      console.log('Upserted data:', data);
    
      Alert.alert('Profile updated successfully!');
      getProfile();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleThirdButtonClick = () => {
    setShowProfile(null); // Ustawienie stanu na null dla trzeciego widoku
  };
  
  return (
    <View style={styles.container}>
      {showProfile === 1 ? (
        <View>
          <Text>Main Page</Text>
          {/* Tu znajduje się zawartość dla pierwszego widoku */}
        </View>
      ) : showProfile === 2 ? (
        <View>
          <Text>This is your profile</Text>
          <RNButton title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add post</Text>
          </TouchableOpacity>
        </View>
      )}
      <View>
        <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleProfileButtonClick}>
          <Image source={require('../assets/home.png')} style={styles.logoImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleHomeButtonClick}>
          <Image source={require('../assets/profile.png')} style={styles.logoImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleThirdButtonClick}>
          {/* Tutaj możesz dodać ikonę lub tekst dla trzeciego przycisku */}
          <Text>Third</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: 'white',
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    top: 200,
  },
  buttonContainerIcon: {
    width: 200,
    padding: 10,
    alignItems: 'center',
    top: 200,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  logoImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
});

export default AccountSwitcher;
