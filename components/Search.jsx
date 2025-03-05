import React, { useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Footer from './Footer';
const Search = () => {
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
  
    // useEffect(()=>{
    //   const getPortfolio = async () => {
    //     try {
      
    //       if (!userId) {
    //         Alert.alert('User ID not found');
    //         return;
    //       }
    //       const response = await axios.get(`http://10.0.2.2:3000/expert/portfolio/${userId}`)
    //       if (response.data.user)
    //        {setPortfolio(true);}   
      
    //     } catch (error) {
    //       console.warn('Error fetching portfolio:', error);
    //       Alert.alert('Something went wrong, try again later');
    //     }
    //   };
    //   getPortfolio();
    // });
  
    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Search Bar */}
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
  
          {/* Category Recommendations */}
          {isSearchFocused && searchedExperts.length === 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationTitle}>Popular Categories:</Text>
              <View style={styles.recommendationList}>
                {['Law', 'CA', 'Web Developer', 'Designer', 'Marketing'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.recommendationChip}
                    onPress={() => {
                      setSearchQuery(category);
                      setIsSearchFocused(false);
                      setTimeout(() => {
                        handleSearch();
                      }, 100);
                    }}
                  >
                    <Text style={styles.recommendationText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
  
          {/* Search Results */}
          {searchedExperts.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.sectionTitle}>🔍 Search Results</Text>
              <FlatList
                data={searchedExperts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.expertCard}>
                    <View style={styles.expertInfo}>
                      <Ionicons name="person-circle-outline" size={50} color="#007bff" />
                      <View style={styles.expertTextContainer}>
                        <Text style={styles.expertName}>{item.email}</Text>
                        <Text style={styles.expertCategory}>{item.category.join(", ")}</Text>
                      </View>
                    </View>
  
                    <View style={styles.expertDetails}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[...Array(5)].map((_, index) => (
        <Ionicons
          key={index}
          name={index < item.ratings ? "star" : "star-outline"}
          size={16}
          color="#FFD700"
        />
      ))}
    </View>
                      <Text style={styles.expertBio} numberOfLines={3} ellipsizeMode="tail">{item.bio}</Text>
                    </View>
  
                    <View style={styles.chargeContainer}>
                      <Text style={styles.chargeLabel}>💰 Charges for 10 Minutes:</Text>
                      <View style={styles.chargeList}>
                        <Text style={styles.chargeItem}>Video Call: ₹ <Text style={styles.chargeAmount}>{item.charges[0]}</Text></Text>
                        <Text style={styles.chargeItem}>Voice Call: ₹ <Text style={styles.chargeAmount}>{item.charges[1]}</Text></Text>
                      </View>
                    </View>
  
                    <TouchableOpacity
                      style={styles.viewPortfolioButton}
                      onPress={() => navigation.navigate("PortfolioScreen", { expertId: item.userId._id, email })}
                    >
                      <Text style={styles.viewPortfolioText}>View Portfolio</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
  
              {/* Back Button */}
              <TouchableOpacity style={styles.backButton} onPress={() => setSearchedExperts([])}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
        <Footer />
      </View>
    );
}

export default Search

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  
  // Search Container Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#000',
  },
  
  // Recommendations Styles
  recommendationsContainer: {
    marginTop: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  recommendationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recommendationChip: {
    backgroundColor: '#e6e6e6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  recommendationText: {
    color: '#007bff',
    fontSize: 14,
  },
  
  // Results Container Styles
  resultsContainer: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  
  // Expert Card Styles
  expertCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  expertTextContainer: {
    marginLeft: 10,
  },
  expertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expertCategory: {
    fontSize: 14,
    color: '#666',
  },
  
  // Expert Details Styles
  expertDetails: {
    marginBottom: 10,
  },
  expertRatings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  expertRating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  expertBio: {
    fontSize: 14,
    color: '#666',
  },
  
  // Charge Container Styles
  chargeContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  chargeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chargeList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chargeItem: {
    fontSize: 14,
    color: '#333',
  },
  chargeAmount: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  
  // View Portfolio Button
  viewPortfolioButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewPortfolioText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Back Button
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
  },

  });
  