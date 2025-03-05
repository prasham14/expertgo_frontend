import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import styles from "./styles/Expert";
import messaging from '@react-native-firebase/messaging';

const Expert = ({ route }) => {
  const { isExpertsubmitted } = route.params;
  const navigation = useNavigation();
  const [videoCallCharge, setVideoCallCharge] = useState("");
  const [voiceCallCharge, setVoiceCallCharge] = useState("");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState([]);

  const addCategory = () => {
    if (category.trim() && !categories.includes(category.trim())) {
      setCategories([...categories, category.trim()]);
      setCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = async () => {
    // Validation
    if (
      (!isExpertsubmitted && !bio.trim()) ||
      (!isExpertsubmitted && categories.length === 0) ||
      (!isExpertsubmitted && !videoCallCharge.trim()) ||
      (!isExpertsubmitted && !voiceCallCharge.trim())
    ) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }
  
    try {
      const userId = await AsyncStorage.getItem("userId");
      const email = await AsyncStorage.getItem("email");
  
      if (!userId) {
        Alert.alert("Error", "Please login again.");
        return;
      }
  
      const requestBody = {
        email: email || "",
        bio: bio.trim(),
        category: categories, // Changed from categories to category
        charges: [
          parseFloat(videoCallCharge) || 0, 
          parseFloat(voiceCallCharge) || 0
        ], 
      };
  
      console.log("Submitting Data:", requestBody);
  
      const response = await axios.post(
        `http://10.0.2.2:3000/profile/createProfileExpert/${userId}`,
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (response.status === 201) {
        const fcmToken = await getToken();
        if (fcmToken) {
          await saveFCMToken(fcmToken, userId);
        }
        Alert.alert("Success", "Your profile is updated");
        navigation.navigate("MainTabs");
      } else {
        Alert.alert("Error", "Failed to save portfolio.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Alert.alert("Error", error.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {isExpertsubmitted ? (
        <Text style={styles.title}>Edit Your Expert Profile</Text>
      ) : (
        <Text style={styles.title}>Create Your Expert Profile</Text>
      )}

      {/* Category Input */}
      <View style={styles.categoryInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Category"
          value={category}
          onChangeText={setCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      
      {/* Category List */}
      <View style={styles.categoryListContainer}>
        {categories.map((item, index) => (
          <View key={index} style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{item}</Text>
            <TouchableOpacity onPress={() => removeCategory(item)}>
              <Text style={styles.categoryChipRemove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Video Call Charge Input */}
      <TextInput
        style={styles.input}
        placeholder="Video Call Charge for 10 minutes (₹)"
        value={videoCallCharge}
        onChangeText={setVideoCallCharge}
        keyboardType="numeric"
      />

      {/* Voice Call Charge Input */}
      <TextInput
        style={styles.input}
        placeholder="Voice Call Charge for 10 minutes (₹)"
        value={voiceCallCharge}
        onChangeText={setVoiceCallCharge}
        keyboardType="numeric"
      />

      {/* Bio Input */}
      <TextInput
        style={styles.textArea}
        placeholder="Write your bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit & Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Expert;