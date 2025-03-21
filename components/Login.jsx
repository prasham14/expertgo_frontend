import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity,ActivityIndicator, Alert, Image, Modal, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import img from './images/logo.jpeg';
import styles from "./styles/Login";
import Ionicons from "react-native-vector-icons/Ionicons";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [storedOtp, setStoredOtp] = useState(null);
    const [otpExpired, setOtpExpired] = useState(false);
    const [timer, setTimer] = useState(60);
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and Password are required!");
            return;
        }

        try {
            const response = await axios.post("http://10.0.2.2:3000/user/login", { email, password });
            if (response.data.message === "Login successful") {
                await AsyncStorage.setItem("userId", response.data.userId);
                await AsyncStorage.setItem("email", response.data.email);
                const userRole = response.data.userRole;
                console.warn(userRole)
                if (userRole === '') {
                    setRoleModalVisible(true);
                } else {
                    await AsyncStorage.setItem('userRole',userRole)
                    
                    navigation.replace("MainTabs"); 
                }
            } else {
                Alert.alert("Error", "Wrong email or password");
            }

        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error", error.response?.data?.message || "Something went wrong");
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Email is required!");
            return;
        }
        setLoading(true); // Start loading

        let OTP = Math.floor(1000 + Math.random() * 9000);
        setStoredOtp(OTP);
        setTimer(60);
        setOtpExpired(false);

        try {
            await axios.get(`http://10.0.2.2:3000/user/verify-login-otp/${email}/${OTP}`);
            setOtpSent(true);
            setOtpModalVisible(true);
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Invalid Email Address");
        }
        finally{
            setLoading(false); // Stop loading when request completes

        }
    };

    const handleVerifyOtp = async () => {
        if (otpExpired) {
            Alert.alert("Error", "OTP has expired. Please request a new one.");
            return;
        }
        try {
            const response = await axios.post("http://10.0.2.2:3000/user/verify-otp", { email, otp });
            if (response.data.success) {
                setOtpModalVisible(false);
                navigation.navigate("ChangePassword", { userEmail: email });
            } else {
                Alert.alert("Error", "Incorrect OTP. Try again.");
            }
        } catch (error) {
            Alert.alert("Error", "Verification failed. Try again.");
        }
    };

    const selectUserRole = async (role) => {
        try{
          const userId = await AsyncStorage.getItem("userId");

          if (!userId) {
            Alert.alert("Error", "User ID not found. Please log in again.");
            setLoading(false);
            return;
          }
              const requestBody = { role: role };
          const response = await fetch(`http://10.0.2.2:3000/user/setRole/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });
    
          const data = await response.json();
          if (response.ok) {
            await AsyncStorage.setItem("userRole", role);
            navigation.navigate("MainTabs");
          } else {
            Alert.alert("Error", data.message || "Failed to update role");
          }
        } catch (error) {
          console.error("Error updating role:", error);
          Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
        setRoleModalVisible(false);
        navigation.navigate("Home"); // Navigate after selecting role
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Top Banner */}
            <View style={styles.topBanner}>
                <Text style={styles.topBannerText}>Welcome to Expertgo!</Text>
                <Text style={styles.topBannerSubText}>Start your journey with us today.</Text>
            </View>

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image source={img} style={styles.logo} resizeMode="contain" />
            </View>

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
                secureTextEntry = {!showPassword}
            /> 
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#333" />
        </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
    {loading ? (
        <ActivityIndicator size="small" color="#000000" />
    ) : (
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
    )}
</TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.signupText}>
                Don't have an account?{" "}
                <Text style={styles.signupLink} onPress={() => navigation.replace("Signup")}>
                    Sign Up
                </Text>
            </Text>

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
                        <Text style={styles.timerText}>{otpExpired ? "OTP Expired" : `OTP expires in: ${timer}s`}</Text>

                        {!otpExpired ? (
                            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
                                <Text style={styles.buttonText}>Verify OTP</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.resendButton} onPress={handleForgotPassword}>
                                <Text style={styles.buttonText}>Resend OTP</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* User Role Selection Modal */}
            <Modal visible={roleModalVisible} animationType="fade" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Why ExpertGo?</Text>
                        <TouchableOpacity style={styles.roleButton} onPress={() => selectUserRole("user")}>
                            <Text style={styles.buttonText}>To Seek Help</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roleButton} onPress={() => selectUserRole("expert")}>
                            <Text style={styles.buttonText}>To Help & Earn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoginScreen;
