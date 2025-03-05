import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const Notifications = ({route}) => {
  const {email, userRole} = route.params;
  const [expertNotifications, setExpertNotifications] = useState([]);
  const navigation = useNavigation();
  const fetchExpertNotifications = async () => {
    console.warn("I am called",email)
    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/noti/get-Requests/${email}`,
      );

      if (response.status === 200) {
        const allNotifications = response.data.data;

        const filteredNotifications =
          userRole === 'user'
            ? allNotifications.filter(
                notification => notification.isRead === true && notification.isPaid === false,
              ) 
            : allNotifications.filter(
              notification => notification.isRead === false ); 
      console.log("fitlered",filteredNotifications)
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

  const handleAccept = async (from,notiId,time,type,amount) => {
    try {
      console.warn('From:', from);
      const email = from;
      console.warn('Email:', email);

      const response = await axios.get(
        `http://10.0.2.2:3000/noti/get-user-fcm/${email}`,
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
        notificationData,
      );
      await axios.patch(
        `http://10.0.2.2:3000/noti/accepted/${notiId}`);
      Alert.alert(
        'Your response has been sent to the user. If payment succeeds, the meeting will be scheduled.',
      );
    } catch (error) {
      console.warn('Error', error);
      Alert.alert('Something went wrong, try again later.');
    }
  };

  const handleReject = async (from, notiId) => {
    try {
      console.warn('From:', from);
      const email = from;
      console.warn('Email:', email);
      console.warn('Id', notiId);

      const response = await axios.get(
        `http://10.0.2.2:3000/noti/get-user-fcm/${email}`,
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
        notificationData,
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
      preferredTime:notification.preferredTime,
      notiId:notification._id
    });
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {/* Notifications Header */}
      <Text style={styles.subHeader}>
        {userRole === 'expert' ? 'Requests for You' : 'Your Notifications'}
      </Text>

      {expertNotifications.length === 0 ? (
        <Text style={styles.noNotifications}>No new notifications.</Text>
      ) : (
        expertNotifications.map(notification => (
          <View key={notification._id} style={styles.card}>
            {/* Show all details for experts */}
            {userRole === 'expert' ? (
              <>
                <Text style={styles.label}>📅 Duration:</Text>
                <Text style={styles.value}>{notification.time}</Text>

                <Text style={styles.label}>📞 Type:</Text>
                <Text style={styles.value}>{notification.type}</Text>

                <Text style={styles.label}>📝 Comment:</Text>
                <Text style={styles.value}>
                  {notification.comment || 'No additional comments.'}
                </Text>
              </>
            ) : (
              <View>
                <Text style={styles.label}>
                  The expert is available to you ,Pay now to schedule to
                  service:
                </Text>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handlePayment(notification)}>
                  <Text style={styles.label}>Pay</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{notification.from}</Text>
            <Text style={styles.label}>💰 Amount:</Text>
            <Text style={styles.value}>{notification.amount}</Text>
            {/* Show accept/reject buttons only for experts */}
            {userRole === 'expert' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() =>
                    handleAccept(
                      notification.from,
                      notification._id,
                      notification.time,
                      notification.type,
                      notification.amount,

                    )
                  }>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() =>
                    handleReject(notification.from, notification._id)
                  }>
                  <Ionicons name="close-circle" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5', // Lighter background for better contrast
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
    paddingVertical: 10, // Add some vertical padding
  },
  subHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#444',
    marginTop: 15,
    marginBottom: 12,
  },
  noNotifications: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    marginBottom: 30,
    fontStyle: 'italic', // Make it more distinctive
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1, // Reduced shadow opacity for subtlety
    shadowRadius: 8, // Increased for a softer shadow
    elevation: 3,
    marginBottom: 12,
    borderLeftWidth: 4, // Add an accent border
    borderLeftColor: '#4CAF50', // Default color, can be dynamic based on notification type
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    textTransform: 'uppercase', // Makes labels stand out
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginBottom: 12,
    lineHeight: 22, // Improved readability
  },
  timestamp: {
    // New style for timestamps
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Right-aligned buttons
    marginTop: 12,
    gap: 8, // Space between buttons
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 90, // Ensure consistent button width
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 90,
  },
  buttonText: {
    // New style for button text
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  unreadIndicator: {
    // New style for unread notifications
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  // Fixed the inconsistent btn style
  btn: {
    backgroundColor: '#007BFF', // Changed from black for better usability
    padding: 12, // Reduced from 40 which seemed excessive
    borderRadius: 8,
    alignItems: 'center',
  },
});
