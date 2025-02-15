import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/UserRole";
const UserRole = ({ navigation }) => {
  // State for role selection and loading indicator
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // "user" or "expert"

  const updateUserRole = async () => {
    if (!selectedRole) {
      Alert.alert("Error", "Please select a role.");
      return;
    }

    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      // Prepare the request body for updating the role
      const requestBody = { role: selectedRole };

      // Update role via PATCH to /user/setRole/:userId
      const response = await fetch(`http://10.0.2.2:3000/user/setRole/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userRole", selectedRole);
        Alert.alert("Success", `Role updated to ${selectedRole}`);
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Set StatusBar to white background with dark content */}
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header / Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>MyApp</Text>
      </View>

      {/* Main Title and Subtitle */}
      <Text style={styles.title}>Join Our Community</Text>
      <Text style={styles.subtitle}>How would you like to proceed?</Text>

      {/* Role Selection Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedRole === "user" && styles.optionButtonSelected,
          ]}
          onPress={() => setSelectedRole("user")}
        >
          <Text
            style={[
              styles.optionText,
              selectedRole === "user" && styles.optionTextSelected,
            ]}
          >
            I Need Help
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedRole === "expert" && styles.optionButtonSelected,
          ]}
          onPress={() => setSelectedRole("expert")}
        >
          <Text
            style={[
              styles.optionText,
              selectedRole === "expert" && styles.optionTextSelected,
            ]}
          >
            I Want to Help
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={updateUserRole}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UserRole;


