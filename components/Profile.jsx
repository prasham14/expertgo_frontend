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
   const userId = route.params.userId;
   const userRole = route.params.userRole;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUserNameModalVisible, setEditUserNameModalVisible] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [bio, setBio] = useState(null);
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

  const getNameandEmail = async () => {
    try {
      console.warn(userRole);

      if (!userId) return;
      const response = await axios.get(`http://10.0.2.2:3000/profile/getnameandemail/${userId}`);
      setUserData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
      });
      // Set initial username and bio values
      setUsernameInput(response.data.name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update username by calling the backend route
  const handleEditUserName = async () => {
    try {
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


  const getExpertProfile = async () => {
    
    try {
      if(userRole === 'user'){
          return;
      }
      console.warn("UserID from AsyncStorage:", userId); 
  
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }
  
      const response = await axios.get(`http://10.0.2.2:3000/profile/getExpertProfile/${userId}`);
      
      console.log("API Response:", response.data);
  
      if (response.status === 200) {
        setBio(response.data.data.bio); 
        console.warn("bio" , bio);
      } else {
        throw new Error("Failed to fetch expert profile.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
    }
  };
  


const [uploadResponse, setUploadResponse] = useState(null);
const [imageUrl, setImageUrl] = useState(null);

useEffect(() => {
  const fetchImage = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:3000/profile/images/${userId}`);
      setImageUrl(response.data.url); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching image:', error);
      setLoading(false);
    }
  };

  fetchImage();
}, [userId]);
const chooseImage = () => {
  launchImageLibrary({ mediaType: 'photo' }, (response) => {
    if (response.assets) {
      const selectedImage = response.assets[0];
      uploadImage(selectedImage);
    }
  });
};

// Upload image to the server
const uploadImage = async (image) => {
  setLoading(true);
  const formData = new FormData();
  formData.append('image', {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  });

  try {
    const response = await axios.post(`http://10.0.2.2:3000/profile/upload/profile-image/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    setUserData({ ...userData, profileImage: response.data.image.url });
    setUploadResponse(response.data);
    setLoading(false);
    Alert.alert('Image uploaded successfully!');
  } catch (error) {
    console.error('Error uploading image:', error);
    setLoading(false);
    Alert.alert('Error uploading image');
  }
};







  useEffect(() => {
    const fetchData = async () => {
      try {
        // First function runs regardless of userRole
        await getNameandEmail();
        await getExpertProfile();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
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
          <View style={styles.profileContainer}>
          {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      ) : (
        <Text>No image found</Text>
      )}
        <TouchableOpacity style={styles.imageOverlay} onPress={chooseImage}>
          <Ionicons name="add-circle" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading && <Text style={styles.loadingText}>Uploading...</Text>}
      {uploadResponse && (
        <View style={styles.responseContainer}>
          <Text>Uploaded Image URL: {uploadResponse.image.url}</Text>
        </View>
      )}
          {/* Username Row with edit icon */}
          <View style={styles.usernameRow}>
            <Text style={styles.username}>{  userData.name || "N/A"}</Text>
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
              <Text style={styles.bioValue}>{bio || "No bio available."}</Text>
            </View>
          )}
        </View>
      )}
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
            <TouchableOpacity style={styles.saveButton} >
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
          <TouchableOpacity style={styles.saveButton} >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setExpertProfileModal(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

      <Portfolio style={styles.Portfolio} userRole={ route.params.userRole} userId={userId} email ={formData.email}/>
    </ScrollView>
  );
};

export default Profile;
