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
import homeStyles from '../components/styles/Home';
import Recomendations from '../components/Recomendations';
import { UserContext } from '../context/Context';
import ExpertDash from '../components/ExpertDash';
// import tw from '../tailwind';
const Home = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [portModal, setPortModal] = useState(false);
  const { userId,userEmail,userRole } = useContext(UserContext);

  useEffect(() => {
    const getPortfolio = async () => {
      if (!userId || userRole === 'user') return;
      
      try {
        console.log("Checking portfolio for user:", userId);
        
        const response = await axios.get(
          `http://10.0.2.2:3000/expert/profile/${userId}`,
        );
        
        console.log("Portfolio API response:", response.data);
        
        if (response.data.message ===  'Expert profile not found') {
          console.log("No portfolio found, showing modal" , userId);
          setPortModal(true);

        } else {
          console.log("Portfolio found");
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error.message);
        if (error.response.data.message ==='Expert profile not found' ) {
          setPortModal(true);

          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }
    };
    
    if (userId) {
      getPortfolio();
    }
    
  }, [userId]);

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
            {
              userRole === 'expert' ? ( <TouchableOpacity
                style={homeStyles.iconButton}
                onPress={() =>
                  navigation.navigate('Notifications', {userId, email:userEmail, userRole})
                }>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#4A6572"
                />
              </TouchableOpacity>):(null)
            }
           

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
                  // <ExpertDash/>
                  null
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
             
              </>
            )}
            {/* Support Section */}
            {/* <View style={homeStyles.supportSection}>
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
            </View> */}
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
