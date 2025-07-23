// Profile.js (Restructured to match UI design)
import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../components/styles/Profile';
import {UserContext} from '../context/Context';

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
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const name =  AsyncStorage.getItem('name');
    const email =  AsyncStorage.getItem('email');
  // Extract route params
  const {userId, userRole} = route.params;
  const {clearUserData} = useContext(UserContext);
  const {setUserEmail} = useContext(UserContext);
 
  const [editUserNameModalVisible, setEditUserNameModalVisible] =
    useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [editEmailModal, setEditEmailModal] = useState(false);
  const [otp, setOtp] = useState('');
  // Get state from Redux store
  const {userData, expertData, imageUrl, loading, error, emailVerification} =
    useSelector(state => state.profile);

  // Destructure expert data
  const {bio, isAvailable, isVerified} = expertData;

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
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        const selectedImage = response.assets[0];
        dispatch(uploadProfileImage({userId, image: selectedImage}))
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
    dispatch(updateUsername({userId, username: usernameInput}))
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

    dispatch(updateBio({userId, bio: tempBio}))
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
    dispatch(toggleExpertAvailability({userId, isAvailable: newStatus}))
      .unwrap()
      .then(() => {
        Alert.alert(
          'Success',
          `You are now ${newStatus ? 'Available' : 'Unavailable'}`,
        );
      })
      .catch(err => {
        Alert.alert('Error', 'Please Create a Portfolio first');
        navigation.navigate('Portfolio');
      });
  };

  // Email verification
  const handleSendOTP = () => {
    const newEmail = emailVerification.newEmail;

    if (!newEmail) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    dispatch(sendVerificationOTP({email: newEmail}))
      .unwrap()
      .then(() => {
        Alert.alert(
          'Success',
          'OTP sent to your email. Please check and enter below.',
        );
      })
      .catch(err => {
        Alert.alert('Error', err || 'Error sending OTP');
      });
  };

  const verifyOtpAndUpdateEmail = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      await dispatch(
        verifyOTP({email: emailVerification.newEmail, otp}),
      ).unwrap();

      await dispatch(
        updateEmail({userId, newEmail: emailVerification.newEmail}),
      ).unwrap();

      setUserEmail(emailVerification.newEmail);
      await AsyncStorage.setItem('email', emailVerification.newEmail);
      resetEmailModal();
      Alert.alert('Success', 'Email updated successfully!');
    } catch (err) {
      Alert.alert('Error', err?.message || 'Invalid OTP. Please try again.');
    }
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
        navigation.replace('MainTabs');
      })
      .catch(err => {
        Alert.alert('Error', 'Could not update.');
      });
  };

  // Logout
  const handleLogout = async () => {
    await clearUserData();
    navigation.replace('Google');
  };

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
        {/* Profile Header */}
        <Text style={styles.profileTitle}>PROFILE</Text>

        {/* Main Profile Section */}
        {userData && (
          <View style={styles.profileMainSection}>
            {/* Profile Image + Info Section */}
            <View style={styles.profileBox}>
              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                {imageUrl ? (
                  <Image source={{uri: imageUrl}} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>
                      {userData.name
                        ? userData.name.charAt(0).toUpperCase()
                        : '?'}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.imageEditButton}
                  onPress={chooseImage}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* User Info Section */}
              <View style={styles.userInfoSection}>
                <View style={styles.nameRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setUsernameInput(userData.name || '');
                      setEditUserNameModalVisible(true);
                    }}
                    style={styles.nameButton}>
                    <Text style={styles.userName}>
                      {name || 'N/A'}
                    </Text>
                      {isVerified && (
                    <View style={styles.verificationBadge}>
                      <MaterialIcons
                        name="verified"
                        size={26}
                        color="#0096FF"
                      />
                    </View>
                  )}
                    <Feather name="edit-2" size={16} color="#666" />
                  </TouchableOpacity>

                
                </View>

                <TouchableOpacity
                  style={styles.emailSection}
                  onPress={() => setEditEmailModal(true)}>
                  <Text style={styles.emailText}>
                    {email || 'N/A'}
                  </Text>
                  <Feather name="edit-2" size={16} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Availability toggle inside profile box */}
              {userRole === 'expert' && (
                <TouchableOpacity
                  style={[
                    styles.availabilityToggleTopRight,
                    {backgroundColor: isAvailable ? '#28A745' : '#DC3545'},
                  ]}
                  onPress={toggleAvailability}>
                  <Ionicons
                    name={isAvailable ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.availabilityToggleText}>
                    {isAvailable ? 'Online' : 'Offline'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Loading indicator */}
            {loading && (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator color="#4A80F0" size="small" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
          </View>
        )}

        {userRole === 'expert' && bio && (
          <View style={styles.bioContainer}>
            <View style={styles.bioHeader}>
              <Text style={styles.bioTitle}>Bio</Text>
              {!isEditing && (
                <TouchableOpacity onPress={handleEditBio}>
                  <Feather name="edit-2" size={16} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            {!isEditing ? (
              <Text style={styles.bioText}>
                {bio || 'Add your professional bio here...'}
              </Text>
            ) : (
              <View style={styles.bioEditContainer}>
                <TextInput
                  style={styles.bioInput}
                  value={tempBio}
                  onChangeText={setTempBio}
                  placeholder="Write a short bio about yourself..."
                  placeholderTextColor="#888"
                  multiline
                  autoFocus
                />
                <View style={styles.bioActionButtons}>
                  <TouchableOpacity onPress={saveBio} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Become Expert Button - Only for regular users */}
          {userRole === 'user' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={becomeAnExpert}>
              <Text style={styles.actionButtonText}>Become Expert</Text>
            </TouchableOpacity>
          )}
          {/* // Expert Profile Edit Button */}
          {userRole === 'expert' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditPortfolio')}>
              <Text style={styles.actionButtonText}>
                Edit My Expert Profile
              </Text>
            </TouchableOpacity>
          )}
          {/* Get Verified Button */}
          {!isVerified && userRole === 'expert' && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Get Verified</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('Bank-details', {
                userId: userId,
                navigation: navigation,
              })
            }>
            <Text style={styles.actionButtonText}>Bank Details</Text>
          </TouchableOpacity>
          {/* Settings Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit username modal */}
      <Modal
        animationType="slide"
        transparent
        visible={editUserNameModalVisible}
        onRequestClose={() => setEditUserNameModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Username</Text>
              <TouchableOpacity
                onPress={() => setEditUserNameModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Optional Email Input (remove if not required in username modal) */}
            {/* 
      <TextInput
        style={styles.modalInput}
        placeholder="Enter your new email"
        onChangeText={text =>
          dispatch(setEmailVerificationState({ newEmail: text }))
        }
        keyboardType="email-address"
        autoCapitalize="none"
      />
      */}

            <TextInput
              style={styles.modalInput}
              placeholder="Enter new username"
              value={usernameInput}
              onChangeText={setUsernameInput}
            />

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={handleEditUserName}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={() => setEditUserNameModalVisible(false)}>
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
        onRequestClose={resetEmailModal}>
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
                 
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter your new email"
                    placeholderTextColor='#888'
                    value={emailVerification.newEmail}
                    onChangeText={text =>
                      dispatch(setEmailVerificationState({newEmail: text}))
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={handleSendOTP}
                  disabled={emailVerification.loading}>
                  <Ionicons name="send-outline" size={18} color="#FFF" />
                  <Text style={styles.modalButtonText}>
                    {emailVerification.loading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // Step 2: Enter OTP for verification
              <>
                <View style={styles.otpContainer}>
                  <Text style={styles.infoText}>
                    Enter the OTP sent to {emailVerification.newEmail}
                  </Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="Enter OTP"
                                        placeholderTextColor='#888'

                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={4}
                  />
                </View>
                <TouchableOpacity
                  style={styles.modalPrimaryButton}
                  onPress={verifyOtpAndUpdateEmail}
                  disabled={emailVerification.loading}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.modalButtonText}>
                    {emailVerification.loading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.textButton}
                  onPress={handleSendOTP}
                  disabled={emailVerification.loading}>
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
              onPress={resetEmailModal}>
              <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;
