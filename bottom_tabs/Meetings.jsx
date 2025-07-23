import {
  Text,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  const [delayModal, setDelayModal] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [selectedExpertEmail, setSelectedExpertEmail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [isRefundProcessed, setIsRefundProcessed] = useState(false);
  const navigation = useNavigation();
  const openMeetLink = url => {
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Cannot open URL: ' + url);
          // You might want to show an alert here
        }
      });
    }
  };
  const handleReviewSubmit = () => {
    setShowReviewModal(false);
  };

  function isMeetingProperlyDone(meetingDetails, analytics) {
    const {startTime, endTime} = meetingDetails;
    console.log(meetingDetails , analytics)
    const {
      userEnterTime,
      expertEnterTime,
      userEndTime,
      expertEndTime,
      durationInMinutesUser,
      durationInMinutesExpert,
      cameraOnFor,
      micOnfor,
      totalMembers,
    } = analytics;

    // 1. Required fields check
    if (!userEnterTime || !expertEnterTime || !userEndTime || !expertEndTime) {
      return false;
    }

    // 2. Both joined the meeting
    if (totalMembers.length < 2) {
      return false;
    }

    // 3. Both joined for at least N minutes
    const MINIMUM_DURATION_MINUTES = 1;
    if (
      durationInMinutesUser < MINIMUM_DURATION_MINUTES ||
      durationInMinutesExpert < MINIMUM_DURATION_MINUTES
    ) {
      return false;
    }

    // 4. Check overlap in their attendance times
    const userStart = new Date(userEnterTime).getTime();
    const userEnd = new Date(userEndTime).getTime();
    const expertStart = new Date(expertEnterTime).getTime();
    const expertEnd = new Date(expertEndTime).getTime();

    const overlapStart = Math.max(userStart, expertStart);
    const overlapEnd = Math.min(userEnd, expertEnd);
    const overlapDuration = (overlapEnd - overlapStart) / 60000; // in minutes

    if (overlapDuration < MINIMUM_DURATION_MINUTES) {
      return false;
    }

    // 5. Check how close actual duration was to scheduled duration
    const scheduledDuration = (new Date(endTime) - new Date(startTime)) / 60000;

    const maxAllowedDiff = 3; // in minutes
    const averageActualDuration =
      (durationInMinutesUser + durationInMinutesExpert) / 2;

    if (Math.abs(scheduledDuration - averageActualDuration) > maxAllowedDiff) {
      return false;
    }

    // 6. Optional: Check if camera/mic was used for some duration
    const cameraUsed = parseInt(cameraOnFor || '0') > 0;
    const micUsed = parseInt(micOnfor || '0') > 0;

    if (!cameraUsed && !micUsed) {
      // Can still be valid if you allow audio-only meetings, otherwise:
      // return false;
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
          await axios.get(`https://expertgo-v1.onrender.com/meet/meeting-done/${id}`);
          setExpertDone(true);
          setShowReviewModal(true);
        }

        console.log(isValid);
      }
    } catch (err) {
      console.error('Meeting validation failed', err);
    }
  };
  const checkIfMeetingDoneExpert = async () => {
    try {
      const res = await axios.get(
        `https://expertgo-v1.onrender.com/meet/expert-meetingEnded/${userId}`,
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

      if (res.data.success) {
        const analytics = res.data.data;
        const meetingDetails = res.data.meetingdetails;

        const isValid = isMeetingProperlyDone(meetingDetails, analytics);
        if (isValid) {
          setExpertDone(true);
        }
        console.log("valid",isValid);
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
      const endpoint =
        userRole === 'expert'
          ? `https://expertgo-v1.onrender.com/meet/expert-meetings/${userId}`
          : `https://expertgo-v1.onrender.com/meet/user-meetings/${userId}`;

      const response = await axios.get(endpoint);
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
    if (userRole === 'user') checkIfMeetingDone();
    if (userRole === 'expert') checkIfMeetingDoneExpert();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
    if (userRole === 'user') checkIfMeetingDone();
    if (userRole === 'expert') checkIfMeetingDoneExpert();
  };

  const handleCancelMeeting = async (meetingId, userEmail) => {
    try {
      console.log('id :', meetingId, userEmail, userId);
      // Get confirmation from user
      Alert.alert(
        'Cancel Meeting',
        'Are you sure you want to cancel this meeting?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await axios.get(
                  `https://expertgo-v1.onrender.com/noti/get-user-fcm/${userEmail}`,
                );
                const fcmToken = response.data.fcm;

                const notificationData = {
                  token: fcmToken,
                  title: 'Sorry! The Expert cancelled the meeting',
                  body: 'The meeting has been cancelled by the Expert.',
                };
                console.log(meetingId);
                await axios.post(
                  'https://expertgo-v1.onrender.com/noti/send-notification',
                  notificationData,
                );
                await axios.delete(
                  `https://expertgo-v1.onrender.com/meet/delete-meeting/${meetingId}/${userId}`,
                );

                setMeetings(
                  meetings.filter(meeting => meeting._id !== meetingId),
                );
                Alert.alert('Success', 'Meeting canceled successfully.');
              } catch (error) {
                console.error('Error canceling meeting:', error);
                Alert.alert('Error', 'Failed to cancel the meeting.');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error in cancelMeeting:', error);
      Alert.alert('Error', 'Failed to process your request.');
    }
  };

  const openTimeChangeModal = (id, expertemail) => {
    setSelectedMeetingId(id);
    setSelectedExpertEmail(expertemail);
    setDelayModal(true);
  };

  const handleTimeChange = async () => {
    if (!newTime) {
      Alert.alert('Error', 'Please enter a new time.');
      return;
    }

    try {
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/noti/get-user-fcm/${selectedExpertEmail}`,
      );
      const fcmToken = response.data.fcm;

      const notificationData = {
        token: fcmToken,
        title: 'User wants to change the timing',
        body: `The meeting has been delayed to ${newTime}.`,
      };

      await axios.post(
        'https://expertgo-v1.onrender.com/noti/send-notification',
        notificationData,
      );
      await axios.patch(
        `https://expertgo-v1.onrender.com/meetings/change-time/${selectedMeetingId}`,
        {time: newTime},
      );

      // Update the meeting in the local state
      setMeetings(
        meetings.map(meeting =>
          meeting._id === selectedMeetingId
            ? {...meeting, preferredTime: newTime}
            : meeting,
        ),
      );

      Alert.alert('Success', 'Meeting time updated.');
      setDelayModal(false);
      setNewTime('');
    } catch (error) {
      console.error('Error changing meeting time:', error);
      Alert.alert('Error', 'Failed to update meeting time.');
    }
  };
  const handleTnC = () => {
    setCancelModal(false);
    navigation.navigate('CancelTnC');
  };

  const isMeetingActive = meetingTime => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();

    // Calculate time difference in minutes
    const diffInMinutes = Math.abs(meetingDate - now) / (1000 * 60);

    // Return true if meeting is within 15 minutes of scheduled time
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

    // Return true if meeting time is in the past and not active
    return meetingDate < now && !isMeetingActive(meetingTime);
  };

  // Format meeting time to be more readable
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

  // Calculate time remaining until meeting
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

  const handleClaim = id => {
    Alert.alert('Succes', 'Your meeting details will be reviewed');
  };

  const openBrowser = async (expertId, userId) => {
    console.log('dd',userId, expertId);
console.log(userRole)
    try {
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/meet/get-room-id/${userId}/${expertId}`,
      );
      const roomId = response.data.roomId;
      console.log(userRole)
      if (!roomId) {
        Alert.alert('Error', 'No Room ID found');
        return;
      }
      let url ="";
      if(userRole === 'user'){ 
          url = `https://expertgo-meeting.vercel.app/?roomID=${roomId}&id=${userId}&role=${userRole}`;
      }
      else{
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
          {userRole === 'expert' ? (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color="#4F6C92"
              />
              <Text style={styles.meetingDetailText}>{item.user.email}</Text>
            </View>
          ) : (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="account-tie"
                size={20}
                color="#4F6C92"
              />
              <Text style={styles.meetingDetailText}>
                Expert: {item.expert.email}
              </Text>
            </View>
          )}

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
          {userRole === 'expert' ? (
            <>
              {/* <TouchableOpacity
                style={[styles.cancelButton, isExpired ? styles.actionButton : null]}
                onPress={() => setCancelModal(true)}
              >
                {/* <MaterialIcons name="cancel" size={18} color="#FFF" /> */}
              {/* <Text style={styles.buttonText}>{expertDone && "Claim"}</Text> */}
              {/* </TouchableOpacity> */}
              {expertDone && (
                <TouchableOpacity
                  style={[
                    styles.claimButton,
                    isExpired ? styles.actionButton : null,
                  ]}
                  onPress={() => handleClaim()}>
                  <MaterialIcons name="money" size={18} color="#FFF" />
                  <Text style={styles.buttonText}>Claim</Text>
                </TouchableOpacity>
              )}
              {isActive && (
                <TouchableOpacity
                  style={[
                    styles.callButton,
                    !isActive ? styles.disabledButton : null,
                    isExpired ? styles.expiredCallButton : null,
                  ]}
                  onPress={() =>{
                    openBrowser(item.expertId, item.userId)
                    console.log('yes;',item.expertId, item.userId);

                  } 
                    
                  }
                  disabled={!isActive && !isExpired}>
                  <MaterialIcons
                    name={isExpired ? 'error-outline' : 'video-call'}
                    size={18}
                    color="#FFF"
                  />
                  <Text style={styles.buttonText}>
                    {isActive ? 'Join Call' : isExpired && 'Claim'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {item.status === 'refund' ? (
                <TouchableOpacity
                  style={[styles.callButton]}
                  onPress={() => {
                    Alert.alert('Your Refund is processed');
                  }}>
                  {' '}
                  <MaterialIcons name={'money'} size={18} color="#FFF" />
                  <Text style={styles.buttonText}>
                    {' Refund Processed.....'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.callButton,
                    !isActive && !isExpired && styles.disabledButton,
                    isExpired && styles.expiredCallButton,
                  ]}
                  onPress={() => {
                    if (isActive) {
                      openBrowser(item.expertId, item.userId);
                      console.log(item.expertId, item.userId);
                    } else if (isExpired) {
                      handleRefund(item.transactionId);
                    }
                  }}
                  disabled={!isActive && !isExpired}>
               
                  {/* <MaterialIcons
                    name={
                      isExpired
                        ? 'error-outline'
                        : isActive
                        ? 'video-call'
                        : 'cancel'
                    }
                    size={18}
                    color="#FFF"
                  /> */}
                  {isActive && <Text style={styles.buttonText}>Join Call</Text>}
                  {isExpired && (
                    <Text style={styles.buttonText}>Request Refund</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
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
      {/* <View style={styles.headerContainer}> */}
        {/* <Text style={styles.header}>Meetings</Text> */}
        {/* <TouchableOpacity
          style={styles.refreshIconButton}
          onPress={handleRefresh}>
          <MaterialIcons name="refresh" size={24} color="#4F6C92" />
        </TouchableOpacity> */}
      {/* </View> */}

      <FlatList
        data={meetings}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderMeetingCard}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <Modal visible={cancelModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons
                name="clock-edit"
                size={28}
                color="#3A6EA5"
              />
              <Text style={styles.modalTitle}>
                Are you sure ? Read T&C before cancelling Meeting
              </Text>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => handleCancelMeeting(item._id)}
                style={styles.modalUpdateButton}>
                <MaterialIcons name="check" size={18} color="#FFF" />
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTnC}
                style={styles.modalCancelButton}>
                <Text style={styles.modalButtonText}>T&C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCancelModal(false)}
                style={styles.modalCancelButton}>
                <MaterialIcons name="close" size={18} color="#FFF" />
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
<MeetingReviewModal 
  visible={showReviewModal} 
  onClose={() => setShowReviewModal(false)} 
  onSubmitReview={handleReviewSubmit}
/>

      {/* Modal for changing meeting time */}
      <Modal visible={delayModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons
                name="clock-edit"
                size={28}
                color="#3A6EA5"
              />
              <Text style={styles.modalTitle}>Reschedule Meeting</Text>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalLabel}>New Meeting Time</Text>
              <TextInput
                placeholder="YYYY-MM-DDThh:mm:ss (e.g., 2023-03-15T14:30:00)"
                style={styles.modalInput}
                value={newTime}
                onChangeText={setNewTime}
                placeholderTextColor="#999"
              />
              <Text style={styles.modalHelpText}>
                Enter the new date and time in ISO format
              </Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setDelayModal(false)}
                style={styles.modalCancelButton}>
                <MaterialIcons name="close" size={18} color="#FFF" />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTimeChange}
                style={styles.modalUpdateButton}>
                <MaterialIcons name="check" size={18} color="#FFF" />
                <Text style={styles.modalButtonText}>Update Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Meetings;
