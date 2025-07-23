import React, { useState, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView, 
  Platform,
  Alert,
  StyleSheet,
  Dimensions
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../context/Context';
import styles from '../components/styles/Portfolio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const steps = ['Bio', 'Experience', 'Skills', 'Availability'];

const Portfolio = ({ route, navigation }) => {
  const { userId } = useContext(UserContext);

  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('Fresher');
  const [categories, setCategories] = useState(['']);
  const [skills, setSkills] = useState(['']);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [voiceCallCharge, setVoiceCallCharge] = useState('');
  const [currentPost, setCurrentPost] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeFormat1, setTimeFormat1] = useState('PM');
  const [timeFormat2, setTimeFormat2] = useState('PM');
  const [loading, setLoading] = useState(false);

  const experienceOptions = ['Fresher', '1-2 Years', '3-5 Years', '5+ Years', '10+ Years'];

  // Step tracking
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef(null);
  const sectionOffsets = useRef([]);

  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const thresholds = sectionOffsets.current;
    if (thresholds.length === 4) {
      for (let i = 0; i < thresholds.length; i++) {
        if (offsetY < thresholds[i]) {
          setCurrentStep(i);
          break;
        }
        if (i === thresholds.length - 1) setCurrentStep(3);
      }
    }
  };

  const addCategory = () => setCategories([...categories, '']);
  const removeCategory = index => {
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

  const addSkill = () => setSkills([...skills, '']);
  const removeSkill = index => {
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
    if (!bio.trim()) return Alert.alert('Validation Error', 'Please provide a bio');
    if (!currentPost.trim()) return Alert.alert('Validation Error', 'Please provide your current position');
    if (categories.some(cat => !cat.trim())) return Alert.alert('Validation Error', 'Fill all categories or remove empty ones');
    if (!voiceCallCharge.trim() || isNaN(parseFloat(voiceCallCharge))) return Alert.alert('Validation Error', 'Provide a valid voice call charge');
    if (skills.some(skill => !skill.trim())) return Alert.alert('Validation Error', 'Fill all skills or remove empty ones');
    if (!startTime.trim() || !endTime.trim()) return Alert.alert('Validation Error', 'Provide both start and end times');
    if (startTime > 12 || startTime < 1 || endTime > 12 || endTime < 1) return Alert.alert('Validation Error', 'Timings must be between 1 and 12');
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const payload = {
        bio,
        charges: [voiceCallCharge],
        category: categories.filter(c => c.trim()),
        currentPost,
        experience,
        url: portfolioUrl,
        skills: skills.filter(s => s.trim()),
        availSlots: `${startTime} ${timeFormat1} - ${endTime} ${timeFormat2}`,
      };

      const res = await axios.post(`https://expertgo-v1.onrender.com/expert/create/${userId}`, payload);

      if (res.data.success) {
        Alert.alert('Success', 'Expert profile created!', [
          { text: 'OK', onPress: () => navigation.replace('MainTabs') },
        ]);

await AsyncStorage.setItem('PortfolioData', JSON.stringify(payload));
      } else {
        throw new Error(res.data.message || 'Failed to create expert profile');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Step Indicator */}
      <View style={local.stepContainer}>
        {steps.map((step, index) => (
          <View key={index} style={local.stepBox}>
            <Text style={[local.stepText, currentStep === index && local.activeStep]}>{step}</Text>
            {index < steps.length - 1 && <View style={local.stepDivider} />}
          </View>
        ))}
      </View>

      {/* Scrollable Form */}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Bio */}
        <View
          onLayout={e => (sectionOffsets.current[0] = e.nativeEvent.layout.y + 50)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Bio (Professional Summary)</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            placeholderTextColor="#666"
            multiline
          />
        </View>

        {/* Experience */}
        <View
          onLayout={e => (sectionOffsets.current[1] = e.nativeEvent.layout.y + 50)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Experience</Text>
          <View style={styles.experienceContainer}>
            {experienceOptions.map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setExperience(option)}
                style={[styles.experienceButton, experience === option && styles.experienceButtonSelected]}
              >
                <Text
                  style={[
                    styles.experienceButtonText,
                    experience === option && styles.experienceButtonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skills & Categories */}
        <View
          onLayout={e => (sectionOffsets.current[2] = e.nativeEvent.layout.y + 50)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Expertised Fields</Text>
          {categories.map((cat, i) => (
            <View key={i} style={styles.inputContainer}>
              <TextInput
                style={styles.roundInput}
                value={cat}
                onChangeText={text => updateCategory(text, i)}
                placeholderTextColor="#666"
              />
              {i === categories.length - 1 && (
                <TouchableOpacity onPress={addCategory} style={styles.addButton}>
                  <Ionicons name="add-circle" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Skills</Text>
          {skills.map((skill, i) => (
            <View key={i} style={styles.inputContainer}>
              <TextInput
                style={styles.roundInput}
                value={skill}
                onChangeText={text => updateSkill(text, i)}
                placeholderTextColor="#666"
              />
              {i === skills.length - 1 && (
                <TouchableOpacity onPress={addSkill} style={styles.addButton}>
                  <Ionicons name="add-circle" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Availability */}
        <View
          onLayout={e => (sectionOffsets.current[3] = e.nativeEvent.layout.y + 50)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Current Position*</Text>
          <TextInput
            style={styles.input}
            value={currentPost}
            onChangeText={setCurrentPost}
            placeholder="e.g. Senior Developer"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.sectionTitle}>Portfolio URL</Text>
          <TextInput
            style={styles.roundInput}
            value={portfolioUrl}
            onChangeText={setPortfolioUrl}
            placeholderTextColor="#666"
          />

          <Text style={styles.sectionTitle}>Charge for 10 mins call</Text>
          <TextInput
            style={styles.roundInput}
            value={voiceCallCharge}
            onChangeText={setVoiceCallCharge}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />

          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.timingContainer}>
            <TextInput
              style={styles.timeInput}
              value={startTime}
              onChangeText={setStartTime}
              maxLength={2}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[styles.amPmButton, timeFormat1 === 'AM' && styles.amPmButtonSelected]}
                onPress={() => setTimeFormat1('AM')}
              >
                <Text style={styles.amPmText}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.amPmButton, timeFormat1 === 'PM' && styles.amPmButtonSelected]}
                onPress={() => setTimeFormat1('PM')}
              >
                <Text style={styles.amPmText}>PM</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.timeSeparator}>--</Text>

            <TextInput
              style={styles.timeInput}
              value={endTime}
              onChangeText={setEndTime}
              maxLength={2}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[styles.amPmButton, timeFormat2 === 'AM' && styles.amPmButtonSelected]}
                onPress={() => setTimeFormat2('AM')}
              >
                <Text style={styles.amPmText}>AM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.amPmButton, timeFormat2 === 'PM' && styles.amPmButtonSelected]}
                onPress={() => setTimeFormat2('PM')}
              >
                <Text style={styles.amPmText}>PM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={submitForm} disabled={loading}>
          <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Create Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const local = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  activeStep: {
    color: '#007AFF',
  },
  stepDivider: {
    width: 14,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
    marginTop: 2,
  },
});

export default Portfolio;
