import React, { useState, useEffect } from 'react';
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
const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedExperts, setSearchedExperts] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // New State
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
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
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]); 

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* 🔹 Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { userRole })}>
            <Ionicons name="person-circle-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* 🔎 Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search experts by category..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* 🔹 Category Recommendations (Show only when search is focused) */}
       {/* 🔹 Category Recommendations (Show only when search is focused) */}
{isSearchFocused && searchedExperts.length === 0 && (
  <View style={styles.recommendationsContainer}>
    <Text style={styles.recommendationTitle}>Popular Categories:</Text>
    <View style={styles.recommendationList}>
      {['Law', 'CA', 'Web Developer', 'Designer', 'Marketing', 'skk'].map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.recommendationChip}
          onPress={() => {
            setSearchQuery(category); 
            handleSearch();
            setIsSearchFocused(false); 
          }}
        >
          <Text style={styles.recommendationText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)}

        {/* 📌 Search Results */}
        {searchedExperts.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <FlatList
              data={searchedExperts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.expertCard}>
                  {/* Expert Info Section */}
                  <View style={styles.expertInfo}>
                    <Ionicons name="person-circle-outline" size={50} color="#007bff" />
                    <View style={styles.expertTextContainer}>
                      <Text style={styles.expertName}>{item.email}</Text>
                      <Text style={styles.expertCategory}>{item.category.join(', ')}</Text>
                    </View>
                  </View>

                  {/* Ratings & Bio */}
                  <View style={styles.expertDetails}>
                    <View style={styles.expertRatings}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.expertRating}> {item.ratings} ⭐</Text>
                    </View>
                    <Text style={styles.expertBio}>{item.bio}</Text>

                    {/* Charges on the right */}
                    <Text style={styles.expertCharges}>{item.charges.join(', ')}</Text>
                  </View>

                  {/* View Portfolio Button */}
                  <TouchableOpacity
                    style={styles.viewPortfolioButton}
                    onPress={() => navigation.navigate('PortfolioScreen', { userId: item.userId })}
                  >
                    <Text style={styles.viewPortfolioText}>View Portfolio</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            {/* 🔙 Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => setSearchedExperts([])}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        ) : (

          <>
            <Recomendations />
            <ExpertActivity userRole={userRole} />
            <AskAnExpert/>

          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default Home;
