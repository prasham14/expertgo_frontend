import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, 
  TouchableOpacity, 
  Alert, 
  Modal,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import img from '../components/images/logo.jpeg'
import styles from "../components/styles/Signup";
import messaging from '@react-native-firebase/messaging';
const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [storedOtp, setStoredOtp] = useState(null);
    const [otpExpired, setOtpExpired] = useState(false);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timer === 0) {
            setOtpExpired(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const sendOtp = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "All fields are required!");
            return;
        }
        setLoading(true); // Start loading

        let OTP = Math.floor(1000 + Math.random() * 9000);
        setStoredOtp(OTP);
        setTimer(60);
        setOtpExpired(false);

        try {
            const response = await axios.get(`http://10.0.2.2:3000/user/verify/${email}/${OTP}`);
            setOtpSent(true);
            setOtpModalVisible(true);
        } catch (error) {
            if (error.response && error.response.data.message) {
                Alert.alert("Error", error.response.data.message);
            } else {
                Alert.alert("Error", "Invalid Email Address");
            }
        }
        finally{
            setLoading(false); // Stop loading when request completes

        }
    };

    const verifyOtp = async () => {
        if (otpExpired) {
            Alert.alert("Error", "OTP has expired. Please request a new one.");
            return;
        }
        try {
            const fcm =await getToken();
            const response = await axios.post("http://10.0.2.2:3000/user/verify-otp", { email, otp });
            if (response.data.success) {
                setOtpModalVisible(false);

                await axios.post("http://10.0.2.2:3000/user/signup", { name, email, password ,fcm});
                Alert.alert("Success", "Account Created Successfully!");
                setOtpModalVisible(false);
                navigation.navigate("Login");
            } else {
                Alert.alert("Error", "Incorrect OTP. Try again.");
            }
        } catch (error) {
            Alert.alert("Error", "Verification failed. Try again.");
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
<ScrollView contentContainerStyle={styles.container}>
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />

    <View style={styles.topBanner}>
        <Text style={styles.topBannerText}>Welcome to Expertgo!</Text>
        <Text style={styles.topBannerSubText}>Start your journey with us today.</Text>
    </View>

    <View style={styles.logoContainer}>
        <Image 
            source={img}
            style={styles.logo}
            resizeMode="contain"
        />
    </View>
    
    <View style={styles.formContainer}>
        <TextInput 
            style={styles.input} 
            placeholder="Full Name" 
            value={name} 
            onChangeText={setName} 
        />
        <TextInput 
            style={styles.input} 
            placeholder="Email Address" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
        />
        <View style={styles.passwordContainer}>
            <TextInput
                style={styles.passinput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
            /> 
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#333" />
            </TouchableOpacity>
        </View>
    </View>

    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={sendOtp} disabled={loading}>
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.buttonText}>Sign up</Text>
            )}
        </TouchableOpacity>

        <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
        </View>

        <TouchableOpacity 
            style={styles.googleButton} 
            onPress={() =>navigation.navigate('Google')}
        >
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
    </View>

    {/* Login Link */}
    <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <Text 
            style={styles.loginLink} 
            onPress={() => navigation.replace("Login")}
        >
            Login here
        </Text>
    </View>

    {/* OTP Modal */}
    <Modal visible={otpModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter OTP</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                />
                <Text style={styles.timerText}>
                    {otpExpired ? "OTP Expired" : `OTP expires in: ${timer}s`}
                </Text>
                {!otpExpired ? (
                    <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.resendButton} onPress={sendOtp}>
                        <Text style={styles.buttonText}>Send again</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    </Modal>
</ScrollView>
    );
};
export default SignupScreen;
