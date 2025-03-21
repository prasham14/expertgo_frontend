import { Text, View, FlatList, Modal, TouchableOpacity, TextInput, Button, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles/Meetings';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [delayModal, setDelayModal] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [selectedExpertEmail, setSelectedExpertEmail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedUserRole = await AsyncStorage.getItem('userRole');
        setEmail(storedEmail);
        setUserRole(storedUserRole);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchMeetings = async () => {
    if (!email || !userRole) return;
    
    setLoading(true);
    try {
      const endpoint = userRole === 'expert' 
        ? `http://10.0.2.2:3000/meetings/get-meetings/${email}`
        : `http://10.0.2.2:3000/meetings/get-user-meetings/${email}`;
      
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
    if (email && userRole) {
      fetchMeetings();
    }
  }, [email, userRole]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
  };

  const handleCancelMeeting = async (meetingId, userEmail) => {
    try {
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
                const response = await axios.get(`http://10.0.2.2:3000/noti/get-user-fcm/${userEmail}`);
                const fcmToken = response.data.fcm;

                const notificationData = {
                  token: fcmToken,
                  title: 'Sorry! The Expert cancelled the meeting',
                  body: 'The meeting has been cancelled due to unexpected circumstances.',
                };

                await axios.post('http://10.0.2.2:3000/noti/send-notification', notificationData);
                await axios.delete(`http://10.0.2.2:3000/meetings/delete-meeting/${meetingId}`);

                setMeetings(meetings.filter(meeting => meeting._id !== meetingId));
                Alert.alert('Success', 'Meeting canceled successfully.');
              } catch (error) {
                console.error('Error canceling meeting:', error);
                Alert.alert('Error', 'Failed to cancel the meeting.');
              }
            }
          }
        ]
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
      Alert.alert("Error", "Please enter a new time.");
      return;
    }
  
    try {
      const response = await axios.get(`http://10.0.2.2:3000/noti/get-user-fcm/${selectedExpertEmail}`);
      const fcmToken = response.data.fcm;
  
      const notificationData = {
        token: fcmToken,
        title: "User wants to change the timing",
        body: `The meeting has been delayed to ${newTime}.`,
      };
  
      await axios.post("http://10.0.2.2:3000/noti/send-notification", notificationData);
      await axios.patch(`http://10.0.2.2:3000/meetings/change-time/${selectedMeetingId}`, { time: newTime });
  
      // Update the meeting in the local state
      setMeetings(meetings.map(meeting => 
        meeting._id === selectedMeetingId 
          ? {...meeting, preferredTime: newTime} 
          : meeting
      ));
      
      Alert.alert("Success", "Meeting time updated.");
      setDelayModal(false);
      setNewTime("");
    } catch (error) {
      console.error("Error changing meeting time:", error);
      Alert.alert("Error", "Failed to update meeting time.");
    }
  };
  
  const startVideoCall = (meetingId, type) => {
    // Navigate to the VideoCall screen with the meeting ID
    navigation.navigate("Video", { meetingId, type });
  };

  // Check if a meeting is currently active (within ±15 minutes of scheduled time)
  const isMeetingActive = (meetingTime) => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();
    
    // Calculate time difference in minutes
    const diffInMinutes = Math.abs(meetingDate - now) / (1000 * 60);
    
    // Return true if meeting is within 15 minutes of scheduled time
    return diffInMinutes <= 15;
  };
  
  // Check if a meeting has expired (more than 15 minutes past scheduled time)
  const isMeetingExpired = (meetingTime) => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();
    
    // Return true if meeting time is in the past and not active
    return meetingDate < now && !isMeetingActive(meetingTime);
  };
  
  // Format meeting time to be more readable
  const formatMeetingTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (error) {
      return timeString;
    }
  };

  // Calculate time remaining until meeting
  const getTimeRemaining = (meetingTime) => {
    const meetingDate = new Date(meetingTime);
    const now = new Date();
    
    if (meetingDate < now) return null;
    
    const diffMs = meetingDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
        <MaterialCommunityIcons name="calendar-clock" size={50} color="#4F6C92" />
        <Text style={styles.loadingText}>Loading your meetings...</Text>
      </View>
    );
  }

  const renderMeetingCard = ({ item }) => {
    const isActive = isMeetingActive(item.preferredTime);
    const isExpired = isMeetingExpired(item.preferredTime);
    const timeRemaining = getTimeRemaining(item.preferredTime);
    
    return (
      <View style={[
        styles.meetingCard,
        isActive ? styles.activeMeetingCard : null,
        isExpired ? styles.expiredMeetingCard : null
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
            <Text style={styles.expiredBadgeText}>Expired - Take Action Now</Text>
          </View>
        )}
        
        {!isActive && !isExpired && timeRemaining && (
          <View style={styles.upcomingBadge}>
            <MaterialCommunityIcons name="timer-outline" size={16} color="#FFF" />
            <Text style={styles.upcomingBadgeText}>In {timeRemaining}</Text>
          </View>
        )}
        
        <View style={styles.meetingHeader}>
          <View style={styles.meetingTypeTag}>
            <Text style={styles.meetingTypeText}>{item.type.replace('_', ' ')}</Text>
          </View>
          
         
        </View>
        {userRole === 'expert' && (
            <Text style={styles.meetingAmount}>₹ {item.amount}</Text>
          )}
        <View style={styles.meetingDetails}>
          {userRole === 'expert' ? (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={20} color="#4F6C92" />
              <Text style={styles.meetingDetailText}>{item.userEmail}</Text>
            </View>
          ) : (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account-tie" size={20} color="#4F6C92" />
              <Text style={styles.meetingDetailText}>Expert: {item.expertemail}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#4F6C92" />
            <Text style={[
              styles.meetingDetailText,
              isExpired ? styles.expiredText : null
            ]}>
              {formatMeetingTime(item.preferredTime)}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.chatIconButton}
          onPress={() => navigation.navigate('Chat', { 
            recipientEmail: userRole === 'expert' ? item.userEmail : item.expertemail,
            meetingId: item._id
          })}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#3A6EA5" />
        </TouchableOpacity>
        
        <View style={styles.buttonRow}>
          {userRole === 'expert' ? (
            <>
              <TouchableOpacity
                style={[styles.cancelButton, isExpired ? styles.actionButton : null]}
                onPress={() => handleCancelMeeting(item._id, item.userEmail)}
              >
                <MaterialIcons name="cancel" size={18} color="#FFF" />
                <Text style={styles.buttonText}>{isExpired ? "Close Meeting" : "Cancel"}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.callButton,
                  !isActive ? styles.disabledButton : null,
                  isExpired ? styles.expiredCallButton : null
                ]}
                onPress={() => isExpired ? 
                  Alert.alert("Meeting Expired", "This meeting has already passed. Please reschedule or close it.") : 
                  startVideoCall(item._id, item.type)
                }
                disabled={!isActive && !isExpired}
              >
                <MaterialIcons name={isExpired ? "schedule" : "video-call"} size={18} color="#FFF" />
                <Text style={styles.buttonText}>
                  {isActive ? "Start Call" : 
                   isExpired ? "Reschedule" : "Coming Soon"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.changeButton, isExpired ? styles.actionButton : null]}
                onPress={() => openTimeChangeModal(item._id, item.expertemail)}
              >
                <MaterialCommunityIcons name="clock-edit-outline" size={18} color="#FFF" />
                <Text style={styles.buttonText}>{isExpired ? "Reschedule" : "Reschedule"}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.callButton,
                  !isActive ? styles.disabledButton : null,
                  isExpired ? styles.expiredCallButton : null
                ]}
                onPress={() => isExpired ? 
                  Alert.alert("Meeting Expired", "This meeting has already passed. Please reschedule or request a refund.") : 
                  startVideoCall(item._id, item.type)
                }
                disabled={!isActive && !isExpired}
              >
                <MaterialIcons name={isExpired ? "error-outline" : "video-call"} size={18} color="#FFF" />
                <Text style={styles.buttonText}>
                  {isActive ? "Join Call" : 
                   isExpired ? "Request Refund" : "Coming Soon"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      {userRole !== 'expert' && (
        <TouchableOpacity style={styles.findExpertButton} onPress={() => navigation.navigate('Experts')}>
          <MaterialIcons name="search" size={18} color="#FFF" />
          <Text style={styles.findExpertButtonText}>Find an Expert</Text>
        </TouchableOpacity>
      )}
      
      <MaterialCommunityIcons name="calendar-blank" size={80} color="#CCCCCC" />
      <Text style={styles.noMeetings}>No scheduled meetings</Text>
      <Text style={styles.emptyStateSubtext}>Your upcoming meetings will appear here</Text>
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={handleRefresh}
      >
        <MaterialIcons name="refresh" size={18} color="#FFF" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {userRole === 'expert' ? 'Expert Dashboard' : 'My Meetings'}
        </Text>
        <TouchableOpacity style={styles.refreshIconButton} onPress={handleRefresh}>
          <MaterialIcons name="refresh" size={24} color="#4F6C92" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={meetings}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderMeetingCard}
        ListEmptyComponent={renderEmptyState}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      {/* Modal for changing meeting time */}
      <Modal visible={delayModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="clock-edit" size={28} color="#3A6EA5" />
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
              <Text style={styles.modalHelpText}>Enter the new date and time in ISO format</Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                onPress={() => setDelayModal(false)} 
                style={styles.modalCancelButton}
              >
                <MaterialIcons name="close" size={18} color="#FFF" />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleTimeChange} 
                style={styles.modalUpdateButton}
              >
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