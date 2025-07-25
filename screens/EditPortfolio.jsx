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
import AsyncStorage from '@react-native-async-storage/async-storage';
const EditPortfolio = ({ navigation }) => {
  const { userId } = useContext(UserContext);
  console.log(userId)
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
  const [availSlots,setAvailSlots] = useState('');
  const experienceOptions = ['Fresher', '1-2 Years', '3-5 Years', '5+ Years', '10+ Years'];
  const [startTime, setStartTime] = useState('');
const [endTime, setEndTime] = useState('');
const [timeFormat1, setTimeFormat1] = useState('PM');
const [timeFormat2, setTimeFormat2] = useState('PM');
  useEffect(() => {
    fetchExpertProfile();
  }, []);

const fetchExpertProfile = async () => {
  try {
    setFetchingProfile(true);

    const profileDataString = await AsyncStorage.getItem('PortfolioData');

    if (profileDataString) {
      const profileData = JSON.parse(profileDataString);

      console.log('Loaded from AsyncStorage:', profileData);

      setBio(profileData.bio || '');
      setCurrentPost(profileData.currentPost || '');
      setExperience(profileData.experience || 'Fresher');
      setPortfolioUrl(profileData.url || '');
      setName(profileData.name || '');
      setAvailSlots(profileData.availSlots || '');

      if (profileData.availSlots) {
        const timeSlotMatch = profileData.availSlots.match(/(\d+)\s*(AM|PM)?\s*-\s*(\d+)\s*(AM|PM)/i);
        
        if (timeSlotMatch) {
          setStartTime(timeSlotMatch[1]);
          setTimeFormat1(timeSlotMatch[2] ? timeSlotMatch[2].toUpperCase() : timeSlotMatch[4].toUpperCase());
          setEndTime(timeSlotMatch[3]);
          setTimeFormat2(timeSlotMatch[4].toUpperCase());
        }
      }

      if (profileData.category && profileData.category.length > 0) {
        setCategories(profileData.category);
      }

      if (profileData.charges && profileData.charges.length >= 2) {
        setVoiceCallCharge(profileData.charges[0]?.toString() || '');
        setVideoCallCharge(profileData.charges[1]?.toString() || '');
      } else if (profileData.charges && profileData.charges.length === 1) {
        setVoiceCallCharge(profileData.charges[0]?.toString() || '');
      }

      if (profileData.skills && profileData.skills.length > 0) {
        setSkills(profileData.skills);
      }
    } else {
      Alert.alert('No Saved Data', 'No expert profile data found in local storage.');
      navigation.goBack();
    }
  } catch (error) {
    console.error('Error loading expert profile from storage:', error);
    Alert.alert('Error', 'Failed to load expert profile from local storage.');
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

    
    if (skills.some(skill => !skill.trim())) {
      Alert.alert('Validation Error', 'Please fill in all skills or remove empty ones');
      return false;
    }
    if(startTime > 12 || startTime < 1 || endTime > 12 || endTime < 1 ){
      Alert.alert('Validation Error', 'Please provide a valid timings');
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
        name,
        availSlots : startTime + ' ' + timeFormat1 +  '-' + endTime + ' '  + timeFormat2
      };
      
      const response = await axios.put(
        `https://expertgo-v1.onrender.com/expert/update/${userId}`,
        payload
      );
      
      if (response.data.success) {
          await AsyncStorage.setItem('PortfolioData', JSON.stringify(payload)); 
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

        
        <View style={styles.formContainer}>
          {/* Name Section */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              placeholder="Tell something about yourself"
              value={bio}
              onChangeText={setBio}
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
          <View style={styles.fieldContainer}>
  <Text style={styles.label}>Available Timings:</Text>
  <View style={styles.timingContainer}>
    <TextInput
      style={styles.timeInput}
      placeholder="Start"
      keyboardType="numeric"
      maxLength={2}
      value={startTime}
      onChangeText={setStartTime}
      placeholderTextColor="#aaa"
    />
     <View style={styles.amPmSelector}>
      <TouchableOpacity
        style={[
          styles.amPmOption,
          timeFormat1 === 'AM' && styles.selectedAmPm
        ]}
        onPress={() => setTimeFormat1('AM')}
      >
        <Text style={timeFormat1 === 'AM' ? styles.selectedAmPmText : styles.amPmText}>AM</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.amPmOption,
          timeFormat1 === 'PM' && styles.selectedAmPm
        ]}
        onPress={() => setTimeFormat1('PM')}
      >
        <Text style={timeFormat1 === 'PM' ? styles.selectedAmPmText : styles.amPmText}>PM</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.timeSeparator}>-</Text>
    <TextInput
      style={styles.timeInput}
      placeholder="End"
      keyboardType="numeric"
      maxLength={2}
      value={endTime}
      onChangeText={setEndTime}
      placeholderTextColor="#aaa"
    />
    <View style={styles.amPmSelector}>
      <TouchableOpacity
        style={[
          styles.amPmOption,
          timeFormat2 === 'AM' && styles.selectedAmPm
        ]}
        onPress={() => setTimeFormat2('AM')}
      >
        <Text style={timeFormat2 === 'AM' ? styles.selectedAmPmText : styles.amPmText}>AM</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.amPmOption,
          timeFormat2 === 'PM' && styles.selectedAmPm
        ]}
        onPress={() => setTimeFormat2('PM')}
      >
        <Text style={timeFormat2 === 'PM' ? styles.selectedAmPmText : styles.amPmText}>PM</Text>
      </TouchableOpacity>
    </View>
  </View>
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
                <Text style={styles.chargeLabel}> Call (per 10 minutes)</Text>
                <TextInput
                  style={styles.chargeInput}
                  placeholder="Amount"
                  value={voiceCallCharge}
                  onChangeText={setVoiceCallCharge}
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