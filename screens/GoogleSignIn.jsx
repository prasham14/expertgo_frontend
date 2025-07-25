import {
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const GoogleSignupScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        GoogleSignin.configure({
          webClientId:
            '79789709678-h8l4q974qond59njvc43o77oemmqjm4n.apps.googleusercontent.com',
          offlineAccess: true,
          forceCodeForRefreshToken: true,
          scopes: [
            'profile',
            'email',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
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
      console.log(userInfo);
      console.log(tokens);
      // Firebase Authentication
      const googleCredential = auth.GoogleAuthProvider.credential(
        tokens.idToken,
      );
      await auth().signInWithCredential(googleCredential);
      const fcm = await getToken();
      // Prepare Payload with serverAuthCode
      const signupPayload = {
        name: userInfo.data.user.name,
        email: userInfo.data.user.email,
        photo: userInfo.data.user.photo,
        googleId: userInfo.data.user.id,
        idToken: userInfo.idToken,
        serverAuthCode: userInfo.data.serverAuthCode,
        fcm,
      };
      const response = await axios.post(
        'https://expertgo-v1.onrender.com/user/auth/google/signup',
        signupPayload,
        {headers: {'Content-Type': 'application/json'}},
      );

      console.warn(response.data.user.googleId, 'googleId');
      await AsyncStorage.setItem('userId', response.data.user._id);
      await AsyncStorage.setItem('email', response.data.user.email);
      await AsyncStorage.setItem('userRole', response.data.user.role);
      await AsyncStorage.setItem('name', response.data.user.name);

      await AsyncStorage.setItem('googleId', response.data.user.googleId);

      Alert.alert('Success', 'Successfully signed in!');
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Detailed Login Error:', error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = error => {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      Alert.alert('Cancelled', 'Sign-in was cancelled');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      Alert.alert('In Progress', 'Sign-in is already in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert('Error', 'Google Play services not available');
    } else {
      console.log(error.message);
      Alert.alert('Login Error', `An error occurred: ${error.message}`);
    }
  };

  const getToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.warn('FCM Token of Expert:', fcmToken);
      return fcmToken;
    } catch (error) {
      console.error('Error fetching FCM Token:', error);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient Effect */}
      <View style={styles.backgroundGradient} />

      {/* Decorative Circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Logo/Icon Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>EG</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to ExpertGo</Text>
          <Text style={styles.welcomeSubtitle}>
            Connect with experts and grow your knowledge
          </Text>
        </View>

        {/* Sign Up Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={handleGoogleLogin}
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>Signing In...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={26} />
                </View>
                <Text style={styles.buttonText}>Sign Up With Google</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="calendar-outline" size={24} color="#4f46e5" />
            </View>
            <Text style={styles.featureText}>Sessions</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#4f46e5"
              />
            </View>
            <Text style={styles.featureText}>Earnings</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="people-outline" size={24} color="#4f46e5" />
            </View>
            <Text style={styles.featureText}>Experts</Text>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('TnC')}>
            <Text style={styles.footerText}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#4267b2',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  circle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    position: 'absolute',
    top: 100,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  circle3: {
    position: 'absolute',
    bottom: 200,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4267b2',
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 60,
  },
  button: {
    backgroundColor: '#F0F0F2',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  googleIcon: {
    color: '#fff',
    fontSize: 100,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#1f2937',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  featureText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
     textDecorationLine: 'underline',
  },
});

export default GoogleSignupScreen;
