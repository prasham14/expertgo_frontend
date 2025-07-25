import React, {useEffect, useState, useContext} from 'react';
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
import { UserContext } from '../context/Context';

const Notifications = ({route}) => {
  const {email, userRole} = route.params;
  const {userId} = useContext(UserContext)
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  
  const fetchNotifications = async () => {
    try {
      console.log(userId)
      const response = await axios.get(
        `https://expertgo-v1.onrender.com/noti/get-Requests/${userId}`
      );

      if (response.status === 200) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRemoveNotification = async (notiId) => {
    try {
      await axios.delete(`https://expertgo-v1.onrender.com/noti/remove-noti/${notiId}`);
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification._id !== notiId)
      );
    } catch (error) {
      console.warn('Error removing notification:', error);
      Alert.alert('Something went wrong, try again later.');
    }
  };



  const renderNotification = ({ item }) => {
    let timeAgo;
    try {
      const date = parseISO(item.createdAt || item.preferredTime);
      timeAgo = formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      timeAgo = 'recently'; 
    }
    
  

    return (
      <View style={styles.notificationItem}>
        {/* Cross icon to remove notification */}
        <TouchableOpacity 
          style={styles.removeIcon}
          onPress={() => handleRemoveNotification(item._id)}
        >
          <Ionicons name="close-circle" size={22} color="#ff4d4d" />
        </TouchableOpacity>
      
        <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
            <Text style={styles.name}>Client : {item.from?.name || "Unknown"}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.from?.email || "Unknown"}</Text>
            <Text style={styles.time}>{timeAgo}</Text>
          </View>
          <View style={styles.headerRow}>
  <Text style={styles.name}>
    Start at: {item.startTime ? new Date(item.startTime).toLocaleString() : "Unknown"}
  </Text>
</View>

          {item.amount && (
            <Text style={styles.amount}> ₹{item.amount}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications to display</Text>
        </View>
      )}
    </View>
  );
};

export default Notifications;