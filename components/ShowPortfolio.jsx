import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet ,Image,TouchableOpacity,SafeAreaView,ScrollView} from 'react-native';
import axios from 'axios';
import styles from './styles/ShowPortfolio';
import Ionicons from 'react-native-vector-icons/Ionicons';
const PortfolioScreen = ({ route, navigation }) => {
  const {email} = route.params;
  const userId = route.params.expertId;
  const [expert, setExpert] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const getExpertProfile = async () => {
    console.warn(userId);

    try {
      if (!userId) return;
      const response = await axios.get(`http://10.0.2.2:3000/profile/getExpertProfile/${userId}`);

      if (response.status === 200) {
        setExpert(response.data.data);
        console.warn(response.data.data);
      } else {
        throw new Error("Failed to fetch expert profile.");
      }
    } catch (error) {
      console.error("Error fetching expert profile:", error);
      Alert.alert("Error", "Error fetching expert profile.");
    }
  };

  // Fetch Portfolio Data
  const getPortfolio = async () => {
    try {
      if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      const response = await axios.get(`http://10.0.2.2:3000/expert/portfolio/${userId}`)
      if (response && response.data && response.data.user) {
        setPortfolio(response.data.user);
      }
      console.warn(response.data.user);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      Alert.alert('Error', 'Something went wrong. Try again later.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getExpertProfile();
      await getPortfolio();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }
  const renderRatingStars = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name={index < rating ? "star" : "star-outline"}
            size={20}
            color="#FFD700"
          />
        ))}
        <Text style={styles.ratingText}>({rating}/5)</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Photo Section */}
      <View style={styles.profileHeader}>
        <View style={styles.profilePhotoContainer}>
          <Image
           
            style={styles.profilePhoto}
          />
          {expert?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#007bff" />
            </View>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.personalInfoContainer}>
          <Text style={styles.name}>
            {portfolio?.fullName || "Expert Profile"}
          </Text>
          <Text style={styles.currentPost}>
            {portfolio?.currentPost || "Professional"}
          </Text>
          
          {renderRatingStars(expert?.ratings || 0)}
        </View>
      </View>

      {/* Portfolio Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Professional Overview</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={20} color="#007bff" />
          <Text style={styles.detailText}>
            {portfolio?.email || "N/A"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={20} color="#007bff" />
          <Text style={styles.detailText}>
            Experience: {portfolio?.experience || "N/A"}
          </Text>
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.sectionSubtitle}>Skills</Text>
          <Text style={styles.skillsText}>
            {portfolio?.skills?.join(", ") || "No skills listed"}
          </Text>
        </View>
      </View>

      {/* Expert Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Expert Profile</Text>
        
        {expert?.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              "{expert.bio}"
            </Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="rocket-outline" size={20} color="#007bff" />
            <Text style={styles.statLabel}>
              Total Deals: {expert?.totalDeals || 0}
            </Text>
          </View>
        </View>

        {/* Charges Section */}
        <View style={styles.chargesContainer}>
          <Text style={styles.sectionSubtitle}>Consultation Charges</Text>
          <View style={styles.chargeRow}>
            <View style={styles.chargeItem}>
              <Ionicons name="videocam-outline" size={20} color="#28a745" />
              <Text style={styles.chargeText}>
                Video Call: ₹{expert?.charges[0] || "N/A"}/10 min
              </Text>
            </View>
            <View style={styles.chargeItem}>
              <Ionicons name="call-outline" size={20} color="#17a2b8" />
              <Text style={styles.chargeText}>
                Voice Call: ₹{expert?.charges[1] || "N/A"}/10 min
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Schedule Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.scheduleButton}
          onPress={() => navigation.navigate('VideoCall', {
            expertId: userId,
            email: email,
            type: "video_call"
          })}
        >
          <Ionicons name="videocam" size={24} color="#fff" />
          <Text style={styles.scheduleButtonText}>
            Schedule Video Call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.scheduleButton, styles.voiceCallButton]}
          onPress={() => navigation.navigate('VideoCall', {
            expertId: userId,
            email: email,
            type: "voice_call"
          })}
        >
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.scheduleButtonText}>
            Schedule Voice Call
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};



export default PortfolioScreen;