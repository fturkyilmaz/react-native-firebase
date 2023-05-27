import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Image,
  TextInput,
  useColorScheme,
  View,
  Button,
  ActivityIndicator,
  Platform,
} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {useForm, Controller, SubmitErrorHandler} from 'react-hook-form';

import database from '@react-native-firebase/database';

export default function App() {
  // Set an initializing state whilst Firebase connects

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: 'furkan.turkyilmaz@gmail.com',
      password: 'furkanTurkyilmaz!',
    },
  });

  const formValues = getValues();

  const onSubmit = data => console.log(data);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const isDarkMode = useColorScheme() === 'dark';

  // const [form, setForm] = useState({
  //   username: 'furkan.turkyilmaz@gmail.com',
  //   password: 'furkanTurkyilmaz!',
  // });

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.black : Colors.white,
    marginHorizontal: 10,
  };

  const signIn = async () => {
    auth()
      .signInWithEmailAndPassword(formValues.username, formValues.password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const signUp = async () => {
    auth()
      .createUserWithEmailAndPassword(formValues.username, formValues.password)
      .then(() => {
        console.log('User account created & signed in! ');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const logout = async () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const updateProfile = async () => {
    const update = {
      displayName: 'Furkan Türkyılmaz',
      photoURL:
        'https://media.licdn.com/dms/image/D4D03AQGJo0xi3-pMNw/profile-displayphoto-shrink_200_200/0/1684779461619?e=1690416000&v=beta&t=9W9enYlpBUo8axx5dzxp41HUWe2HTOylnU7Ij7wayJk',
    };

    await auth().currentUser?.updateProfile(update);
  };

  // const onChangeText = (key: string, text: string) => {
  //   setForm({...form, [key]: text});
  // };

  function onAuthStateChanged(userAuth: FirebaseAuthTypes.User | null) {
    setUser(userAuth);

    if (loading) {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  React.useEffect(() => {
    console.log('Login success ', user);
  }, [user]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (user) {
    return (
      <SafeAreaView style={backgroundStyle}>
        <View style={{justifyContent: 'center', alignItems: 'center', gap: 10}}>
          <Image
            source={{uri: user?.photoURL}}
            style={{width: 100, height: 100}}
          />
          <Text>{user.displayName}</Text>

          <Text>
            Welcome {user.uid} {user.email}
          </Text>
        </View>
        <Button title="Logout" onPress={logout} />
        <Button title="Update Profile" onPress={updateProfile} />
      </SafeAreaView>
    );
  }

  function checkDb(): void {
    const reference = database().ref();

    reference
      .once('value')
      .then(snapshot => {
        console.log(snapshot.val());
      })
      .catch(() => {});
  }

  function setDb(): void {
    const reference = database().ref('profile/linkedin');

    reference.set({
      linkedin: 'https://linkedin.com/furkan',
      displayName: 'Furkan Türkyılmaz',
      photoURL:
        'https://media.licdn.com/dms/image/D4D03AQGJo0xi3-pMNw/profile-displayphoto-shrink_200_200/0/1684779461619?e=1690416000&v=beta&t=9W9enYlpBUo8axx5dzxp41HUWe2HTOylnU7Ij7wayJk',
    });
  }

  function updateDb(): void {
    const reference = database().ref('profile/linkedin');

    reference.update({
      linkedin: 'https://www.linkedin.com/in/enverturkyilmaz/',
      displayName: 'Enver Türkyılmaz',
      photoURL:
        'https://media.licdn.com/dms/image/D4D03AQGJo0xi3-pMNw/profile-displayphoto-shrink_200_200/0/1684779461619?e=1690416000&v=beta&t=9W9enYlpBUo8axx5dzxp41HUWe2HTOylnU7Ij7wayJk',
    });
  }

  function pushDb(): void {
    const reference = database().ref('profile/linkedin');

    reference.push({
      linkedin: 'https://www.linkedin.com/in/enverturkyilmaz/',
      displayName: 'Enver Türkyılmaz',
      photoURL:
        'https://media.licdn.com/dms/image/D4D03AQGJo0xi3-pMNw/profile-displayphoto-shrink_200_200/0/1684779461619?e=1690416000&v=beta&t=9W9enYlpBUo8axx5dzxp41HUWe2HTOylnU7Ij7wayJk',
    });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            flex: 1,
          }}>
          <Image
            source={{
              uri: 'https://miro.medium.com/v2/resize:fit:720/format:webp/0*pHgV6Dt-ZuT560ir.png',
            }}
            style={{width: '100%', height: 150, marginVertical: 40}}
            resizeMethod="scale"
            resizeMode="contain"
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            Username
          </Text>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Bu alan zorunludur!',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: isDarkMode ? Colors.white : Colors.black,
                  },
                ]}
                placeholder="First name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="username"
          />
          {errors.username && (
            <Text style={styles.errorMessage}>This is required.</Text>
          )}
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isDarkMode ? Colors.white : Colors.black,
              },
            ]}>
            Password
          </Text>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Bu alan zorunludur!',
              },
              maxLength: {
                value: 20,
                message: 'Şifre Alanı 20 karakterden büyük olamaz',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: isDarkMode ? Colors.white : Colors.black,
                  },
                ]}
                placeholder="Şifre"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.errorMessage}>{errors?.password?.message}</Text>
          )}
          <View
            style={{
              flexDirection: 'row',
              gap: Platform.OS === 'android' ? 10 : 0,
            }}>
            <Button title="Submit" onPress={handleSubmit(signIn)} />
            <Button title="Sign In" onPress={handleSubmit(signIn)} />
            <Button title="Register" onPress={handleSubmit(signUp)} />
            <Button title="Push Db" onPress={pushDb} />
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: Platform.OS === 'android' ? 10 : 0,
            }}>
            <Button title="Check Db" onPress={checkDb} />
            <Button title="Set Db" onPress={setDb} />
            <Button title="Update Db" onPress={updateDb} />
          </View>
          {/* <Button title="Logout" onPress={logout} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    fontSize: 12,

    fontWeight: '700',
  },
  errorDescription: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '500',
  },
  textInput: {
    padding: 15,
    marginVertical: 15,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
