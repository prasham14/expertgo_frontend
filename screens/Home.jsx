import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import homeStyles from '../components/styles/Home';
import Recomendations from '../components/Recomendations';
import { UserContext } from '../context/Context';
import ExpertDash from '../components/ExpertDash';

const Home = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [portModal, setPortModal] = useState(false);
  const { userId, userEmail, userRole } = useContext(UserContext);
  const [bankDetails, setBankDetails] = useState(false);
  const [bankDetailsFetched, setBankDetailsFetched] = useState(false);
  const [showContent, setShowContent] = useState(false); // New state

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
    }, [userId])
  );

  const handleNavigate = () => {
    navigation.navigate('Search', { openKeyboard: true });
  };

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
                <Ionicons name="notifications-outline" size={24} color="#4A6572" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={homeStyles.iconButton}
              onPress={() => navigation.navigate('Profile', { userRole, userId })}>
              <Ionicons name="person-circle-outline" size={24} color="#4A6572" />
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
            {/* <Text style={homeStyles.loadingText}>Loading experts...</Text> */}
          </View>
        ) : (
          <>
            {userRole === 'expert' ? <Recomendations /> : null}
            {userRole === 'user' && (
              <View style={homeStyles.howItWorksSection}>
                <Text style={homeStyles.sectionTitle}>How ExpertGo Works</Text>
                <View style={homeStyles.stepsContainer}>
                  {[1, 2, 3].map((num, index) => (
                    <View key={index} style={homeStyles.stepCard}>
                      <View style={homeStyles.stepNumber}>
                        <Text style={homeStyles.stepNumberText}>{num}</Text>
                      </View>
                      <Text style={homeStyles.stepTitle}>
                        {['Browse Experts', 'Schedule a Call', 'Get Expert Advice'][index]}
                      </Text>
                      <Text style={homeStyles.stepDescription}>
                        {
                          [
                            'Find professionals in your area of interest',
                            'Book a time that works for both of you',
                            'Connect and receive valuable insights',
                          ][index]
                        }
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
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
              <Text style={homeStyles.bankPromptButtonText}>Add Bank Details</Text>
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
                <Text style={homeStyles.portfolioTitle}>Create Your Portfolio</Text>
                <Text style={homeStyles.portfolioDescription}>
                  Showcase your expertise and credentials to attract more clients.
                </Text>
                <TouchableOpacity
                  style={homeStyles.portfolioButton}
                  onPress={() => {
                    setPortModal(false);
                    navigation.navigate('Portfolio');
                  }}>
                  <Text style={homeStyles.portfolioButtonText}>Get Started</Text>
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
