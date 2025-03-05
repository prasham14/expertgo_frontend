import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const VideoCall = ({route}) => {
  const {email} = route.params; 
  const {type} = route.params;
  const userId = route.params.expertId;
  const [totalTime, setTotalTime] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const navigation = useNavigation();

  const handleBooking = async () => {
    if (!totalTime || !preferredTime) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      // Fetch the expert's FCM token
      const response = await axios.get(`http://10.0.2.2:3000/user/getToken/${userId}`);
      const expertToken = response.data.token;

      if (!expertToken) {
        Alert.alert("Error", "Expert is not available for notifications.");
        return;
      }

      // Notification data
      const notificationData = {
        token: expertToken,
        title: `New ${type}  Request`,
        body: `Duration: ${totalTime} min, Time: ${preferredTime} from ${email}` ,
      };

      // Send push notification
      await axios.post("http://10.0.2.2:3000/noti/send-notification", notificationData);

      // Construct request object
      const requestData = {
        time: totalTime,
        preferredTime: preferredTime,
        comment: notes,
        type: type,
        from:email,
        to:userId,
        isRead: false,
      };

      // Save request in the database
      await axios.post(`http://10.0.2.2:3000/noti/save-request/${userId}`, requestData);

      Alert.alert("Success", "Your request has been sent to the Expert! Wait for their response.");
      navigation.replace("MainTabs");
    } catch (error) {
      console.warn("Error sending notification:", error);
      Alert.alert("Error", "Failed to notify the expert.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule Your Session</Text>
      
      <Text style={styles.label}>Total Duration (in minutes):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 30"
        keyboardType="numeric"
        value={totalTime}
        onChangeText={setTotalTime}
      />

      <Text style={styles.label}>Preferred Time:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 3:00 PM on 25/02/2025"
        value={preferredTime}
        onChangeText={setPreferredTime}
      />

      <Text style={styles.label}>Add Message (Optional):</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Any specific requirements?"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleBooking}>
        <Text style={styles.buttonText}>Book Session</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center'
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 10
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333'
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});
