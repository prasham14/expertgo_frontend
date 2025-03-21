// Profile.js (Refactored with Redux)
import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Modal, 
  TextInput, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles/Profile';

// Import Redux actions
import {
  fetchUserProfile,
  fetchExpertProfile,
  fetchProfileImage,
  uploadProfileImage,
  updateUsername,
  updateBio,
  toggleExpertAvailability,
  sendVerificationOTP,
  verifyOTP,
  updateEmail,
  becomeExpert,
  setEmailVerificationState,
  resetEmailVerificationState,
} from '../store/slices/profileSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  
  // Extract route params
  const { userId, userRole } = route.params;
  
  // Local UI state
  const [editUserNameModalVisible, setEditUserNameModalVisible] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [editEmailModal, setEditEmailModal] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Get state from Redux store
  const {
    userData,
    expertData,
    imageUrl,
    loading,
    error,
    emailVerification
  } = useSelector(state => state.profile);
  
  // Destructure expert data
  const { bio, isAvailable, isVerified } = expertData;
  
  // Load initial data
  useEffect(() => {
    // Fetch user profile data (works for all users)
    dispatch(fetchUserProfile(userId))
      .unwrap()
      .then(data => {
        setUsernameInput(data.name || '');
      });
    
    // Fetch profile image
    dispatch(fetchProfileImage(userId));
    
    // If user is an expert, fetch expert profile data
    if (userRole === 'expert') {
      dispatch(fetchExpertProfile(userId));
    }
  }, [dispatch, userId, userRole]);
  
  // Choose and upload image
  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        const selectedImage = response.assets[0];
        dispatch(uploadProfileImage({ userId, image: selectedImage }))
          .unwrap()
          .then(() => {
            Alert.alert('Success', 'Image uploaded successfully!');
          })
          .catch(err => {
            Alert.alert('Error', 'Failed to upload image');
          });
      }
    });
  };
  
  // Update username
  const handleEditUserName = () => {
    dispatch(updateUsername({ userId, username: usernameInput }))
      .unwrap()
      .then(() => {
        setEditUserNameModalVisible(false);
        Alert.alert('Success', 'Username updated successfully.');
      })
      .catch(err => {
        Alert.alert('Error', 'There was an error updating your username.');
      });
  };
  
  // Bio editing
  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditing(true);
  };
  
  const saveBio = () => {
    if (!tempBio || tempBio === bio) {
      setIsEditing(false);
      return;
    }
    
    dispatch(updateBio({ userId, bio: tempBio }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch(err => {
        Alert.alert('Error', 'Failed to update bio');
      });
  };
  
  // Toggle availability
  const toggleAvailability = () => {
    const newStatus = !isAvailable;
    dispatch(toggleExpertAvailability({ userId, isAvailable: newStatus }))
      .unwrap()
      .then(() => {
        Alert.alert('Success', `You are now ${newStatus ? 'Available' : 'Unavailable'}`);
      })
      .catch(err => {
        Alert.alert('Error', 'Could not update availability.');
      });
  };
  
  // Email verification
  const handleSendOTP = () => {
    const newEmail = emailVerification.newEmail;
    
    if (!newEmail) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    dispatch(sendVerificationOTP({ email: newEmail }))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'OTP sent to your email. Please check and enter below.');
      })
      .catch(err => {
        Alert.alert('Error', err || 'Error sending OTP');
      });
  };
  
  const verifyOtpAndUpdateEmail = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    
    dispatch(verifyOTP({ email: emailVerification.newEmail, otp }))
      .unwrap()
      .then(() => {
        // If OTP verification is successful, update email
        dispatch(updateEmail({ userId, newEmail: emailVerification.newEmail }))
          .unwrap()
          .then(() => {
            resetEmailModal();
            Alert.alert('Success', 'Email updated successfully!');
          });
      })
      .catch(err => {
        Alert.alert('Error', err || 'Invalid OTP. Please try again.');
      });
  };
  
  const resetEmailModal = () => {
    setEditEmailModal(false);
    setOtp('');
    dispatch(resetEmailVerificationState());
  };
  
  // Become an expert
  const becomeAnExpert = () => {
    dispatch(becomeExpert(userId))
      .unwrap()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(err => {
        Alert.alert('Error', 'Could not update.');
      });
  };
  
  // Logout
  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  // If data is loading, show loading indicator
  if (loading && !userData.name) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Header Banner */}
        <View style={styles.headerBanner}>
          <Text style={styles.pageTitle}>User Profile</Text>
        </View>
        
        {userData && (
          <View style={styles.profileCard}>
            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <View style={styles.imageWrapper}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>
                      {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={styles.imageEditButton} onPress={chooseImage}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#4A80F0" size="small" />
                  <Text style={styles.loadingText}>Uploading...</Text>
                </View>
              )}
            </View>
            
            {/* User Info Container */}
            <View style={styles.userInfoContainer}>
              {/* Username Section */}
              <View style={styles.nameContainer}>
                <Text style={styles.userName}>{userData.name || "N/A"}</Text>
                <View style={styles.nameActions}>
                  <TouchableOpacity 
                    style={styles.editNameButton}
                    onPress={() => {
                      setUsernameInput(userData.name || "");
                      setEditUserNameModalVisible(true);
                    }}
                  >
                    <Ionicons name="create-outline" size={18} color="#4A80F0" />
                  </TouchableOpacity>
                  {isVerified ? (
                    <View style={styles.verifiedBadgeContainer}>
                      <Ionicons name="shield-checkmark" size={16} color="#4A80F0" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              
              {/* Email Section */}
              <View style={styles.infoSection}>
                <View style={styles.infoHeader}>
                  <Ionicons name="mail-outline" size={18} color="#555" />
                  <Text style={styles.infoLabel}>Email</Text>
                  <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => setEditEmailModal(true)}
                  >
                    <Ionicons name="pencil-outline" size={16} color="#4A80F0" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.infoValue}>{userData.email || "N/A"}</Text>
              </View>
              
              {/* Expert Specific Sections */}
              {userRole === 'expert' && (
                <>
                  {/* Bio Section */}
                  <View style={styles.bioSection}>
                    <View style={styles.infoHeader}>
                      <Ionicons name="document-text-outline" size={18} color="#555" />
                      <Text style={styles.infoLabel}>Bio</Text>
                      {!isEditing ? (
                        <TouchableOpacity 
                          style={styles.editButton} 
                          onPress={handleEditBio}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#4A80F0" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
    
                    {!isEditing ? (
                      <Text style={styles.bioText} numberOfLines={3}>{bio || "Add your professional bio here..."}</Text>
                    ) : (
                      <View style={styles.bioEditContainer}>
                        <TextInput
                          style={styles.bioInput}
                          value={tempBio}
                          onChangeText={setTempBio}
                          placeholder="Write a short bio about yourself..."
                          multiline
                          autoFocus
                        />
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity onPress={saveBio} style={styles.saveButton}>
                            <Ionicons name="checkmark" size={18} color="#fff" />
                            <Text style={styles.buttonText}>Save</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                            <Ionicons name="close" size={18} color="#fff" />
                            <Text style={styles.buttonText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                  
                  {/* Availability Section */}
                  <View style={styles.availabilitySection}>
                    <View style={styles.availabilityHeader}>
                      <Ionicons name="time-outline" size={18} color="#555" />
                      <Text style={styles.availabilityLabel}>Availability</Text>
                    </View>
                    <View style={styles.availabilityControls}>
                      <TouchableOpacity 
                        style={[
                          styles.availabilityButton,
                          { backgroundColor: isAvailable ? '#E0F7E0' : '#F7E0E0' }
                        ]} 
                        onPress={toggleAvailability}
                      >
                        <Ionicons 
                          name={isAvailable ? "checkmark-circle" : "close-circle"} 
                          size={24} 
                          color={isAvailable ? "#28A745" : "#DC3545"} 
                        />
                        <Text style={[
                          styles.availabilityButtonText, 
                          { color: isAvailable ? "#28A745" : "#DC3545" }
                        ]}>
                          {isAvailable ? "Available" : "Unavailable"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
        
        {/* Become Expert Button */}
        {userRole === 'user' && (
          <TouchableOpacity style={styles.becomeExpertButton} onPress={becomeAnExpert}>
            <Ionicons name="star" size={20} color="#FFF" />
            <Text style={styles.becomeExpertText}>Become an Expert</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Edit username modal */}
      <Modal 
        animationType="slide" 
        transparent 
        visible={editUserNameModalVisible} 
        onRequestClose={() => setEditUserNameModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Username</Text>
              <TouchableOpacity onPress={() => setEditUserNameModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new username"
              value={usernameInput}
              onChangeText={setUsernameInput}
            />
            <TouchableOpacity style={styles.modalPrimaryButton} onPress={handleEditUserName}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSecondaryButton} 
              onPress={() => setEditUserNameModalVisible(false)}
            >
              <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Email Edit Modal with OTP Verification */}
      <Modal 
        animationType="slide" 
        transparent 
        visible={editEmailModal} 
        onRequestClose={resetEmailModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Email</Text>
              <TouchableOpacity onPress={resetEmailModal}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            
            {!emailVerification.showOtpInput ? (
              // Step 1: Enter new email and send OTP
              <>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#555" style={styles.inputIcon} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter your new email"
                    value={emailVerification.newEmail}
                    onChangeText={(text) => dispatch(setEmailVerificationState({ newEmail: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity 
                  style={styles.modalPrimaryButton} 
                  onPress={handleSendOTP}
                  disabled={emailVerification.loading}
                >
                  <Ionicons name="send-outline" size={18} color="#FFF" />
                  <Text style={styles.modalButtonText}>
                    {emailVerification.loading ? "Sending..." : "Send OTP"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // Step 2: Enter OTP for verification
              <>
                <View style={styles.otpContainer}>
                  <Ionicons name="lock-closed-outline" size={28} color="#4A80F0" />
                  <Text style={styles.infoText}>Enter the OTP sent to {emailVerification.newEmail}</Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="Enter OTP"
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={4}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.modalPrimaryButton} 
                  onPress={verifyOtpAndUpdateEmail}
                  disabled={emailVerification.loading}
                >
                  <Ionicons name="shield-checkmark-outline" size={18} color="#FFF" />
                  <Text style={styles.modalButtonText}>
                    {emailVerification.loading ? "Verifying..." : "Verify OTP"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.textButton} 
                  onPress={handleSendOTP}
                  disabled={emailVerification.loading}
                >
                  <Ionicons name="refresh-outline" size={16} color="#4A80F0" />
                  <Text style={styles.linkText}>Resend OTP</Text>
                </TouchableOpacity>
              </>
            )}
            
            {emailVerification.error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#DC3545" />
                <Text style={styles.errorText}>{emailVerification.error}</Text>
              </View>
            ) : null}
            
            <TouchableOpacity 
              style={styles.modalSecondaryButton} 
              onPress={resetEmailModal}
            >
              <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Expert Profile Edit Button */}
      {userRole === 'expert' && (
        <TouchableOpacity 
          style={styles.editExpertProfileButton}
          onPress={() => navigation.navigate('EditPortfolio')}
        >
          <Ionicons name="construct-outline" size={20} color="#FFF" />
          <Text style={styles.editExpertProfileText}>Edit My Expert Profile</Text>
        </TouchableOpacity>
      )}
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.editExpertProfileButton}
        onPress={handleLogout}
      >
        <Text style={styles.editExpertProfileText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;