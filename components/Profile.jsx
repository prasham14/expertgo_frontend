// Profile.js (React Native Component)
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Modal, 
  Animated, 
  TextInput, 
  Alert ,
  FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './styles/Profile';
import { useRoute } from '@react-navigation/native';
import Portfolio from './Portfolio';

const Profile = () => {
  const route = useRoute();

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUserNameModalVisible, setEditUserNameModalVisible] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [bio, setBio] = useState('');
  const[categories,setCategories] = useState([]);
  const[charges,setCharges] = useState([]);
  const [editBioModal, setEditBioModal] = useState(false);
  const[expertProfileModal,setExpertProfileModal]= useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [categoryInput, setCategoryInput] = useState('');
  const [chargeInput, setChargeInput] = useState('');

  const addCategory = () => {
    if (categoryInput.trim() !== '') {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput('');
    }
  };

  const addCharge = () => {
    if (chargeInput.trim() !== '') {
      setCharges([...charges, chargeInput.trim()]);
      setChargeInput('');
    }
  };
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fetch user profile details
  const getProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`http://10.0.2.2:3000/profile/profile/${userId}`);
      setUserData(response.data.user);
      setFormData({
        name: response.data.user.name || '',
        email: response.data.user.email || '',
      });
      // Set initial username and bio values
      setUsernameInput(response.data.user.name || '');
      setBio(response.data.user.bio || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleEditProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.patch(`http://10.0.2.2:3000/profile/editProfile/${userId}`, formData);
      setUserData(response.data.user);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Error", "There was an error updating your profile.");
    }
  };


  // Update username by calling the backend route
  const handleEditUserName = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      // Call the backend route for editing username
      const response = await axios.patch(`http://10.0.2.2:3000/profile/editUserName/${userId}`, { username: usernameInput });
      setUserData(prevData => ({
        ...prevData,
        name: response.data.user.name,
      }));
      setEditUserNameModalVisible(false);
      Alert.alert("Success", "Username updated successfully.");
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "There was an error updating your username.");
    }
  };

  // Update bio by calling the backend route
  const handleBio = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }
  
      // Use the latest state by accessing them inside the setState callback
      setCategories(prevCategories => {
        setCharges(prevCharges => {
          axios.post(`http://10.0.2.2:3000/user/editExpertData/${userId}`, {
            bio,
            charges: prevCharges,  // Ensure the latest charges are sent
            categories: prevCategories, // Ensure the latest categories are sent
          })
          .then(response => {
            if (response.data) {
              setUserData(prevData => ({
                ...prevData,
                bio: response.data.bio,
                charges: response.data.charges,
                categories: response.data.categories,
              }));
  
              setEditBioModal(false);
              Alert.alert("Success", "Profile updated successfully.");
            } else {
              Alert.alert("Error", "Unexpected response from server.");
            }
          })
          .catch(error => {
            console.error("Error updating bio:", error);
            Alert.alert("Error", "There was an error updating your profile.");
          });
  
          return prevCharges;
        });
  
        return prevCategories;
      });
    } catch (error) {
      console.error("Error updating bio:", error);
      Alert.alert("Error", "There was an error updating your profile.");
    }
  };
  
  

  // Function to open the image library and choose an image
  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert("Error", "There was an error selecting the image.");
      } else if (response.assets && response.assets.length > 0) {
        // Use the first selected asset
        const asset = response.assets[0];
        const { uri, fileName, type } = asset;
        await uploadProfileImage(uri, fileName, type);
      } else {
        Alert.alert("Error", "No image selected.");
      }
    });
  };

  // Function to upload the selected image to the server
  const uploadProfileImage = async (uri, fileName, type) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
  
      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        name: fileName || `profile_${Date.now()}.jpg`,
        type: type || 'image/jpeg',
      });
      console.warn(formData);
  
      // Post to the Express endpoint. Remove explicit 'Content-Type' header.
      const response = await axios.post(
        `http://10.0.2.2:3000/profile/upload/profile-image/${userId}`,
        formData,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
  
      console.warn("Response data:", response.data);
      setUserData(prevData => ({
        ...(prevData || {}),
        profileImage: response.data.profileImage,
      }));
  
      Alert.alert("Success", "Profile image updated successfully.");
    } catch (error) {
      console.warn('Error uploading profile image:', error);
      Alert.alert("Error", "There was an error uploading the image. Please try again.");
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      {/* New Profile Section */}
      {userData && (
        <View style={styles.profileSection}>
          {/* Profile Image Container with Plus Icon Overlay */}
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: userData.profileImage || 'https://via.placeholder.com/150' }}
            />
            <TouchableOpacity style={styles.imageOverlay} onPress={handleChooseImage}>
              <Ionicons name="add-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Username Row with edit icon */}
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{userData.username || userData.name || "N/A"}</Text>
            <TouchableOpacity 
              onPress={() => {
                setUsernameInput(userData.username || userData.name || "");
                setEditUserNameModalVisible(true);
              }}
            >
              <Ionicons name="create-outline" size={20} color="#000" style={styles.editIcon} />
            </TouchableOpacity>
            <Text style={styles.tickIcon}>✔</Text>
          </View>
          {/* Email Section */}
          <View style={styles.emailSection}>
            <View style={styles.row}>
              <Text style={styles.emailLabel}>Email</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(true)}>
                <Text style={styles.editIconText}>✎</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.emailValue}>{userData.email || "N/A"}</Text>
          </View>
          {/* Bio Section with Edit Icon (shown only for experts) */}
          {route.params.userRole === 'expert' && (
            <View style={styles.bioSection}>
              <View style={styles.row}>
                <Text style={styles.bioLabel}>Bio</Text>
                <TouchableOpacity onPress={() => {
                  setBio(userData.bio || "");
                }}>
                </TouchableOpacity>
              </View>
              <Text style={styles.bioValue}>{userData.bio || "No bio available."}</Text>
            </View>
          )}
        </View>
      )}
      

    
      {/* Edit Profile Modal (for email) */}
      <Modal animationType="slide" transparent visible={editModalVisible} onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleEditProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

   

      {/* Edit Username Modal */}
      <Modal animationType="slide" transparent visible={editUserNameModalVisible} onRequestClose={() => setEditUserNameModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Edit Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new username"
              value={usernameInput}
              onChangeText={setUsernameInput}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleEditUserName}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditUserNameModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Bio Modal */}
      <Modal animationType="slide" transparent visible={editBioModal} onRequestClose={() => setEditBioModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Edit Bio</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Enter your new bio"
              value={bio}
              onChangeText={setBio}
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleBio}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditBioModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent visible={expertProfileModal} onRequestClose={() => setExpertProfileModal(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Enter Details</Text>

          {/* Bio Input */}
          <TextInput
            style={styles.textArea}
            placeholder="Enter your bio (Max 100 words)"
            value={bio}
            onChangeText={setBio}
            multiline
          />

          {/* Category Input */}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Enter a category and press Add"
              value={categoryInput}
              onChangeText={setCategoryInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCategory}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
          />

          {/* Charges Input */}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Enter charges per hour and press Add"
              value={chargeInput}
              onChangeText={setChargeInput}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={addCharge}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={charges}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.listItem}>{item} INR/hr</Text>}
          />

          {/* Action Buttons */}
          <TouchableOpacity style={styles.saveButton} onPress={handleBio}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setExpertProfileModal(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      <Portfolio/>
    </ScrollView>
  );
};

export default Profile;
