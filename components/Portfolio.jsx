import {   Text, View, TouchableOpacity,Modal,TextInput,Alert} from 'react-native'
import React, { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles/Portfolio';
import { useNavigation } from '@react-navigation/native';
const Portfolio = ({userRole,userId,email}) => {
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
  const[editExpertProfileModal,setEditExpertProfileModal]=useState(false);
  const[expertProfileData,setExpertProfileData]=useState( {
    category:'',
    charges:'',
    isVerified:'',
    ratings:'',
    totalDeals:''
  });
  const[showExpertProfileModal,setShowExpertProfileModal] = useState(false);
  const [submitted, setSubmitted] =useState(false);
  const navigation = useNavigation(); 

  const getPortfolio = async (navigation) => {
    try {
  
      if (!userId) {
        Alert.alert('User ID not found');
        return;
      }
  
      // Handle errors inside 'then' instead of 'catch'
      const response = await axios.get(`http://10.0.2.2:3000/expert/portfolio/${userId}`)
        .catch(error => {
          if (error.response && error.response.status === 404) {
            Alert.alert(
              'Portfolio Not Found',
              'You have not created a portfolio. Would you like to create one now?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Create Now', onPress: () => navigation.navigate('PortfolioForm',{userId:userId,email:email})}
              ]
            );
            return null; 
          } else {
            throw error; 
          }
        });
  
      if (!response || !response.data || !response.data.user) return;
  
      setPortfolioData(response.data.user);
      setPortfolioFormData({
        fullName: response.data.user.fullName || '',
        email: response.data.user.email || '',
        currentPost: response.data.user.currentPost || '',
        url: response.data.user.url || '',
        experience: response.data.user.experience || '',
        skills: Array.isArray(response.data.user.skills) ? response.data.user.skills.join(", ") : '',
      });
      
  
      setModalVisible(true);
    } catch (error) {
      console.warn('Error fetching portfolio:', error);
      Alert.alert('Something went wrong, try again later');
    }
  };
  
  
  const handleGetPortfolio = () => {
    getPortfolio(navigation);
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
    if (!portfolioFormData.fullName.trim() || !portfolioFormData.currentPost.trim() || !portfolioFormData.experience.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields for your portfolio.");
      return;
    }
  
    try {
      const updatedData = {
        ...portfolioFormData,
        skills: portfolioFormData.skills.split(',').map(skill => skill.trim()), // Convert string back to array
      };
      
  
      const response = await axios.patch(`http://10.0.2.2:3000/expert/editPortfolio/${userId}`, updatedData);
      setPortfolioData(response.data.user);

      setEditPortfolioModalVisible(false);
      Alert.alert("Success", "Portfolio updated successfully!");
    } catch (error) {
      console.error('Error updating portfolio:', error);
      Alert.alert("Error", "There was an error updating your portfolio. Please try again.");
    }
  };
  
  const isExpertProfileCreated=async ()=>{
    if(userRole === 'user'){
      return;
  }
    try {
      console.warn("UserID from AsyncStorage:", userId); 
  
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }
  
      const response = await axios.get(`http://10.0.2.2:3000/profile/getExpertProfile/${userId}`);
      
      console.log("API Response:", response.data);
       
      if (response.status === 200) {
       setSubmitted(true);
      } 
    } catch (error) {
      console.error(" Error fetching profile:", error.response?.data || error.message);
      Alert.alert("Error", "Tnnnng your profile.");
    }
  }
const getExpertProfile = async()=>{
  try {
    const response = await axios.get(`http://10.0.2.2:3000/profile/getExpertProfile/${userId}`);
    
    console.warn("API Response:", response.data);
     
    if (response.status === 200) {
      setExpertProfileData( {
        category:response.data.data.category,
        charges:response.data.data.charges,
        isVerified:response.data.data.isVerified,
        ratings:response.data.data.ratings,
        totalDeals:response.data.data.totalDeals
      });
      console.warn(expertProfileData);
      setShowExpertProfileModal(true);
    } 
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    Alert.alert("Error", "Tnnnng your profile.");
  }


}
const [newCategory, setNewCategory] = useState('');
const [newCharge, setNewCharge] = useState('');

const handleEditExpertProfileData = async () => {
  try {
    // Validate inputs
    if (expertProfileData.category.length === 0) {
      Alert.alert("Validation Error", "Please add at least one category.");
      return;
    }

    if (expertProfileData.charges.length === 0) {
      Alert.alert("Validation Error", "Please add charges for services.");
      return;
    }

    const updatedData = {
      category: expertProfileData.category.split(',').map(cat => cat.trim()),
      charges: expertProfileData.charges.split(',').map(charge => parseFloat(charge.trim())),
      bio: expertProfileData.bio || '' 
    };

    const response = await axios.patch(
      `http://10.0.2.2:3000/profile/editExpertProfile/${userId}`, 
      updatedData
    );

    if (response.data && response.data.data) {
      // Update local state with the response data
      setExpertProfileData({
        category: response.data.data.category.join(', '),
        charges: response.data.data.charges.join(', '),
        bio: response.data.data.bio || '',
        isVerified: response.data.data.isVerified,
        ratings: response.data.data.ratings,
        totalDeals: response.data.data.totalDeals
      });

      setEditExpertProfileModal(false);
      Alert.alert("Success", "Expert Profile updated successfully!");
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error('Error updating expert profile:', error);
    Alert.alert(
      "Error", 
      error.response?.data?.message || "There was an error updating your profile. Please try again."
    );
  }
};

const addCategory = () => {
  if (!newCategory.trim()) {
    Alert.alert("Error", "Category cannot be empty");
    return;
  }

  const updatedCategories = expertProfileData.category 
    ? `${expertProfileData.category}, ${newCategory.trim()}` 
    : newCategory.trim();

  setExpertProfileData(prev => ({
    ...prev,
    category: updatedCategories
  }));
  setNewCategory(''); // Clear the input
};

const addCharge = () => {
  if (!newCharge.trim()) {
    Alert.alert("Error", "Charge cannot be empty");
    return;
  }

  const updatedCharges = expertProfileData.charges
    ? `${expertProfileData.charges}, ${newCharge.trim()}`
    : newCharge.trim();

  setExpertProfileData(prev => ({
    ...prev,
    charges: updatedCharges
  }));
  setNewCharge(''); // Clear the input
};


    useEffect(() => {
      const fetch = async () => {
        try {
          await isExpertProfileCreated();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetch();
    }, []);
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
  Skills: <Text style={styles.value}>
    {Array.isArray(portfolioData.skills) ? portfolioData.skills.join(", ") : "N/A"}
  </Text>
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
       !submitted &&  userRole==='expert' ?(<TouchableOpacity style={styles.closeButton} onPress={()=>navigation.navigate('Expert',{isExpertsubmitted:submitted}) }>
        <Text style={styles.buttonText}>Create Expert profile</Text>
      </TouchableOpacity>):(
          userRole === 'expert' ? (<TouchableOpacity style={styles.closeButton} onPress={()=>setEditExpertProfileModal(true)}>
          <Text style={styles.buttonText}>Edit Expert profile</Text>
        </TouchableOpacity>):(null)
        )
       }
       {
        submitted ? (<TouchableOpacity style={styles.closeButton} onPress={getExpertProfile}>
        <Text style={styles.buttonText}>Show Expert profile</Text>
      </TouchableOpacity>):(null)
       }
      
      <Modal 
    animationType="fade" 
    transparent 
    visible={editExpertProfileModal} 
    onRequestClose={() => setEditExpertProfileModal(false)}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.sectionTitle}>Edit Expert Profile</Text>
        
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add Category"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <TouchableOpacity style={styles.addButton} onPress={addCategory}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Current Categories"
          value={expertProfileData.category}
          editable={false}
        />
        
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Add Charge"
            value={newCharge}
            onChangeText={setNewCharge}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.addButton} onPress={addCharge}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Current Charges"
          value={expertProfileData.charges}
          editable={false}
        />
        
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Bio"
          value={expertProfileData.bio}
          onChangeText={(text) => setExpertProfileData({ 
            ...expertProfileData, 
            bio: text 
          })}
          multiline
        />
      
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleEditExpertProfileData}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => setEditExpertProfileModal(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
    
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
                  value={portfolioFormData.experience}
                  onChangeText={(text) => setPortfolioFormData({ ...portfolioFormData, experience: text })}
                />
               <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Skills (comma separated)"
                  value={portfolioFormData.skills}
                  onChangeText={(text) =>
                    setPortfolioFormData({ ...portfolioFormData, skills: text })
                  }
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

        {  userRole === 'expert'  ? (<View style={styles.bottomButtons}>
                  <TouchableOpacity style={styles.button} onPress={handleGetPortfolio}>
                    <Text style={styles.buttonText}>View Portfolio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={()=>setEditPortfolioModalVisible(true)}>
                    <Text style={styles.buttonText}>Edit Portfolio</Text>
                  </TouchableOpacity>
                
                </View>):(null) }
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                  </TouchableOpacity>




                  <Modal animationType="slide" transparent visible={showExpertProfileModal} onRequestClose={() => setShowExpertProfileModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.sectionTitle}>Expert Profile</Text>
              <>
                <Text style={styles.label}>
                  Your categories: <Text style={styles.value}>{ expertProfileData.category || "N/A"}</Text>
                </Text> 
                 <Text style={styles.label}>
                  Your charges : <Text style={styles.value}>{expertProfileData.charges|| "N/A"}</Text>
                </Text>
                <Text style={styles.label}>
                  Total Deals: <Text style={styles.value}>{expertProfileData.totalDeals === 0 ? ("No Deals Yet"):(expertProfileData.totalDeals) }</Text>
                </Text>
                <Text style={styles.label}>
                  Ratings: <Text style={styles.value}>{expertProfileData.ratings === 0 ?("You have not rated by anyone"):(expertProfileData.ratings)}</Text>
                </Text>
                <Text style={styles.label}>
                  Verified: <Text style={styles.value}>{ expertProfileData.isVerified === false ? ("You are not verified"): ("Yes")}</Text>
                </Text>
              </>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowExpertProfileModal(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        </View>
  )
}

export default Portfolio