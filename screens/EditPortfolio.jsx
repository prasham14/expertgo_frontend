import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../context/Context';
import styles from '../components/styles/EditPortfolio';
const EditPortfolio = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  
  const [categories, setCategories] = useState(['']);
  const [voiceCallCharge, setVoiceCallCharge] = useState('');
  const [videoCallCharge, setVideoCallCharge] = useState('');
  const [bio, setBio] = useState('');
  const [currentPost, setCurrentPost] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skills, setSkills] = useState(['']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  const experienceOptions = ['Fresher', '1-2 Years', '3-5 Years', '5+ Years', '10+ Years'];

  useEffect(() => {
    fetchExpertProfile();
  }, []);

  const fetchExpertProfile = async () => {
    try {
      setFetchingProfile(true);
      const response = await axios.get(`http://10.0.2.2:3000/expert/profile/${userId}`);
      
      if (response.data.success && response.data.data) {
        const profileData = response.data.data;
        
        setBio(profileData.bio || '');
        setCurrentPost(profileData.currentPost || '');
        setExperience(profileData.experience || 'Fresher');
        setPortfolioUrl(profileData.url || '');
        setName(profileData.name || '');
        
        // Set categories
        if (profileData.category && profileData.category.length > 0) {
          setCategories(profileData.category);
        }
        
        // Set charges
        if (profileData.charges && profileData.charges.length >= 2) {
          setVoiceCallCharge(profileData.charges[0]?.toString() || '');
          setVideoCallCharge(profileData.charges[1]?.toString() || '');
        }
        
        // Set skills
        if (profileData.skills && profileData.skills.length > 0) {
          setSkills(profileData.skills);
        }
      } else {
        Alert.alert('Profile Not Found', 'Could not find your expert profile. Please create one first.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      Alert.alert(
        'Error',
        'Failed to fetch your expert profile. Please try again later.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setFetchingProfile(false);
    }
  };

  const addCategory = () => {
    setCategories([...categories, '']);
  };

  const removeCategory = (index) => {
    if (categories.length > 1) {
      const newCategories = [...categories];
      newCategories.splice(index, 1);
      setCategories(newCategories);
    }
  };

  const updateCategory = (text, index) => {
    const newCategories = [...categories];
    newCategories[index] = text;
    setCategories(newCategories);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    if (skills.length > 1) {
      const newSkills = [...skills];
      newSkills.splice(index, 1);
      setSkills(newSkills);
    }
  };

  const updateSkill = (text, index) => {
    const newSkills = [...skills];
    newSkills[index] = text;
    setSkills(newSkills);
  };

  const validateForm = () => {
    if (!bio.trim()) {
      Alert.alert('Validation Error', 'Please provide a bio');
      return false;
    }
    
    if (!currentPost.trim()) {
      Alert.alert('Validation Error', 'Please provide your current position');
      return false;
    }
    
    // Check if any category is empty
    if (categories.some(cat => !cat.trim())) {
      Alert.alert('Validation Error', 'Please fill in all categories or remove empty ones');
      return false;
    }
    
    if (!voiceCallCharge.trim() || isNaN(parseFloat(voiceCallCharge))) {
      Alert.alert('Validation Error', 'Please provide a valid voice call charge');
      return false;
    }
    
    if (!videoCallCharge.trim() || isNaN(parseFloat(videoCallCharge))) {
      Alert.alert('Validation Error', 'Please provide a valid video call charge');
      return false;
    }
    
    if (skills.some(skill => !skill.trim())) {
      Alert.alert('Validation Error', 'Please fill in all skills or remove empty ones');
      return false;
    }
    
    return true;
  };

  const updateProfile = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const filteredCategories = categories.filter(cat => cat.trim() !== '');
      const filteredSkills = skills.filter(skill => skill.trim() !== '');
      
      const payload = {
        bio,
        charges: [voiceCallCharge, videoCallCharge],
        category: filteredCategories,
        currentPost,
        experience,
        url: portfolioUrl,
        skills: filteredSkills,
        name
      };
      
      const response = await axios.put(
        `http://10.0.2.2:3000/expert/update/${userId}`,
        payload
      );
      
      if (response.data.success) {
        Alert.alert(
          'Success', 
          'Your expert profile has been updated successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        throw new Error(response.data.message || 'Failed to update expert profile');
      }
    } catch (error) {
      console.error('Error updating expert profile:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update expert profile. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Edit Expert Profile</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Name Section */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your display name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />
          </View>


          {/* Current Position */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Current Position*</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senior Developer at ABC Inc."
              value={currentPost}
              onChangeText={setCurrentPost}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Experience */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Experience Level</Text>
            <View style={styles.experienceContainer}>
              {experienceOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.experienceButton,
                    experience === option && styles.experienceButtonSelected
                  ]}
                  onPress={() => setExperience(option)}
                >
                  <Text
                    style={[
                      styles.experienceButtonText,
                      experience === option && styles.experienceButtonTextSelected
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Categories*</Text>
              <TouchableOpacity onPress={addCategory} style={styles.addButton}>
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
            
            {categories.map((category, index) => (
              <View key={index} style={styles.dynamicInputContainer}>
                <TextInput
                  style={styles.dynamicInput}
                  placeholder={`Category ${index + 1}`}
                  value={category}
                  onChangeText={(text) => updateCategory(text, index)}
                  placeholderTextColor="#aaa"
                />
                {categories.length > 1 && (
                  <TouchableOpacity onPress={() => removeCategory(index)} style={styles.removeButton}>
                    <Ionicons name="remove-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Charges */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Charges*</Text>
            <View style={styles.chargesContainer}>
              <View style={styles.chargeInputContainer}>
                <Text style={styles.chargeLabel}>Voice Call (per hour)</Text>
                <TextInput
                  style={styles.chargeInput}
                  placeholder="Amount"
                  value={voiceCallCharge}
                  onChangeText={setVoiceCallCharge}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
              <View style={styles.chargeInputContainer}>
                <Text style={styles.chargeLabel}>Video Call (per hour)</Text>
                <TextInput
                  style={styles.chargeInput}
                  placeholder="Amount"
                  value={videoCallCharge}
                  onChangeText={setVideoCallCharge}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
          </View>

          {/* Portfolio URL */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Portfolio URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. https://yourportfolio.com"
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Skills */}
          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Skills*</Text>
              <TouchableOpacity onPress={addSkill} style={styles.addButton}>
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                <Text style={styles.addButtonText}>Add Skill</Text>
              </TouchableOpacity>
            </View>
            
            {skills.map((skill, index) => (
              <View key={index} style={styles.dynamicInputContainer}>
                <TextInput
                  style={styles.dynamicInput}
                  placeholder={`Skill ${index + 1}`}
                  value={skill}
                  onChangeText={(text) => updateSkill(text, index)}
                  placeholderTextColor="#aaa"
                />
                {skills.length > 1 && (
                  <TouchableOpacity onPress={() => removeSkill(index)} style={styles.removeButton}>
                    <Ionicons name="remove-circle" size={24} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={updateProfile}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Updating...' : 'Update Expert Profile'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default EditPortfolio;