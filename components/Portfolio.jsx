import {   Text, View, TouchableOpacity,Modal,TextInput,Alert} from 'react-native'
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles/Portfolio';
import { useNavigation } from '@react-navigation/native';
const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editPortfolioModalVisible, setEditPortfolioModalVisible] = useState(false);
  const [portfolioFormData, setPortfolioFormData] = useState({
    fullName: '',
    email: '',
    currentPost: '',
    url: '',
    experience: '',
    skills: '',
  });
  const [submitted, setSubmitted] =useState(false);
  const navigation = useNavigation(); 

  // Fetch expert portfolio details
  const getPortfolio = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const email = await AsyncStorage.getItem('email');

      if (!userId) return;

      const response = await axios.get(`http://10.0.2.2:3000/expert/portfolio/${userId}`);
      setPortfolioData(response.data.user);
      setPortfolioFormData({
        fullName: response.data.user.fullName || '',
        email: response.data.user.email || '',
        currentPost: response.data.user.currentPost || '',
        url: response.data.user.url || '',
        experience: response.data.user.experience || '',
        skills: response.data.user.skills || '',
      });
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      }); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  const handleEditPortfolio = async () => {
    if (
      !portfolioFormData.fullName.trim() ||
      !portfolioFormData.email.trim() ||
      !portfolioFormData.currentPost.trim() ||
      !portfolioFormData.experience.trim()
    ) {
      Alert.alert("Validation Error", "Please fill in all required fields for your portfolio.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      const expertFormSubmitted = await AsyncStorage.getItem('expertFormSubmitted');
      setSubmitted(expertFormSubmitted);
      if (!userId) return;

      const response = await axios.patch(`http://10.0.2.2:3000/expert/editPortfolio/${userId}`, portfolioFormData);
      setPortfolioData(response.data.user);
      setEditPortfolioModalVisible(false);
      Alert.alert("Success", "Portfolio updated successfully!");
    } catch (error) {
      console.error('Error updating portfolio:', error);
      Alert.alert("Error", "There was an error updating your portfolio. Please try again.");
    }
  };
 
  return (
    <View>
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            {portfolioData ? (
              <>
                <Text style={styles.label}>
                  Full Name: <Text style={styles.value}>{portfolioData.fullName || "N/A"}</Text>
                </Text>
                <Text style={styles.label}>
                  Email: <Text style={styles.value}>{portfolioData.email || "N/A"}</Text>
                </Text>
                <Text style={styles.label}>
                  Current Post: <Text style={styles.value}>{portfolioData.currentPost || "N/A"}</Text>
                </Text>
                <Text style={styles.label}>
                  URL: <Text style={styles.value}>{portfolioData.url || "N/A"}</Text>
                </Text>
                <Text style={styles.label}>
                  Experience: <Text style={styles.value}>{portfolioData.experience || "N/A"}</Text>
                </Text>
                <Text style={styles.label}>
                  Skills: <Text style={styles.value}>{portfolioData.skills || "N/A"}</Text>
                </Text>
              </>
            ) : (
              <Text style={styles.placeholderText}>No portfolio data available.</Text>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
       {
        submitted ?(null):(
          <TouchableOpacity style={styles.closeButton} onPress={()=>navigation.navigate('Expert') }>
          <Text style={styles.buttonText}>Create Expert profile</Text>
        </TouchableOpacity>
        )

       }
    
    
     <Modal animationType="fade" transparent visible={editPortfolioModalVisible} onRequestClose={() => setEditPortfolioModalVisible(false)}>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.sectionTitle}>Edit Portfolio</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={portfolioFormData.fullName}
                  onChangeText={(text) => setPortfolioFormData({ ...portfolioFormData, fullName: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Post"
                  value={portfolioFormData.currentPost}
                  onChangeText={(text) => setPortfolioFormData({ ...portfolioFormData, currentPost: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="experience"
                  value={portfolioFormData.category}
                  onChangeText={(text) => setPortfolioFormData({ ...portfolioFormData, experience: text })}
                />
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="skills"
                  value={portfolioFormData.bio}
                  onChangeText={(text) => setPortfolioFormData({ ...portfolioFormData, skills: text })}
                  multiline
                />
                <TextInput
                  style={styles.input}
                  placeholder="URL (Optional)"
                  value={portfolioFormData.url}
                  onChangeText={(text) => setPortfolioFormData({ ...portfolioFormData, url: text })}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleEditPortfolio}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.closeButton} onPress={() => setEditPortfolioModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

           <View style={styles.bottomButtons}>
                  <TouchableOpacity style={styles.button} onPress={getPortfolio}>
                    <Text style={styles.buttonText}>View Portfolio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={()=>setEditPortfolioModalVisible(true)}>
                    <Text style={styles.buttonText}>Edit Portfolio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
        </View>
  )
}

export default Portfolio