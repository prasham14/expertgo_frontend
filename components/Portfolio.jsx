import React, { useState,useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import axios from 'axios';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { UserContext } from './Context';
import styles from './styles/Portfolio';
const Portfolio = ({ route, navigation }) => {
  const { userId} = useContext(UserContext);
  
  const [categories, setCategories] = useState(['']);
  const [voiceCallCharge, setVoiceCallCharge] = useState('');
  const [videoCallCharge, setVideoCallCharge] = useState('');
  const [bio, setBio] = useState('');
  const [currentPost, setCurrentPost] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skills, setSkills] = useState(['']);
  const [loading, setLoading] = useState(false);

  const experienceOptions = ['Fresher', '1-2 Years', '3-5 Years', '5+ Years', '10+ Years'];

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
    
    // Check if voice call charge is valid
    if (!voiceCallCharge.trim() || isNaN(parseFloat(voiceCallCharge))) {
      Alert.alert('Validation Error', 'Please provide a valid voice call charge');
      return false;
    }
    
    // Check if video call charge is valid
    if (!videoCallCharge.trim() || isNaN(parseFloat(videoCallCharge))) {
      Alert.alert('Validation Error', 'Please provide a valid video call charge');
      return false;
    }
    
    // Check if any skill is empty
    if (skills.some(skill => !skill.trim())) {
      Alert.alert('Validation Error', 'Please fill in all skills or remove empty ones');
      return false;
    }
    
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Filter out any empty categories or skills
      const filteredCategories = categories.filter(cat => cat.trim() !== '');
      const filteredSkills = skills.filter(skill => skill.trim() !== '');
      
      // Create the request payload
      const payload = {
        bio,
        charges: [voiceCallCharge, videoCallCharge],
        category: filteredCategories,
        currentPost,
        experience,
        url: portfolioUrl,
        skills: filteredSkills
      };
      
      // Send the request to create the expert profile
      const response = await axios.post(
        `http://10.0.2.2:3000/expert/create/${userId}`,
        payload
      );
      
      if (response.data.success) {
        Alert.alert(
          'Success', 
          'Your expert profile has been created successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Portfolio', { userRole: 'expert' }) }]
        );
        navigation.replace("Home")
      } else {
        throw new Error(response.data.message || 'Failed to create expert profile');
      }
    } catch (error) {
      console.error('Error creating expert profile:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create expert profile. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Create Expert Profile</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Bio Section */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Professional Bio*</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write a brief professional bio"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
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
            onPress={submitForm}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Create Expert Profile'}
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



export default Portfolio;