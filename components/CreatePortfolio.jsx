import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

const PortfolioForm = ({ route }) => {
  const { userId, email } = route.params;
  const navigation = useNavigation(); 
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: email || "", // Initialize email from route params
    currentPost: "",
    skills: "",
    url: "",
    experience: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email })); 
    console.warn(email);
    // Ensure email is set correctly when component mounts
  }, [email]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.currentPost || !formData.skills) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:3000/expert/details/${userId}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null); // Handle empty response

      if (response.ok) {
        Alert.alert("Success", data?.message || "Portfolio updated!");
        navigation.replace('MainTabs')
      } else {
        Alert.alert("Error", data?.message || "Failed to update portfolio.");
      }
    } catch (error) {
      console.error("Error submitting portfolio details:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expert Portfolio</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={formData.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Post"
        value={formData.currentPost}
        onChangeText={(text) => handleChange("currentPost", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Skills (comma separated)"
        value={formData.skills}
        onChangeText={(text) => handleChange("skills", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Portfolio URL"
        value={formData.url}
        onChangeText={(text) => handleChange("url", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Experience"
        value={formData.experience}
        onChangeText={(text) => handleChange("experience", text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PortfolioForm;
