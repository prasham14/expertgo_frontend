import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";

const ChangePassword = ({ navigation, route}) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { userEmail } = route.params; 
    const email = userEmail;
    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Both fields are required");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const response = await axios.patch(`http://10.0.2.2:3000/user/changepassword/${email}`, {
                newPassword
            });
            Alert.alert("Success", response.data.message || "Password changed successfully!");
            navigation.navigate("Login");
        } catch (error) {
            console.error("Change Password Error:", error);
            Alert.alert("Error", error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>
            <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "90%",
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    changeButton: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});