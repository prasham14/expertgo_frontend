import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { UserContext } from '../context/Context';
import styles from '../components/styles/Search';

const Search = ({ route }) => {
  const { openKeyboard } = route.params || {};
  const navigation = useNavigation();
  const { userId, userEmail, userRole } = useContext(UserContext);
  const searchInputRef = useRef(null);
const [hasSearched, setHasSearched] = useState(false);
  // State management
  const [experts, setExperts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedExperts, setSearchedExperts] = useState([]);
  const[isFound,setIsFound] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgUrl, setImageUrl] = useState('');
  const [featuredCategories, setFeaturedCategories] = useState([
    { id: '1', name: 'Business', icon: 'briefcase' },
    { id: '2', name: 'Technology', icon: 'laptop' },
    { id: '3', name: 'Health', icon: 'medkit' },
    { id: '4', name: 'Finance', icon: 'cash' },
    { id: '5', name: 'Education', icon: 'school' },
    { id: '6', name: 'Legal', icon: 'document-text' },
  ]);

  // Focus search input if openKeyboard is true
  useEffect(() => {
    if (openKeyboard && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [openKeyboard]);

  // Set search focus on initial load
  useEffect(() => {
    setIsSearchFocused(!!openKeyboard);
  }, [openKeyboard]);

  // Fetch experts on component mount
  useEffect(() => {
    fetchExperts();
  }, [userId]);


  // Fetch featured experts
  const fetchExperts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://10.0.2.2:3000/expert/getExperts');
      if (response.data.success) {
        setExperts(response.data.famousExperts);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching experts:', error);
      setIsLoading(false);
    }
  };
  
  // Search experts by category
  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  try {
    setIsLoading(true);
    setHasSearched(true); // <-- Add this line
    const response = await axios.get(
      `http://10.0.2.2:3000/expert/searchExperts?category=${searchQuery.trim()}`
    );
    if (response.data.success) {
      setSearchedExperts(response.data.experts);
    }
    setIsLoading(false);
  } catch (error) {
    console.error('Error searching experts:', error);
    setIsLoading(false);
  }
};

  // Debounced search - FIXED the issue here
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const delayDebounceFn = setTimeout(() => {
        // Don't blur the input when searching
        if (isSearchFocused && searchInputRef.current) {
          handleSearch();
        }
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchedExperts([]);
    }
  }, [searchQuery, isSearchFocused]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchedExperts([]);
  };

  // Handle input focus and blur
  const handleInputFocus = () => {
    setIsSearchFocused(true);
  };

  const handleInputBlur = () => {
    setIsSearchFocused(false);
  };

  // Navigate to expert portfolio
  const navigateToPortfolio = (expertId) => {
    navigation.navigate('PortfolioScreen', { 
      expertId: expertId,
      email: userEmail
    });
  };

  const renderExpertCard = ({ item }) => (
    <TouchableOpacity
      style={styles.expertCard}
      onPress={() => navigateToPortfolio(item.userId?._id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.featuredExpertImageContainer}>
          <Image
            source={{ uri: item.profileImage }}
            style={styles.featuredExpertImage}
          />
          {item.isAvailable ? (
            <View style={styles.availabilityBadge}>
              <Text style={styles.availabilityText}>Available</Text>
            </View>
          ) : (
            <View style={[styles.availabilityBadge, styles.unavailableBadge]}>
              <Text style={styles.availabilityText}>Unavailable</Text>
            </View>
          )}
        </View>
      </View>
  
      <View style={styles.expertInfo}>
        <Text style={styles.expertName} numberOfLines={1}>{item.name || 'Expert'}</Text>
        <Text style={styles.expertCategory}>{item.category || 'Category'}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.expertRating}>{item.ratings || '0.0'}</Text>
          <View style={styles.dealsBadge}>
            <Text style={styles.expertDeals}>{item.totalDeals || '0'} Deals</Text>
          </View>
        </View>
        
        <Text style={styles.expertBio} numberOfLines={2}>
          {item.bio || 'Expert bio information...'}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => navigateToPortfolio(item.userId?._id)}
        activeOpacity={0.8}
      >
        <Text style={styles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Category card renderer
  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => {
        setSearchQuery(item.name);
        // Ensure input keeps focus after setting category
        searchInputRef.current?.focus();
      }}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#FFF" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Featured expert card renderer
  const renderFeaturedExpert = ({ item }) => {
    // Don't call fetch within render - it causes too many rerenders
    return (
      <TouchableOpacity 
        style={styles.featuredExpertCard}
        onPress={() => navigateToPortfolio(item.userId?._id)}
        activeOpacity={0.8}
      >
        <View style={styles.featuredExpertImageContainer}>
          <Image 
            source={{ uri: item.profileImage}} 
            style={styles.featuredExpertImage} 
          />
          {item.isVerified ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#FFF" />
            </View>
          ) : null}
        </View>
        <Text style={styles.featuredExpertName} numberOfLines={1}>
          {item.name || item.email || 'Expert'}
        </Text>
        <Text style={styles.featuredExpertCategory} numberOfLines={1}>
          {item.category || 'Professional Expert'}
        </Text>
        <View style={styles.featuredExpertRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.featuredRatingText}>
            {item.ratings || '0.0'}
          </Text>
        </View>
        <View style={styles.featuredExpertRating}>
          <Text style={styles.featuredRatingText}>
            {item.isAvailable ? ('Available'):('Currently Unavailable') || '0.0'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.visitButton}
          onPress={() => navigateToPortfolio(item.userId?._id)}
          activeOpacity={0.8}
        >
          <Text style={styles.visitButtonText}>Visit Profile</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

 

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search experts by category..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {searchQuery !== '' ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={16} color="#8E8E93" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0095f6" />
        </View>
      ) : (
     <>
  {hasSearched ? (
    <FlatList
      data={searchedExperts}
      keyExtractor={(item) => item._id || Math.random().toString()}
      renderItem={renderExpertCard}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.resultsContainer}
      ListHeaderComponent={
        searchedExperts.length > 0 ? (
          <Text style={styles.resultTitle}>
            Found {searchedExperts.length} expert{searchedExperts.length !== 1 ? 's' : ''}
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyText}>No experts found</Text>
        </View>
      }
    />
  ) : (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Categories Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <FlatList
          data={featuredCategories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryCard}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Featured Experts Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Our Trusted Experts</Text>
        {experts.length > 0 ? (
          <FlatList
            data={experts}
            keyExtractor={(item, index) => item._id || index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderFeaturedExpert}
            contentContainerStyle={styles.featuredExpertsContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No experts available at the moment.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )}
</>

      )}
    </View>
  );
};

export default Search;