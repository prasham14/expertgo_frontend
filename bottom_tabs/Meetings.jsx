import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../components/styles/Meetings';
import MeetingReviewModal from '../components/MeetingReview';
import {UserContext} from '../context/Context';
const Meetings = () => {
  const {userRole, userId} = useContext(UserContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const[currReviewMeeting,setCurrReviewMeeting] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isRefundProcessed, setIsRefundProcessed] = useState(false);

  const handleReviewSubmit = () => {
    setShowReviewModal(false);
  };

  function isMeetingProperlyDone(meetingDetails, analytics) {
    const {startTime, endTime} = meetingDetails;
    console.log(meetingDetails, analytics);
    const {
      userEnterTime,
      expertEnterTime,
      userEndTime,
      expertEndTime,
      durationInMinutesUser,
      durationInMinutesExpert,
      totalMembers,
    } = analytics;

    if (!userEnterTime || !expertEnterTime || !userEndTime || !expertEndTime) {
      return false;
    }

    if (totalMembers.length < 2) {
      return false;
    }

    const MINIMUM_DURATION_MINUTES = 1;
    if (
      durationInMinutesUser < MINIMUM_DURATION_MINUTES ||
      durationInMinutesExpert < MINIMUM_DURATION_MINUTES
    ) {
      return false;
    }

    const userStart = new Date(userEnterTime).getTime();
    const userEnd = new Date(userEndTime).getTime();
    const expertStart = new Date(expertEnterTime).getTime();
    const expertEnd = new Date(expertEndTime).getTime();

    const overlapStart = Math.max(userStart, expertStart);
    const overlapEnd = Math.min(userEnd, expertEnd);
    const overlapDuration = (overlapEnd - overlapStart) / 60000; 

    if (overlapDuration < MINIMUM_DURATION_MINUTES) {
      return false;
    }

    const scheduledDuration = (new Date(endTime) - new Date(startTime)) / 60000;

    const maxAllowedDiff = 3; 
    const averageActualDuration =
      (durationInMinutesUser + durationInMinutesExpert) / 2;

    if (Math.abs(scheduledDuration - averageActualDuration) > maxAllowedDiff) {
      return false;
    }

    return true;
  }

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [expertDone, setExpertDone] = useState(false);
  const [completedMeetingId, setCompletedMeetingId] = useState('');
  const checkIfMeetingDone = async () => {
    try {
      const res = await axios.get(
        `https://expertgo-v1.onrender.com/meet/user-meetingEnded/${userId}`,
        {
          validateStatus: function (status) {
            return (status >= 200 && status < 300) || status === 404;
          },
        },
      );
      if (res.status === 404) {
        console.log('Meeting not found');
        return;
      }
      console.log(res);
      if (res.data.success) {
        const analytics = res.data.data;
        const meetingDetails = res.data.meetingdetails;
        setCompletedMeetingId(meetingDetails._id);
        const isValid = isMeetingProperlyDone(meetingDetails, analytics);
        if (isValid) {
          let id = meetingDetails._id;
          await axios.get(
            `https://expertgo-v1.onrender.com/meet/meeting-done-user/${id}`,
          );
          await axios.get(
            `https://expertgo-v1.onrender.com/meet/meeting-done/${id}`,
          );
        }

        console.log(isValid);
      }
    } catch (err) {
      console.error('Meeting validation failed', err);
    }
  };
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        setEmail(storedEmail);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (email && userRole && userId) {
      fetchMeetings();
    }
  }, [email, userRole, userId]);

  const fetchMeetings = async () => {
    if (!email || !userRole || !userId) return;

    setLoading(true);
    try {
      const endpoint = `https://expertgo-v1.onrender.com/meet/user-meetings/${userId}`;

      const response = await axios.get(endpoint);
      console.log(response)
      setMeetings(response.data.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      Alert.alert('Error', 'Failed to load meetings. Pull down to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkIfMeetingDone();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
    checkIfMeetingDone();
  };

  const isMeetingActive = meetingTime => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();
    const diffInMinutes = Math.abs(meetingDate - now) / (1000 * 60);
    return diffInMinutes <= 720;
  };

  const handleRefund = async transactionId => {
    console.log('i called', transactionId);
    const response = await axios.get(
      `https://expertgo-v1.onrender.com/meet/refund/${transactionId}`,
    );
    if (response) {
      setIsRefundProcessed(true);
    }
    console.log(response);
  };
  const isMeetingExpired = meetingTime => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();

    return meetingDate < now && !isMeetingActive(meetingTime);
  };

  const formatMeetingTime = timeString => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return timeString;
    }
  };

  const getTimeRemaining = meetingTime => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();

    if (meetingDate < now) return null;

    const diffMs = meetingDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHrs}h`;
    } else if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    } else {
      return `${diffMins}m`;
    }
  };

  if (loading && !email && !userRole) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="calendar-clock"
          size={50}
          color="#4F6C92"
        />
        <Text style={styles.loadingText}>Loading your meetings...</Text>
      </View>
    );
  }

  const openBrowser = async (expertId, userId) => {
    console.log('dd', userId, expertId);
    console.log(userRole);
    try {
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/meet/get-room-id/${userId}/${expertId}`,
      );
      const roomId = response.data.roomId;
      console.log(userRole);
      if (!roomId) {
        Alert.alert('Error', 'No Room ID found');
        return;
      }
      let url = '';
      if (userRole === 'user') {
        url = `https://expertgo-meeting.vercel.app/?roomID=${roomId}&id=${userId}&role=${userRole}`;
      } else {
        let userId = expertId;
        url = `https://expertgo-meeting.vercel.app/?roomID=${roomId}&id=${userId}&role=${userRole}`;
      }
      console.log('id', userId);

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', "Can't open the meeting link.");
      }
    } catch (error) {
      console.error('An error occurred', error);
      Alert.alert('Error', 'Failed to open meeting link.');
    }
  };

  const renderMeetingCard = ({item}) => {
    console.log(item.userId, item.expertId);
    
    console.log("here",item);
    const isActive = isMeetingActive(item.startTime);
    const isExpired = isMeetingExpired(item.endTime);
    const timeRemaining = getTimeRemaining(item.startTime);
    return (
      <View
        style={[
          styles.meetingCard,
          isActive ? styles.activeMeetingCard : null,
          isExpired ? styles.expiredMeetingCard : null,
        ]}>
        {isActive && (
          <View style={styles.activeBadge}>
            <MaterialCommunityIcons name="clock-fast" size={16} color="#FFF" />
            <Text style={styles.activeBadgeText}>Active Now</Text>
          </View>
        )}

        {isExpired && (
          <View style={styles.expiredBadge}>
            <MaterialIcons name="error-outline" size={16} color="#FFF" />
            <Text style={styles.expiredBadgeText}>Expired</Text>
          </View>
        )}
        {item.status === 'refund' && (
          <View style={styles.expiredBadge}>
            <MaterialIcons name="error-outline" size={16} color="#000" />
            <Text style={styles.expiredBadgeText}>Refund</Text>
          </View>
        )}

        {!isActive && !isExpired && timeRemaining && (
          <View style={styles.upcomingBadge}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={16}
              color="#FFF"
            />
            <Text style={styles.upcomingBadgeText}>In {timeRemaining}</Text>
          </View>
        )}

        <View style={styles.meetingHeader}></View>

        <Text style={styles.meetingAmount}>{item.title}</Text>

        <View style={styles.meetingDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="account-tie"
              size={20}
              color="#4F6C92"
            />
            <Text style={styles.meetingDetailText}>
              Expert: {item.expertDetails.email}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#4F6C92"
            />
            <Text
              style={[
                styles.meetingDetailText,
                isExpired ? styles.expiredText : null,
              ]}>
              {formatMeetingTime(item.startTime)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          {item.status === 'refund' ? (
            <TouchableOpacity
              style={[styles.callButton]}
              onPress={() => {
                Alert.alert('Your Refund is processed');
              }}>
              {' '}
              <MaterialIcons name={'money'} size={18} color="#FFF" />
              <Text style={styles.buttonText}>{' Refund Processed.....'}</Text>
            </TouchableOpacity>
          ) : (
             item.status === 'completed' ? ( <TouchableOpacity
              style={[
                styles.callButton,
                !isActive && !isExpired && styles.disabledButton,
                isExpired && styles.expiredCallButton,
              ]}
              onPress={() =>{ setShowReviewModal(true)
                setCurrReviewMeeting(item)
              }
              }
              >
              {isActive && item.status === 'completed' && <Text style={styles.buttonText}>Give Review</Text>}
              {isExpired && (
                <Text style={styles.buttonText}>Request Refund</Text>
              )}
            </TouchableOpacity>):( <TouchableOpacity
              style={[
                styles.callButton,
                !isActive && !isExpired && styles.disabledButton,
                isExpired && styles.expiredCallButton,
              ]}
              onPress={() => {
                if (isActive) {
                  openBrowser(item.expertDetails.expertId._id, item.userId);
                  console.log(item.expertId, item.userId);
                } else if (isExpired) {
                  handleRefund(item.transactionId);
                }
              }}
              disabled={!isActive && !isExpired}>
              {isActive && item.status !== 'completed' && <Text style={styles.buttonText}>Join Call</Text>}
              {isExpired && (
                <Text style={styles.buttonText}>Request Refund</Text>
              )}
            </TouchableOpacity>)
            
           
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MaterialCommunityIcons name="calendar-blank" size={80} color="#CCCCCC" />
      <Text style={styles.noMeetings}>No scheduled meetings</Text>
      <Text style={styles.emptyStateSubtext}>
        Your upcoming meetings will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={meetings.filter(
          meeting =>
            meeting.status !== 'completed-on-user'
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderMeetingCard}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <MeetingReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmitReview={handleReviewSubmit}
        meetingDetails={currReviewMeeting}
      />
    </View>
  );
};

export default Meetings;
