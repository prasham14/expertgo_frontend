import { StyleSheet, Text, View, FlatList,Modal, TouchableOpacity,TextInput,Button, Alert,Dimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from './Search';
const windowWidth = Dimensions.get('window').width;
import { useNavigation } from '@react-navigation/native';
const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const[delayModal,setdelayModal]  = useState(false);
  const[newTime,setNewTime] = useState('');
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

  useEffect(() => {
    if (!email || !userRole) return;

    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/meetings/get-meetings/${email}`);
        setMeetings(response.data.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    const fetchUserMeetings = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/meetings/get-user-meetings/${email}`);
        setMeetings(response.data.data);
      } catch (error) {
        console.error('Error fetching user meetings:', error);
      }
    };

    setLoading(true);
    
    if (userRole === 'expert') {
      fetchMeetings();
    } else {
      fetchUserMeetings();
    }

    setLoading(false);
  }, [email, userRole]);

  const handleCancelMeeting = async (meetingId, userEmail) => {
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
  };
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [selectedExpertEmail, setSelectedExpertEmail] = useState(null);
  
  const openTimeChangeModal = (id, expertemail) => {
    setSelectedMeetingId(id);
    setSelectedExpertEmail(expertemail);
    setdelayModal(true);
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
  
      Alert.alert("Success", "Meeting time updated.");
      setdelayModal(false); // Close modal on success
      setNewTime(""); // Reset input field
    } catch (error) {
      console.error("Error changing meeting time:", error);
      Alert.alert("Error", "Failed to update meeting time.");
    }
  };
  const startVideoCall = (amount) => {
    AsyncStorage.setItem("meetingAmount", amount.toString());
    navigation.navigate("AgoraVideoCall");
  };

  if (loading || !email || !userRole) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {userRole === 'expert' ? (
        <View style={styles.expertSection}>
          <Text style={styles.header}>Welcome, Expert!</Text>
          <Text style={styles.sectionTitle}>Your Scheduled Meetings</Text>
          {meetings.length === 0 ? (
            <Text style={styles.noMeetings}>No scheduled meetings.</Text>
          ) : (
            <FlatList
              data={meetings}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={styles.meetingCard}>
                  <Text style={styles.meetingText}>User: {item.userEmail}</Text>
                  <Text style={styles.meetingText}>Amount: ₹ {item.amount}</Text>
                  <Text style={styles.meetingText}>Type: {item.type.replace('_', ' ')}</Text>
                  <Text style={styles.meetingText}>At: {item.time}</Text>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelMeeting(item._id, item.userEmail)}
                  >
                    <Text style={styles.changeTiming}>Cancel Meeting</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => startVideoCall(100)}>
      <Text style={{ color: "blue" }}>Start Call</Text>
    </TouchableOpacity>
                </View>
              )}
            />
            
          )}
        </View>
      ) : (
        <View style={styles.expertSection}>
          <Text style={styles.header}>Welcome User!</Text>
        <FlatList
          data={meetings}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.meetingCard}>
              <Text style={styles.meetingType}>{item.type.replace('_', ' ')}</Text>
              <Text style={styles.meetingDetails}>📅 at: {item.time}</Text>
              <Text style={styles.meetingEmail}>👤 with: {item.expertemail}</Text>
              <TouchableOpacity
  style={styles.cancelButton}
  onPress={() => openTimeChangeModal(item._id, item.expertemail)}
>
  <Text style={styles.changeTiming}>Change the timing</Text>
</TouchableOpacity>

            </View>
          )}
        />
          </View>

      )}
      <Modal visible={delayModal} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Change Meeting Time</Text>
          
          <TextInput
            placeholder="Enter new time (e.g., 12:30 PM)"
            style={styles.input}
            value={newTime}
            onChangeText={setNewTime}
          />

          <View style={styles.buttonContainer}>
          <Button title="Update Time" onPress={handleTimeChange} />
          <TouchableOpacity onPress={()=>setdelayModal(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </View>
  );
};

export default Meetings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  
  // Expert Section Styles
  expertSection: {
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
    paddingLeft: 5,
  },
  noMeetings: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
  
  // Meeting Card Styles
  meetingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetingText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  meetingType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  meetingDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  meetingEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  
  // Button Styles
  cancelButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  changeTiming: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: windowWidth * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: '600',
  },

});