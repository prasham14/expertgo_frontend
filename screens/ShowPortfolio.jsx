import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import enhancedStyles from '../components/styles/ShowPortfolio';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../context/Context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PortfolioScreen = ({route, navigation}) => {
  const {userEmail, userId} = useContext(UserContext);

  const expertId = route.params.expertId;
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [sameUser, setSameUser] = useState(false);
  const [alreadyMeet, setAlreadyMeet] = useState(false);
  const [startTime, setStartTime] = useState('');

  const checkMeetAlready = async () => {
    try {
      if (!expertId) return;
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/meet/check-already-meet/${expertId}/${userId}`,
      );
      const status = response.data.status;

      if (response.data.alreadyScheduled && status != 'completed') {
        setAlreadyMeet(true);
        setStartTime(response.data.time);
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
    }
  };

  const getExpertProfile = async () => {
    try {
      if (!expertId) return;
      if (userId === expertId) {
        setSameUser(true);
      }
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/expert/profile/${expertId}`,
      );

      if (response.status === 200) {
        setExpert(response.data.data);
        console.log('Expert data fetched:', response.data.data);
      } else {
        throw new Error('Failed to fetch expert profile.');
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
      Alert.alert('Error', 'Error fetching expert profile.');
    }
  };
  const fetchImage = async () => {
    try {
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/profile/images/${expertId}`,
      );
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchImage();
      await getExpertProfile();
      setLoading(false);
    };
    fetchData();
    checkMeetAlready();
  }, []);

  if (loading) {
    return (
      <View style={enhancedStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4267b2" />
        <Text style={enhancedStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const renderRatingStars = rating => {
    return (
      <View style={enhancedStyles.ratingContainer}>
        <View style={enhancedStyles.starsContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons
              key={index}
              name={index < rating ? 'star' : 'star-outline'}
              size={18}
              color="#FFD700"
              style={enhancedStyles.starIcon}
            />
          ))}
        </View>
        <Text style={enhancedStyles.ratingText}>({rating}/5)</Text>
      </View>
    );
  };
  const handleOpenURL = async url => {
    if (!url) return;

    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      // Open the URL
      await Linking.openURL(url);
    } else {
      // Show error if URL cannot be opened
      Alert.alert('Error', 'Cannot open this URL');
    }
  };

  const formattedTime = new Date(startTime).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <SafeAreaView style={enhancedStyles.safeArea}>
      <ScrollView style={enhancedStyles.container} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Gradient Background */}
        <View style={enhancedStyles.headerBackground}>
          <View style={enhancedStyles.headerOverlay} />
        </View>

        {/* Profile Photo Section */}
        <View style={enhancedStyles.profileHeader}>
          <View style={enhancedStyles.profilePhotoContainer}>
            <View style={enhancedStyles.profilePhotoWrapper}>
              <Image
                source={{uri: imageUrl || 'https://via.placeholder.com/150'}}
                style={enhancedStyles.profilePhoto}
              />
              {expert?.isVerified && (
                <View style={enhancedStyles.verifiedBadge}>
                  <MaterialIcons name="verified" size={28} color="#0096FF" />
                </View>
              )}
            </View>
          </View>

          {/* Personal Information */}
          <View style={enhancedStyles.personalInfoContainer}>
            <Text style={enhancedStyles.name}>{expert?.name || 'Expert Profile'}</Text>
            <Text style={enhancedStyles.currentPost}>
             Currently working at {expert?.currentPost || 'Professional'}
            </Text>
            {/* <Text style={styles.currentPost}>
              {expert?.isAvailable ? ("Available"):("Not Available")}
            </Text> */}
            {renderRatingStars(expert?.ratings || 0)}

            {expert.url && (
              <TouchableOpacity 
                style={enhancedStyles.workLinkButton}
                onPress={() => handleOpenURL(expert.url)}
              >
                <Ionicons name="link-outline" size={16} color="#4267b2" />
                <Text style={enhancedStyles.workLinkText}>See {expert.name}'s work</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Portfolio Details */}
        <View style={enhancedStyles.sectionCard}>
          <View style={enhancedStyles.sectionHeader}>
            <Ionicons name="briefcase" size={24} color="#4267b2" />
            <Text style={enhancedStyles.sectionTitle}>Professional Overview</Text>
          </View>

          <View style={enhancedStyles.detailsGrid}>
            <View style={enhancedStyles.detailRow}>
              <View style={enhancedStyles.iconContainer}>
                <Ionicons name="mail-outline" size={18} color="#4267b2" />
              </View>
              <View style={enhancedStyles.detailContent}>
                <Text style={enhancedStyles.detailLabel}>Email</Text>
                <Text style={enhancedStyles.detailText}>{expert?.email || 'N/A'}</Text>
              </View>
            </View>

            <View style={enhancedStyles.detailRow}>
              <View style={enhancedStyles.iconContainer}>
                <Ionicons name="time-outline" size={18} color="#4267b2" />
              </View>
              <View style={enhancedStyles.detailContent}>
                <Text style={enhancedStyles.detailLabel}>Experience</Text>
                <Text style={enhancedStyles.detailText}>
                  {expert?.experience || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <View style={enhancedStyles.skillsContainer}>
            <View style={enhancedStyles.skillsHeader}>
              <Ionicons name="code-slash" size={20} color="#4267b2" />
              <Text style={enhancedStyles.sectionSubtitle}>Skills & Expertise</Text>
            </View>
            <View style={enhancedStyles.skillsWrapper}>
              {expert?.skills?.length > 0 ? (
                expert.skills.map((skill, index) => (
                  <View key={index} style={enhancedStyles.skillChip}>
                    <Text style={enhancedStyles.skillText}>{skill}</Text>
                  </View>
                ))
              ) : (
                <Text style={enhancedStyles.noSkillsText}>No skills listed</Text>
              )}
            </View>
          </View>
        </View>

        {/* Expert Details */}
        <View style={enhancedStyles.sectionCard}>
          {expert?.bio && (
            <View style={enhancedStyles.bioContainer}>
              <View style={enhancedStyles.sectionHeader}>
                <Ionicons name="person-outline" size={24} color="#4267b2" />
                <Text style={enhancedStyles.sectionTitle}>About</Text>
              </View>
              <View style={enhancedStyles.bioWrapper}>
                <Text style={enhancedStyles.bioText}>"{expert.bio}"</Text>
              </View>
            </View>
          )}

          <View style={enhancedStyles.statsAndChargesContainer}>
            <View style={enhancedStyles.statsContainer}>
              <View style={enhancedStyles.statItem}>
                <View style={enhancedStyles.statIconContainer}>
                  <Ionicons name="call" size={24} color="#28a745" />
                </View>
                <View style={enhancedStyles.statContent}>
                  <Text style={enhancedStyles.statNumber}>{expert?.totalDeals || 0}</Text>
                  <Text style={enhancedStyles.statLabel}>Total Calls</Text>
                </View>
              </View>
            </View>

            {/* Charges Section */}
            <View style={enhancedStyles.chargesContainer}>
              <View style={enhancedStyles.chargesHeader}>
                <Ionicons name="card" size={20} color="#28a745" />
                <Text style={enhancedStyles.chargesLabel}>Session Rate</Text>
              </View>
              <Text style={enhancedStyles.chargesAmount}>
                ₹{expert?.charges?.[0] || 'N/A'}
              </Text>
              <Text style={enhancedStyles.chargesDuration}>per 10 minutes</Text>
            </View>
          </View>
        </View>

        {sameUser ? (
          <View style={enhancedStyles.buttonContainer}>
            <TouchableOpacity
              style={[enhancedStyles.scheduleButton, enhancedStyles.editButton]}
              onPress={() => navigation.navigate('EditPortfolio')}>
              <Ionicons name="pencil" size={24} color="#fff" />
              <Text style={enhancedStyles.scheduleButtonText}>Edit Portfolio</Text>
            </TouchableOpacity>
          </View>
        ) : alreadyMeet ? (
          <View style={enhancedStyles.buttonContainer}>
            <View style={[enhancedStyles.scheduleButton, enhancedStyles.scheduledButton]}>
              <Ionicons name="checkmark-circle" size={24} color="#28a745" />
              <View style={enhancedStyles.scheduledTextContainer}>
                <Text style={enhancedStyles.scheduledTitle}>Meeting Scheduled</Text>
                <Text style={enhancedStyles.scheduledTime}>{formattedTime}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={enhancedStyles.buttonContainer}>
            <TouchableOpacity
              style={enhancedStyles.scheduleButton}
              onPress={() =>
                navigation.navigate('Meet', {
                  expertId: expert.userId._id,
                  email: userEmail,
                  expertEmail: expert.email,
                  name: expert.name,
                  amount: expert.charges[0],
                  type: 'video_call',
                  availSlots: expert.availSlots,
                })
              }>
              <Ionicons name="videocam" size={24} color="#fff" />
              <Text style={enhancedStyles.scheduleButtonText}>Schedule a Call Now!</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default PortfolioScreen;