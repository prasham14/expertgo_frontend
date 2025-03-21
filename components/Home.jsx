import React, {useState, useEffect,useContext} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import homeStyles from './styles/Home';
import Recomendations from './Recomendations';
import { UserContext } from './Context';

const Home = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [portModal, setPortModal] = useState(false);
  const { userId,userEmail,userRole } = useContext(UserContext);

  useEffect(() => {
    const getPortfolio = async () => {
      if (!userId) return;
      
      try {
        console.log("Checking portfolio for user:", userId);
        
        const response = await axios.get(
          `http://10.0.2.2:3000/expert/profile/${userId}`,
        );
        
        console.log("Portfolio API response:", response.data);
        
        if (response.data.message ===  'Expert profile not found') {
          console.log("No portfolio found, showing modal" , userId);
        } else {
          console.log("Portfolio found");
          // Set portfolio data or do something else if needed
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error.message);
        // More detailed error logging
        if (error.response.data.message ==='Expert profile not found' ) {
          setPortModal(true);

          // The request was made and the server responded with a status code
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
        }
      }
    };
    
    // Only run this effect if userId is available
    if (userId) {
      getPortfolio();
    }
    
  }, [userId]); // Add userId as a dependency

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(
          'http://10.0.2.2:3000/expert/getExperts',
        );
        if (response.data.success) {
          setExperts(response.data.famousExperts);
        }
        console.log('Experts Data:', response.data.famousExperts);
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };

    setLoading(false);
    fetchExperts();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch your data here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const handleNavigate = () => {
    const val = true;
    navigation.navigate('Search', {openKeyboard: val});
  };

  return (
    <View style={homeStyles.container}>
      <StatusBar backgroundColor="#4A6572" barStyle="light-content" />

      {/* Header section with search and notifications */}
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
            <TouchableOpacity
              style={homeStyles.iconButton}
              onPress={() =>
                navigation.navigate('Notifications', {userId, email:userEmail, userRole})
              }>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#4A6572"
              />
            </TouchableOpacity>

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
        {loading ? (
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A6572" />
            <Text style={homeStyles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
          
            {userRole === 'expert' ? <Recomendations /> : null}  {/* Expert dashboard */}
            {userRole === 'expert' ? (
              <View style={homeStyles.expertDashboard}>
                <Text style={homeStyles.dashboardTitle}>Expert Dashboard</Text>

                <View style={homeStyles.statsContainer}>
                  <View style={homeStyles.statCard}>
                    <Text style={homeStyles.statValue}>0</Text>
                    <Text style={homeStyles.statLabel}>Upcoming Calls</Text>
                  </View>
                  <View style={homeStyles.statCard}>
                    <Text style={homeStyles.statValue}>0</Text>
                    <Text style={homeStyles.statLabel}>This Week</Text>
                  </View>
                  <View style={homeStyles.statCard}>
                    <Text style={homeStyles.statValue}>$0</Text>
                    <Text style={homeStyles.statLabel}>Earnings</Text>
                  </View>
                </View>
                {/* Create Portfolio */}
             
              </View>
            ) : (
              <>
                {/* Famous Experts  */}
              
                {/* How It Works Section */}
                <View style={homeStyles.howItWorksSection}>
                  <Text style={homeStyles.sectionTitle}>
                    How ExpertCall Works
                  </Text>
                  <View style={homeStyles.stepsContainer}>
                    <View style={homeStyles.stepCard}>
                      <View style={homeStyles.stepNumber}>
                        <Text style={homeStyles.stepNumberText}>1</Text>
                      </View>
                      <Text style={homeStyles.stepTitle}>Browse Experts</Text>
                      <Text style={homeStyles.stepDescription}>
                        Find professionals in your area of interest
                      </Text>
                    </View>
                    <View style={homeStyles.stepCard}>
                      <View style={homeStyles.stepNumber}>
                        <Text style={homeStyles.stepNumberText}>2</Text>
                      </View>
                      <Text style={homeStyles.stepTitle}>Schedule a Call</Text>
                      <Text style={homeStyles.stepDescription}>
                        Book a time that works for both of you
                      </Text>
                    </View>
                    <View style={homeStyles.stepCard}>
                      <View style={homeStyles.stepNumber}>
                        <Text style={homeStyles.stepNumberText}>3</Text>
                      </View>
                      <Text style={homeStyles.stepTitle}>
                        Get Expert Advice
                      </Text>
                      <Text style={homeStyles.stepDescription}>
                        Connect and receive valuable insights
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Testimonials Section */}
                <View style={homeStyles.testimonialSection}>
                  <Text style={homeStyles.sectionTitle}>
                    What Our Users Say
                  </Text>
                  <FlatList
                    data={[
                      {
                        id: '1',
                        name: 'Michael S.',
                        text: 'ExpertCall connected me with the perfect financial advisor. Worth every penny!',
                        rating: 5,
                      },
                      {
                        id: '2',
                        name: 'Sarah K.',
                        text: 'I was able to get legal advice within hours. Amazing service!',
                        rating: 5,
                      },
                      {
                        id: '3',
                        name: 'David L.',
                        text: 'The tech experts on this platform helped me solve issues that had been frustrating me for weeks.',
                        rating: 4,
                      },
                    ]}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (
                      <View style={homeStyles.testimonialCard}>
                        <View style={homeStyles.testimonialHeader}>
                          <View style={homeStyles.testimonialAvatar}>
                            <Text style={homeStyles.testimonialInitial}>
                              {item.name[0]}
                            </Text>
                          </View>
                          <Text style={homeStyles.testimonialName}>
                            {item.name}
                          </Text>
                        </View>
                        <Text style={homeStyles.testimonialText}>
                          {item.text}
                        </Text>
                        <View style={homeStyles.testimonialRating}>
                          {[...Array(5)].map((_, i) => (
                            <Ionicons
                              key={i}
                              name={i < item.rating ? 'star' : 'star-outline'}
                              size={16}
                              color="#FFD700"
                            />
                          ))}
                        </View>
                      </View>
                    )}
                  />
                </View>
              </>
            )}
            {/* Support Section */}
            <View style={homeStyles.supportSection}>
              <Text style={homeStyles.supportTitle}>Need Help?</Text>
              <Text style={homeStyles.supportText}>
                Our support team is available 24/7
              </Text>
              <TouchableOpacity style={homeStyles.supportButton}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#FFF"
                />
                <Text style={homeStyles.supportButtonText}>
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
                <Modal
                  visible={portModal}
                  transparent={true}
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
                          color="#4A6572"
                          style={homeStyles.portfolioIcon}
                        />
                        <Text style={homeStyles.portfolioTitle}>
                          Create Your Portfolio
                        </Text>
                        <Text style={homeStyles.portfolioDescription}>
                          Showcase your expertise and credentials to attract
                          more clients.
                        </Text>
                        <TouchableOpacity
                          style={homeStyles.portfolioButton}
                          onPress={() => {
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
