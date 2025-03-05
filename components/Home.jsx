import React, { useState, useEffect,createContext,useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import styles from './styles/Home';
import Recomendations from './Recomendations';
import Footer from './Footer';
import ExpertActivity from './ExpertActivity';
import AskAnExpert from './AskAnExpert';
import Search from './Search';
const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedExperts, setSearchedExperts] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const[email,setEmail] = useState('');
  const[userId,setUserId] = useState(null);
  
  // New State
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("userRole");
        const userId = await AsyncStorage.getItem("userId");
        const email = await AsyncStorage.getItem("email");
        setEmail(email);
        console.warn(role);
        console.warn(userId);
        console.warn(email);
        setUserId(userId);
        if (role !== null) {
          setUserRole(role);
        } else {
          console.warn("User role not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    

    fetchUserRole();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/expert/searchExperts?category=${searchQuery}`
      );
      if (response.data.success) {
        setSearchedExperts(response.data.experts);
      }
      console.warn(response)
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      console.warn("click called");
      handleSearch();
    }
  }, [searchQuery]);
  
  const [portfolio, setPortfolio] = useState(false);

  useEffect(()=>{
    const getPortfolio = async () => {
      try {
    
        if (!userId) {
          Alert.alert('User ID not found');
          return;
        }
        const response = await axios.get(`http://10.0.2.2:3000/expert/portfolio/${userId}`)
        if (response.data.user)
         {setPortfolio(true);}   
    
      } catch (error) {
        console.warn('Error fetching portfolio:', error);
        Alert.alert('Something went wrong, try again later');
      }
    };
    getPortfolio();
  });
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!email || !userRole) return; 
    
    const fetchExperts = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/expert/getExperts');
        if (response.data.success) {
          setExperts(response.data.famousExperts);
        }
        console.log("Experts Data:", response.data);
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };
  
    setLoading(false);
  }, []); 
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications', { userId, email, userRole })}>
            <Ionicons name="notifications-outline" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { userRole, userId })}>
            <Ionicons name="person-circle-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {userRole === "expert" ? (
        <View style={styles.expertSection}>
          <Text style={styles.header}>Welcome, Expert!</Text>
        </View>
      ) : (
        <View style={styles.userSection}>
          <Text style={styles.header}>Famous Experts</Text>
          <FlatList
            data={experts}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.expertCard}>
                <Text style={styles.expertName}>{item.email}</Text>
                <Text style={styles.expertField}>Bio: {item.bio}</Text>
                <Text style={styles.expertField}>Verified: {item.isVerified ? 'Yes' : 'No'}</Text>
              </View>
            )}
          />
        </View>
      )}
        {/* Expert Recommendations */}
        {userRole === 'expert' && <Recomendations />}

        {/* Portfolio Section */}
        {!portfolio && userRole === 'expert' && (
          <View style={styles.portfolioContainer}>
            <Text style={styles.subHeader}>Manage your portfolio and showcase your expertise.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('PortfolioForm', { userRole, userId, email })}
            >
              <Text style={styles.buttonText}>Create Your Portfolio</Text>
            </TouchableOpacity>
          </View>
        )}


        {/* Ask an Expert (for Users) */}
        {userRole === 'user' && <AskAnExpert />}
      </ScrollView>
      
      {/* Footer Component */}
      <Footer />
    </View>
  );
};

export default Home;
