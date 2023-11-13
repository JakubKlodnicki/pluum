import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Button as RNButton, Text, TouchableOpacity, Image } from 'react-native';
import { Session } from '@supabase/supabase-js';



interface AccountSwitcherProps {
  session: Session;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
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
    setShowProfile(true);
  };

  const handleHomeButtonClick = () => {
    setShowProfile(false);
  };

  return (
    <View style={styles.container}>
      {showProfile ? (
        <View>
          <Text>MAIN PAGE</Text>
        </View>
      ) : (
        <View>
          <Text>This is your profile</Text>
          <RNButton title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
      )}
      <View>
      <View>
        <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleProfileButtonClick}>
          <Image source={require('../assets/home.png')} style={styles.logoImage} />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleHomeButtonClick}>
          <Image source={require('../assets/profile.png')} style={styles.logoImage} />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
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
