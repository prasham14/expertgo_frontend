// import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/Booking';
const VideoCall = ({route}) => {
  const {email} = route.params; 
  const {type} = route.params;
  const userId = route.params.expertId;
  console.log("expertId : ",userId);
  const navigation = useNavigation();
  
  // Form states
  const [totalTime, setTotalTime] = useState('30');
  const [notes, setNotes] = useState('');
  
  // Date picker states
  const [day, setDay] = useState('1');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2025');
  
  // Time picker states
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('PM');
  
  // Generate arrays for picker options
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString());
    }
    return days;
  };
  
  const generateHours = () => {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push(i.toString());
    }
    return hours;
  };
  
  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 15) {
      minutes.push(i.toString().padStart(2, '0'));
    }
    return minutes;
  };
  
  const getFormattedDate = () => {
    return `${day}/${month}/${year}`;
  };
  
  const getFormattedTime = () => {
    return `${hour}:${minute} ${ampm}`;
  };
  
  const handleBooking = async () => {
    if (!totalTime) {
      Alert.alert("Error", "Please specify the session duration.");
      return;
    }

    try {
      // Convert selected date and time to Date object
      const selectedHour = parseInt(hour) + (ampm === 'PM' && hour !== '12' ? 12 : 0) - (ampm === 'AM' && hour === '12' ? 12 : 0);
      const bookingDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        selectedHour,
        parseInt(minute)
      );
      
      // Validate date (check if it's in the future)
      const now = new Date();
      if (bookingDateTime <= now) {
        Alert.alert("Error", "Please select a future date and time.");
        return;
      }
      
      // Format for display
      const formattedDateTime = `${getFormattedDate()} at ${getFormattedTime()}`;
      
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
        title: `New ${type} Request`,
        body: `Duration: ${totalTime} min, Time: ${formattedDateTime} from ${email}`,
      };

      // Send push notification
      await axios.post("http://10.0.2.2:3000/noti/send-notification", notificationData);

      // Request data for database
      const requestData = {
        time: totalTime,
        preferredTime: bookingDateTime.toISOString(),
        comment: notes,
        type: type,
        from: email,
        isRead: false,
        
      };
     console.log(requestData)
      // Save request in the database
      await axios.post(`http://10.0.2.2:3000/noti/save-request/${userId}`, requestData);

      Alert.alert("Success", "Your request has been sent to the Expert! Wait for their response.");
      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("Error", "Failed to notify the expert: " + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Schedule Your {type === 'video_call' ? 'Video' : 'Voice'} Session</Text>
      
      <Text style={styles.label}>Total Duration (in minutes):</Text>
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={totalTime}
          onValueChange={(value) => setTotalTime(value)}
        >
          <Picker.Item label="10 minutes" value="10" />
          <Picker.Item label="20 minutes" value="20" />
          <Picker.Item label="30 minutes" value="30" />
          <Picker.Item label="40 minutes" value="40" />
          <Picker.Item label="50 minutes" value="50" />
          <Picker.Item label="60 minutes" value="60" />
        </Picker>
      </View>

      <Text style={styles.label}>Preferred Date:</Text>
      <View style={styles.dateContainer}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Day</Text>
          <Picker
            style={styles.datePicker}
            selectedValue={day}
            onValueChange={(value) => setDay(value)}
          >
            {generateDays().map((d) => (
              <Picker.Item key={`day-${d}`} label={d} value={d} />
            ))}
          </Picker>
        </View>
        
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Month</Text>
          <Picker
            style={styles.datePicker}
            selectedValue={month}
            onValueChange={(value) => setMonth(value)}
          >
            <Picker.Item label="Jan" value="1" />
            <Picker.Item label="Feb" value="2" />
            <Picker.Item label="Mar" value="3" />
            <Picker.Item label="Apr" value="4" />
            <Picker.Item label="May" value="5" />
            <Picker.Item label="Jun" value="6" />
            <Picker.Item label="Jul" value="7" />
            <Picker.Item label="Aug" value="8" />
            <Picker.Item label="Sep" value="9" />
            <Picker.Item label="Oct" value="10" />
            <Picker.Item label="Nov" value="11" />
            <Picker.Item label="Dec" value="12" />
          </Picker>
        </View>
        
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Year</Text>
          <Picker
            style={styles.datePicker}
            selectedValue={year}
            onValueChange={(value) => setYear(value)}
          >
            <Picker.Item label="2025" value="2025" />
          </Picker>
        </View>
      </View>

      <Text style={styles.label}>Preferred Time:</Text>
      <View style={styles.dateContainer}>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Hour</Text>
          <Picker
            style={styles.datePicker}
            selectedValue={hour}
            onValueChange={(value) => setHour(value)}
          >
            {generateHours().map((h) => (
              <Picker.Item key={`hour-${h}`} label={h} value={h} />
            ))}
          </Picker>
        </View>
        
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Minute</Text>
          <Picker
            style={styles.datePicker}
            selectedValue={minute}
            onValueChange={(value) => setMinute(value)}
          >
            {generateMinutes().map((m) => (
              <Picker.Item key={`min-${m}`} label={m} value={m} />
            ))}
          </Picker>
        </View>
        
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>AM/PM</Text>
          <Picker
            style={styles.datePicker}
            selectedValue={ampm}
            onValueChange={(value) => setAmPm(value)}
          >
            <Picker.Item label="AM" value="AM" />
            <Picker.Item label="PM" value="PM" />
          </Picker>
        </View>
      </View>
      
      <View style={styles.selectedTimeContainer}>
        <Text style={styles.selectedTimeLabel}>Selected Date & Time:</Text>
        <Text style={styles.selectedTimeText}>{getFormattedDate()} at {getFormattedTime()}</Text>
      </View>

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
      
      <View style={styles.spacer} />
    </ScrollView>
  );
};

export default VideoCall;

