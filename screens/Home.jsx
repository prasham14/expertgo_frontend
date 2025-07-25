import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import homeStyles from '../components/styles/Home';
import {UserContext} from '../context/Context';

const Home = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [portModal, setPortModal] = useState(false);
  const {userId, userEmail, userRole} = useContext(UserContext);
  const [bankDetails, setBankDetails] = useState(false);
  const [bankDetailsFetched, setBankDetailsFetched] = useState(false);
  const [showContent, setShowContent] = useState(false); 
  console.log('role home', userRole);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (userRole) setShowContent(true);
    }, 500); // Adjust delay if needed
    return () => clearTimeout(timeout);
  }, [userRole]);

  useEffect(() => {
    const getPortfolio = async () => {
      if (!userId || userRole === 'user') return;

      try {
        const response = await axios.get(
          `https://expertgo-v1.onrender.com/expert/profile/${userId}`,
        );
        if (response.data.message === 'Expert profile not found') {
          setPortModal(true);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data.message === 'Expert profile not found'
        ) {
          setPortModal(true);
        }
      }
    };

    if (userId) {
      getPortfolio();
    }
  }, [userId, userRole]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(
          'https://expertgo-v1.onrender.com/expert/getExperts',
        );
        if (response.data.success) {
          setExperts(response.data.famousExperts);
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
      setLoading(false);
    };

    fetchExperts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      const fetchBankDetails = async () => {
        try {
          const response = await axios.get(
            `https://expertgo-v1.onrender.com/bank/get-bank-details/${userId}`,
          );
          setBankDetails(!!response?.data);
        } catch (err) {
          setBankDetails(false);
        } finally {
          setTimeout(() => setBankDetailsFetched(true), 500);
        }
      };

      fetchBankDetails();
    }, [userId]),
  );

  const handleNavigate = () => {
    navigation.navigate('Search', {openKeyboard: true});
  };

  // Sample data for enhanced UI components
  const featuredCategories = [
    {
      id: 1,
      title: 'Business',
      icon: 'briefcase-outline',
      experts: '150+',
    },
    {
      id: 2,
      title: 'Health',
      icon: 'medical-outline',
      experts: '200+',
    },
    {id: 3, title: 'Technology', icon: 'code-slash-outline', experts: '180+'},
    {id: 4, title: 'Education', icon: 'school-outline', experts: '120+'},
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Search',
      description: 'Find experts in your field of interest',
    },
    {
      step: 2,
      title: 'Connect',
      description: 'Book a session with your preferred expert',
    },
    {
      step: 3,
      title: 'Learn',
      description: 'Get personalized guidance and advice',
    },
  ];

  if (!showContent) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A6572" />
        <Text style={homeStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    
    <View style={homeStyles.container}>
      <StatusBar backgroundColor="#4A6572" barStyle="light-content" />

      <View style={homeStyles.header}>
        <View style={homeStyles.headerControls}>
          <TouchableOpacity
            style={homeStyles.searchContainer}
            onPress={handleNavigate}>
            <Ionicons
              name="search"
              size={18}
              color="#8E8E93"
              style={homeStyles.searchIcon}
            />
            <Text style={homeStyles.searchPlaceholder}>Search experts...</Text>
          </TouchableOpacity>

          <View style={homeStyles.headerButtons}>
            {userRole === 'expert' && (
              <TouchableOpacity
                style={homeStyles.iconButton}
                onPress={() =>
                  navigation.navigate('Notifications', {
                    userId,
                    email: userEmail,
                    userRole,
                  })
                }>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#4A6572"
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={homeStyles.iconButton}
              onPress={() =>
                navigation.navigate('Profile', {userRole, userId})
              }>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#4A6572"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={homeStyles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A6572']}
          />
        }>
        {/* Welcome Section */}
        <View style={homeStyles.welcomeSection}>
          <Text style={homeStyles.welcomeText}>Welcome to ExpertGo!</Text>
          <Text style={homeStyles.welcomeSubtext}>
            {userRole === 'expert'
              ? 'Ready to share your expertise with the world?'
              : 'Connect with top experts and unlock your potential.'}
          </Text>
        </View>

        {loading ? (
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A6572" />
            {/* <Text style={homeStyles.loadingText}>Loading experts...</Text> */}
          </View>
        ) : (
          <></>
        )}

        {bankDetailsFetched && !bankDetails && (
          <View style={homeStyles.bankPromptContainer}>
            <Text style={homeStyles.bankPromptText}>
              {userRole === 'user'
                ? 'Please complete your bank details for refunds.'
                : 'Please complete your bank details to start receiving payments.'}
            </Text>
            <TouchableOpacity
              style={homeStyles.bankPromptButton}
              onPress={() => navigation.navigate('Bank-details')}>
              <Text style={homeStyles.bankPromptButtonText}>
                Add Bank Details
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Featured Categories Section */}
        <View style={homeStyles.specialSection}>
          <View style={homeStyles.specialHeader}>
            <Text style={homeStyles.specialTitle}>Explore Popular Categories</Text>
            <TouchableOpacity onPress={handleNavigate}>
              <Text style={homeStyles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={homeStyles.categoriesContainer}>
            {featuredCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  homeStyles.categoryCard,
                  index % 2 === 1 && homeStyles.categoryDark,
                ]}
                onPress={handleNavigate}>
                <Text
                  style={[
                    homeStyles.categoryTitle,
                    index % 2 === 1 && homeStyles.categoryTitleDark,
                  ]}>
                  {category.title}
                </Text>
                <Text
                  style={[
                    homeStyles.categoryDescription,
                    index % 2 === 1 && homeStyles.categoryDescriptionDark,
                  ]}>
                  {category.experts} experts
                </Text>
                <View style={homeStyles.categoryButton}>
                  <Ionicons name={category.icon} size={20} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        {userRole === 'user' && (
          <View style={homeStyles.howItWorksSection}>
            <Text style={homeStyles.sectionTitle}>How ExpertGo Works</Text>
            <View style={homeStyles.stepsContainer}>
              {howItWorksSteps.map(step => (
                <View key={step.step} style={homeStyles.stepCard}>
                  <View style={homeStyles.stepNumber}>
                    <Text style={homeStyles.stepNumberText}>{step.step}</Text>
                  </View>
                  <Text style={homeStyles.stepTitle}>{step.title}</Text>
                  <Text style={homeStyles.stepDescription}>
                    {step.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Experts Section */}
        {experts.length > 0 && (
          <View style={homeStyles.specialSection}>
            <View style={homeStyles.specialHeader}>
              <Text style={homeStyles.specialTitle}>Verfied Experts</Text>
              <TouchableOpacity onPress={handleNavigate}>
                <Text style={homeStyles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
data={experts.filter(item => item.isAvailable).slice(0, 5)}
              keyExtractor={item =>
                item.id?.toString() || Math.random().toString()
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={homeStyles.expertCard}
                  onPress={() =>
                    navigation.navigate('PortfolioScreen', {
                      expertId: item.userId?._id,
                      email: userEmail,
                    })
                  }>
                  <Text style={homeStyles.expertName}>
                    {item.name || 'Expert'}
                  </Text>
                  <Text style={homeStyles.expertSpeciality}>
                    {item.category[0] || 'Professional'}
                  </Text>
                  <View style={homeStyles.expertMeta}>
                    <View style={homeStyles.metaItem}>
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text style={homeStyles.metaText}>{item.ratings}</Text>
                    </View>
                    <View style={homeStyles.metaItem}>
                      <Ionicons name="call" size={12} color="#666666" />
                      <Text style={homeStyles.metaText}>₹ {item.charges} </Text>
                    </View>
                    <View style={homeStyles.metaItem}>
                      <Ionicons name="people" size={12} color="#666666" />
                      <Text style={homeStyles.metaText}>{item.totalDeals}+</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={homeStyles.bookButton}
                    onPress={() =>
                    navigation.navigate('PortfolioScreen', {
                      expertId: item.userId?._id,
                      email: userEmail,
                    })
                    }>
                    <Text style={homeStyles.bookButtonText}>Book Session</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Testimonials Section
        <View style={homeStyles.testimonialSection}>
          <Text style={homeStyles.sectionTitle}>What Our Users Say</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={testimonials}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={homeStyles.testimonialCard}>
                <View style={homeStyles.testimonialHeader}>
                  <View style={homeStyles.testimonialAvatar}>
                    <Text style={homeStyles.testimonialInitial}>
                      {item.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={homeStyles.testimonialName}>{item.name}</Text>
                </View>
                <Text style={homeStyles.testimonialText}>{item.text}</Text>
                <View style={homeStyles.testimonialRating}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFB800" />
                  ))}
                </View>
              </View>
            )}
          />
        </View> */}

        {/* Support Section */}
        {userRole === 'expert' && (
          <View style={homeStyles.supportSection}>
            <Text style={homeStyles.supportTitle}>
              Need Help Getting Started?
            </Text>
            <Text style={homeStyles.supportText}>
              Our support team is here to help you make the most of ExpertGo
            </Text>
            <TouchableOpacity
              style={homeStyles.supportButton}
              onPress={() =>Alert.alert("Our Team Will Contact you soon , Thankyou for your patience!")}>
              <Ionicons name="headset" size={16} color="#FFFFFF" />
              <Text style={homeStyles.supportButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={portModal}
          transparent
          animationType="fade"
          onRequestClose={() => setPortModal(false)}>
          <View style={homeStyles.modalOverlay}>
            <View style={homeStyles.modalContent}>
              <TouchableOpacity
                style={homeStyles.closeButton}
                onPress={() => setPortModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <View style={homeStyles.portfolioContainer}>
                <MaterialIcons
                  name="featured-play-list"
                  size={40}
                  color="#4267B2"
                  style={homeStyles.portfolioIcon}
                />
                <Text style={homeStyles.portfolioTitle}>
                  Create Your Portfolio
                </Text>
                <Text style={homeStyles.portfolioDescription}>
                  Showcase your expertise and credentials to attract more
                  clients.
                </Text>
                <TouchableOpacity
                  style={homeStyles.portfolioButton}
                  onPress={() => {
                    setPortModal(false);
                    navigation.navigate('Portfolio');
                  }}>
                  <Text style={homeStyles.portfolioButtonText}>
                    Get Started
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default Home;
