import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Button as RNButton, Text, TouchableOpacity, Image, TextInput, ScrollView, Button } from 'react-native';
import { Session } from '@supabase/supabase-js';

interface AccountSwitcherProps {
  session: Session;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [showProfile, setShowProfile] = useState<number | null>(1);
  const [mainPageData, setMainPageData] = useState('');
  const [mainPageData2, setMainPageData2] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }


  
  async function updateProfile({
    username,
  }: {
    username: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }


  const handleProfileButtonClick = () => {
    setShowProfile(1);
    fetchMainPageData();
  };

  const handleHomeButtonClick = () => {
    setShowProfile(2);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      console.log(session.user.id);
      console.log(description);
      
      const { data, error } = await supabase
        .from('posty')
        .upsert([{ 
          username: username,
          description,
        }]);
    
      if (error) {
        console.error('Upsert error:', error); // Zaloguj błąd
        throw error;
      }
    
      console.log('Upserted data:', data);
    
      Alert.alert('Profile added successfully!');
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


useEffect(() => {
  if (session) {
    fetchMainPageData();
  }
}, [session]);

async function fetchMainPageData() {
  try {
    const { data, error } = await supabase
      .from('posty')
      .select(`username, description`);

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Tworzymy parę użytkownik + opis i łączymy je z kilkoma nowymi liniami
      const formattedData = data
        .map(item => `${item.username}: ${item.description}`)
        .join('\n\n'); // Dodajemy dwie nowe linie pomiędzy każdą parą użytkownik + opis

      setMainPageData(formattedData);
    } else {
      setMainPageData('No usernames and descriptions found');
    }
  } catch (error) {
    console.error('Error fetching main page data:', error);
  }
}
return (
  <View style={styles.container}>
    <ScrollView style={styles.scrollContainer}>
      {showProfile === 1 ? (
        <View>
          <Text>{mainPageData2}{mainPageData}</Text>
          {/* Tu znajduje się zawartość dla pierwszego widoku */}
        </View>
      ) : showProfile === 2 ? (
        <View>
          <TextInput style={styles.input} value={session?.user?.email}/>
          <TextInput style={styles.input} value={username || ''} onChangeText={(text) => setUsername(text)} />
          <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username })}
          disabled={loading}
        />

          <RNButton title="Sign Out" onPress={() => supabase.auth.signOut()} />
        </View>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.input2}
            placeholder="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline={true}
            numberOfLines={15}
          />
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add post</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
    <View style={styles.bottomButtons}>
      <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleProfileButtonClick}>
        <Image source={require('../assets/home.png')} style={styles.logoImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleHomeButtonClick}>
        <Image source={require('../assets/profile.png')} style={styles.logoImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainerIcon} onPress={handleThirdButtonClick}>
        <Image source={require('../assets/add.png')} style={styles.logoImage} />
      </TouchableOpacity>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input2: {
    height: 200,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 3,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    backgroundColor: 'white',
    width: 200,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonContainerIcon: {
    width: 50,
    height: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
  logoImage: {
    width: 30,
    height: 30,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingBottom: 20,
    paddingTop: 10,
    marginLeft: 40,
  },
});


export default AccountSwitcher;
