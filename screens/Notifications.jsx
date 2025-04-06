import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import styles from '../components/styles/Notifications';
import { formatDistanceToNow, parseISO, format } from 'date-fns';

const Notifications = ({route}) => {
  const {email, userRole} = route.params;
  const [expertNotifications, setExpertNotifications] = useState([]);
  const navigation = useNavigation();
  
  const fetchExpertNotifications = async () => {
    console.warn("I am called", email);
    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/noti/get-Requests/${email}`
      );

      if (response.status === 200) {
        const allNotifications = response.data.data;
        const filteredNotifications =
          userRole === 'user'
            ? allNotifications.filter(
                notification => notification.isRead === true && notification.isPaid === false
              ) 
            : allNotifications.filter(
                notification => notification.isRead === false
              );
        console.log("Filtered", filteredNotifications);
        setExpertNotifications(filteredNotifications);
      }
    } catch (error) {
      console.error('Error fetching expert notifications:', error);
      Alert.alert('Error', 'Failed to fetch expert notifications.');
    }
  };

  useEffect(() => {
    fetchExpertNotifications();
  }, []);

  const handleAccept = async (from, notiId, time, type, amount) => {
    try {
      console.warn('From:', from);
      const response = await axios.get(
        `http://10.0.2.2:3000/noti/get-user-fcm/${from}`
      );
      console.warn(response);
      const fcmToken = response.data.fcm;

      const notificationData = {
        token: fcmToken,
        title: 'Your Request has been accepted!',
        body: `Duration: ${time} min, Meeting Type: ${type}, You have to pay: ${amount}`,
      };

      await axios.post(
        'http://10.0.2.2:3000/noti/send-notification',
        notificationData
      );
      await axios.patch(
        `http://10.0.2.2:3000/noti/accepted/${notiId}`
      );
      fetchExpertNotifications();

      Alert.alert(
        'Your response has been sent to the user. If payment succeeds, the meeting will be scheduled.'
      );
    } catch (error) {
      console.warn('Error', error);
      Alert.alert('Something went wrong, try again later.');
    }
  };

  const handleReject = async (from, notiId) => {
    try {
      console.warn('From:', from);
      const response = await axios.get(
        `http://10.0.2.2:3000/noti/get-user-fcm/${from}`
      );
      console.warn(response);
      const fcmToken = response.data.fcm;

      const notificationData = {
        token: fcmToken,
        title: 'OOPS! The expert seems busy right now!',
        body: 'Explore More Experts',
      };

      await axios.post(
        'http://10.0.2.2:3000/noti/send-notification',
        notificationData
      );
      await axios.delete(`http://10.0.2.2:3000/noti/remove-noti/${notiId}`);
      Alert.alert('Your response has been sent to the user.');
    } catch (error) {
      console.warn('Error', error);
      Alert.alert('Something went wrong, try again later.');
    }
  };

  const handlePayment = (notification) => {
    console.warn("Navigating to Payment with:", notification);
    navigation.navigate('Payment', { 
      from: notification.from, 
      to: notification.to, 
      amount: notification.amount, 
      type: notification.type,
      time: notification.time,
      preferredTime: notification.preferredTime,
      notiId: notification._id
    });
  };

  const formatMeetingTime = (timeString) => {
    try {
      if (!timeString) return "N/A";
      
      const date = new Date(timeString);
      
      if (isNaN(date.getTime())) {
        return timeString;
      }
      
      const formattedDate = format(date, "dd/MM/yy");
      const formattedTime = format(date, "HH:mm");
      
      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      console.warn('Time formatting error:', error, timeString);
      return timeString || "N/A"; 
    }
  };

  const renderNotification = ({ item }) => {
    let timeAgo;
    try {
      const date = parseISO(item.preferredTime);
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.warn('Date parsing error:', error, item.createdAt);
      timeAgo = 'recently'; 
    }
    
    const formattedTime = formatMeetingTime(item.preferredTime || item.time);
    
    let icon;
    switch (item.type) {
      case 'Video Call':
        icon = 'videocam';
        break;
      case 'Voice Call':
        icon = 'call';
        break;
      case 'Message':
        icon = 'chatbubble';
        break;
      default:
        icon = 'notifications';
    }

    return (
      <View style={styles.notificationItem}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#4a90e2" />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.from}</Text>
            <Text style={styles.time}>{timeAgo}</Text>
          </View>
          
          <Text style={styles.description}>
            {item.type} • {formattedTime}
          </Text>
          
          {item.amount && (
            <Text style={styles.amount}>💰 ₹{item.amount}</Text>
          )}
          
          {userRole === 'expert' ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => handleAccept(item.from, item._id, item.time, item.type, item.amount)}
              >
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.rejectButton}
                onPress={() => handleReject(item.from, item._id)}
              >
                <Ionicons name="close" size={16} color="#fff" />
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.payButton}
              onPress={() => handlePayment(item)}
            >
              <Ionicons name="card" size={16} color="#fff" />
              <Text style={styles.buttonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {userRole === 'expert' ? 'Requests' : 'Notifications'}
      </Text>
      <FlatList
        data={expertNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Notifications;