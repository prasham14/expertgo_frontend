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
import styles from "./styles/Expert";

const Expert = ({ navigation }) => {
  const [charges, setCharges] = useState("");
  const [category, setCategory] = useState("");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState([]);
  const [chargesList, setChargesList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkFormSubmission = async () => {
      const isSubmitted = await AsyncStorage.getItem("expertFormSubmitted");
      if (isSubmitted) {
        navigation.replace("Profile");
      }
    };
    checkFormSubmission();
  }, [navigation]);

  const addCategory = () => {
    if (category.trim() !== "") {
      setCategories([...categories, category]);
      setCategory("");
    }
  };

  const addCharge = () => {
    if (charges.trim() !== "") {
      setChargesList([...chargesList, charges]);
      setCharges("");
    }
  };


  const handleSubmit = async () => {
    if (!bio || categories.length === 0 || chargesList.length === 0 ) {
      Alert.alert("Error", "Please fill in all required fields!");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      const email = await AsyncStorage.getItem("email");

      if (!userId) {
        Alert.alert("Error", "Please Login Again");
        return;
      }

      const requestBody = {
        email: email || "", // Ensure it's not null
        bio: bio.trim(),
        categories: categories.length > 0 ? categories : ["General"], // Default value
        charges: chargesList.length > 0 ? chargesList : ["N/A"], // Default value
      };
      
      console.log("Request Body:", requestBody); // Debugging Log    
      const response = await fetch(`http://10.0.2.2:3000/profile/editExpertData/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("expertFormSubmitted", "true");
        setSubmitted(true);
        Alert.alert("Success", "Your expert portfolio has been saved successfully!");
        navigation.replace("Home");
      } else {
        Alert.alert("Error", data.message || "Failed to update portfolio details");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.title}>Expert Profile Creation</Text>

      {/* Category Input */}
      <TextInput style={styles.input} placeholder="Add Category" value={category} onChangeText={setCategory} />
      <TouchableOpacity style={styles.addButton} onPress={addCategory}>
        <Text style={styles.buttonText}>Add Category</Text>
      </TouchableOpacity>
      {categories.map((item, index) => (
        <Text key={index} style={styles.listItem}>{item}</Text>
      ))}

      {/* Charges Input */}
      <TextInput style={styles.input} placeholder="Add Charge" value={charges} onChangeText={setCharges} />
      <TouchableOpacity style={styles.addButton} onPress={addCharge}>
        <Text style={styles.buttonText}>Add Charge</Text>
      </TouchableOpacity>
      {chargesList.map((item, index) => (
        <Text key={index} style={styles.listItem}>{item}</Text>
      ))}


      {/* Bio Input */}
      <TextInput style={styles.textArea} placeholder="Bio" value={bio} onChangeText={setBio} multiline />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit & Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Expert;
