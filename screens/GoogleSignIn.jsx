import {
    StyleSheet,
    Text,
    SafeAreaView,
    Pressable,
    Alert
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
  import auth from '@react-native-firebase/auth';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { useNavigation } from '@react-navigation/native';
  import messaging from '@react-native-firebase/messaging';

  const GoogleSignupScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const configureGoogleSignIn = async () => {
        try {
          GoogleSignin.configure({
            webClientId: '79789709678-h8l4q974qond59njvc43o77oemmqjm4n.apps.googleusercontent.com',
            offlineAccess: true,
            forceCodeForRefreshToken: true,
            scopes: [
              'profile', 
              'email',
              'https://www.googleapis.com/auth/calendar',
              'https://www.googleapis.com/auth/calendar.events'
            ],
          });
        } catch (error) {
          console.error('Google Sign-In Configuration Error:', error);
        }
      };
      configureGoogleSignIn();
    }, []);
  
    const handleGoogleLogin = async () => {
      setLoading(true);
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        console.log(userInfo)
        console.log(tokens);
        // Firebase Authentication
        const googleCredential = auth.GoogleAuthProvider.credential(tokens.idToken);
        await auth().signInWithCredential(googleCredential);
        const fcm =await getToken();
        // Prepare Payload with serverAuthCode
        const signupPayload = {
          name: userInfo.data.user.name,
          email: userInfo.data.user.email,
          photo: userInfo.data.user.photo,
          googleId: userInfo.data.user.id,
          idToken: userInfo.idToken,
          serverAuthCode: userInfo.data.serverAuthCode,
          fcm // This is the key!
        };
        const response = await axios.post(
          'https://expertgo-v1.onrender.com/user/auth/google/signup',
          signupPayload, 
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        console.warn(response.data.user.googleId, "googleId")
        await AsyncStorage.setItem("userId", response.data.user._id);
        await AsyncStorage.setItem("email", response.data.user.email);
        await AsyncStorage.setItem("userRole", response.data.user.role);
        await AsyncStorage.setItem("name", response.data.user.name);

        
      await AsyncStorage.setItem('googleId' , response.data.user.googleId);
        // Store Token
        // await AsyncStorage.setItem('authToken', response.data.token);
        Alert.alert('Success', 'Successfully signed in!');
        navigation.replace("MainTabs")
      } catch (error) {
        console.error('Detailed Login Error:', error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleError = (error) => {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play services not available');
      } else {
        console.log(error.message)
        Alert.alert('Login Error', `An error occurred: ${error.message}`);
      }
    };
    const getToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        console.warn("FCM Token of Expert:", fcmToken);
        return fcmToken;
      } catch (error) {
        console.error("Error fetching FCM Token:", error);
        return null;
      }
    };
    return (
      <SafeAreaView style={styles.container}>
        <Pressable 
          onPress={handleGoogleLogin} 
          style={styles.button}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing In...' : 'Sign Up With Google'}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      padding: 15,
      backgroundColor: '#4285F4',
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  export default GoogleSignupScreen;
  