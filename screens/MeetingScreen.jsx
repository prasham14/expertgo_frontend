import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { UserContext } from '../context/Context';
import RazorpayCheckout from 'react-native-razorpay';
import styles from '../components/styles/MeetingScreen';

const CreateMeetingScreen = ({ navigation, route }) => {
  const { expertId, type, amount, availSlots, name,expertEmail } = route.params;
  
  function generateRoomId(length = 10) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
  
  const roomId = generateRoomId();
  
  const { userId } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const currentDate = new Date();
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState(tomorrow);
  const [endTime, setEndTime] = useState(new Date(tomorrow.getTime() + 60 * 60 * 1000)); // 1 hour later
  
  const [googleId, setGoogleId] = useState('');
  const [loading, setLoading] = useState(false);

  // Store expert availability as time objects for proper comparison
  const [expertStartHour, setExpertStartHour] = useState(0);
  const [expertEndHour, setExpertEndHour] = useState(23);
  const [expertStartPeriod, setExpertStartPeriod] = useState('AM');
  const [expertEndPeriod, setExpertEndPeriod] = useState('PM');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [baseAmount, setBaseAmount] = useState(amount);
  const [calculatedAmount, setCalculatedAmount] = useState(amount);

  useEffect(() => {
    const fetchGoogleId = async () => {
      console.log(availSlots);
      try {
        const id = await AsyncStorage.getItem('googleId');
        console.log(expertId);
        if (id) {
          setGoogleId(id);
        } else {
          Alert.alert('Error', 'Google ID not found. Please login again.');
        }
      } catch (error) {
        console.error('Failed to fetch Google ID:', error);
        Alert.alert('Error', 'Failed to get user data');
      }
    };

    fetchGoogleId();
    setBaseAmount(amount); 

    // Parse available time slots properly
    if (availSlots) {
      const timeSlotMatch = availSlots.match(/(\d+)\s*(AM|PM)?\s*-\s*(\d+)\s*(AM|PM)/i);
      
      if (timeSlotMatch) {
        const startHour = parseInt(timeSlotMatch[1], 10);
        const startPeriod = timeSlotMatch[2] ? timeSlotMatch[2].toUpperCase() : timeSlotMatch[4].toUpperCase();
        const endHour = parseInt(timeSlotMatch[3], 10);
        const endPeriod = timeSlotMatch[4].toUpperCase();
        
        setExpertStartHour(startHour);
        setExpertStartPeriod(startPeriod);
        setExpertEndHour(endHour);
        setExpertEndPeriod(endPeriod);
      }
    }

    calculateAmount(startTime, endTime);
  }, []);

  // Helper function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (hour, period) => {
    hour = parseInt(hour, 10);
    
    if (period === 'AM') {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  // Check if time is within expert's available hours
  const isWithinExpertHours = (time) => {
    const hour = time.getHours();
    const expertStartHour24 = convertTo24Hour(expertStartHour, expertStartPeriod);
    const expertEndHour24 = convertTo24Hour(expertEndHour, expertEndPeriod);
    
    return hour >= expertStartHour24 && hour <= expertEndHour24;
  };

  const calculateAmount = (start, end) => {
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));
  
    const ratePerMinute = baseAmount / 10; // since baseAmount is for 20 minutes
    const newAmount = Math.ceil(durationMinutes * ratePerMinute).toString(); // round up to nearest int
  
    setCalculatedAmount(newAmount);
    return newAmount;
  };
  

  // Handle date selection
// Handle date selection
const onDateChange = (event, selected) => {
  if (Platform.OS === 'android') {
    setShowDatePicker(false);
  }
  
  if (!selected) return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selected < today) {
    Alert.alert('Invalid Date', 'Please select today or a future date.');
    return;
  }

  setSelectedDate(selected);
  
  const newStartTime = new Date(selected);
  newStartTime.setHours(
    startTime.getHours(), 
    startTime.getMinutes(), 
    0, 0
  );
  
  const newEndTime = new Date(selected);
  newEndTime.setHours(
    endTime.getHours(), 
    endTime.getMinutes(), 
    0, 0
  );
  
  setStartTime(newStartTime);
  setEndTime(newEndTime);
  
  // Recalculate amount
  calculateAmount(newStartTime, newEndTime);
};

  // Handle start time selection
  const onStartTimeChange = (event, selected) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    
    if (!selected) return;
    
    // Make sure the selected time is not in the past
    const now = new Date();
    if (selectedDate.getDate() === now.getDate() && 
        selectedDate.getMonth() === now.getMonth() && 
        selectedDate.getFullYear() === now.getFullYear() && 
        selected < now) {
      Alert.alert('Invalid Time', 'Please select a future time.');
      return;
    }
    
    // Update start time
    const newStartTime = new Date(selectedDate);
    newStartTime.setHours(selected.getHours(), selected.getMinutes());
    
    // Check if the new start time is within expert's available hours
    if (!isWithinExpertHours(newStartTime)) {
      Alert.alert('Warning', `Expert only available between ${expertStartHour}${expertStartPeriod} - ${expertEndHour}${expertEndPeriod}`);
      return;
    }
    
    setStartTime(newStartTime);
    
    // If end time is before new start time, update end time to be 1 hour after start
    if (endTime <= newStartTime) {
      const newEndTime = new Date(newStartTime.getTime() + 60 * 60 * 1000);
      setEndTime(newEndTime);
    }
    
    // Recalculate amount
    calculateAmount(newStartTime, endTime <= newStartTime ? new Date(newStartTime.getTime() + 60 * 60 * 1000) : endTime);
  };

  // Handle end time selection
  const onEndTimeChange = (event, selected) => {
    if (Platform.OS === 'android') {
      setShowEndTimePicker(false);
    }
    
    if (!selected) return;
    
    // Create new end time object
    const newEndTime = new Date(selectedDate);
    newEndTime.setHours(selected.getHours(), selected.getMinutes());
    
    // Make sure end time is after start time
    if (newEndTime <= startTime) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }
    
    // Check if the new end time is within expert's available hours
    if (!isWithinExpertHours(newEndTime)) {
      Alert.alert('Warning', `Expert only available between ${expertStartHour}${expertStartPeriod} - ${expertEndHour}${expertEndPeriod}`);
      return;
    }
    
    // Update end time
    setEndTime(newEndTime);
    
    // Recalculate amount
    calculateAmount(startTime, newEndTime);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Show date picker
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Show time pickers
  const showStartTimePickerModal = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimePickerModal = () => {
    setShowEndTimePicker(true);
  };

  // Payment handler
  const handlePayment = async () => {
    if (!calculatedAmount || parseFloat(calculatedAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://expertgo-v1.onrender.com/pay/order',
        { amount: calculatedAmount }
      );

      if (data.data) {
        const { id: order_id } = data.data;

        const options = {
          key: 'rzp_test_IEH95UAGO7qP8Z', // Replace with your actual Razorpay key
          amount: calculatedAmount * 100, // Razorpay works in paisa (INR)
          currency: 'INR',
          name: 'ExpertGo',
          description: 'Payment for Expert Meeting',
          order_id,
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9876543210',
          },
          theme: { color: '#F37254' },
        };

        RazorpayCheckout.open(options)
          .then(async (response) => {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

            try {
              const verifyResponse = await axios.post(
                'https://expertgo-v1.onrender.com/pay/verify',
                {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                  amount: calculatedAmount,
                  from: userId,
                  to: expertId,
                  type: type,
                  time: startTime,
                  preferredTime: `${formatDate(startTime)} ${formatTime(startTime)}`,
                }
              );
           
              setPaymentStatus(verifyResponse.data.message);
              setPaymentComplete(true);
              Alert.alert('Success', 'Payment Successful! Creating your meeting...');
              console.log(verifyResponse);
              // Now proceed to create the meeting after successful payment
              createMeeting(verifyResponse.data.data);
              console.log("id" ,verifyResponse.data.data )
              
            } catch (error) {
              Alert.alert('Error', 'Amount Limit Exceeded');
              setPaymentStatus('Please try again with a lower amount.');
            }
          })
          .catch((error) => {
            Alert.alert('Error', 'Transaction Failed');
            setPaymentStatus('Payment was not completed.');
          });
      }
    } catch (error) {
      Alert.alert('Error', 'Transaction Failed');
      setPaymentStatus('Error creating payment. Please try again.');
    } finally {
      setLoading(false);
      setPaymentModalVisible(false);
    }
  };
  const checkAvailability = async () => {
    setLoading(true);
    console.log('Params:',startTime.toISOString(), endTime.toISOString());

    try {
      const response = await axios.get('https://expertgo-v1.onrender.com/meet/check-availability', {
        params: {
          googleId,
          title,
          expertId:expertId,
          startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
        }
      });
      
      console.log(response);
      // Check if the response indicates availability
      return response.data.available === true;
    } catch (error) {
      console.error('Availability check failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to check availability. Please try again.';
      console.log('Error message:', errorMessage);
      
      // If status is 409, the expert is busy
      if (error.response?.status === 409) {
        return false; // Expert is busy
      }
      
      // For other errors, alert the user and assume the expert is busy
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Create meeting after payment success
  const createMeeting = async (transactionId) => {
    console.log("expertID" ,expertId , roomId)
    setLoading(true);
    console.log("create" , startTime.toISOString());
    console.log("transactionid",transactionId)
    try {
      const response = await axios.post('https://expertgo-v1.onrender.com/meet/create-meeting', {
        googleId,
        title,
        description,
        expertId: expertId,
        transactionId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
      console.log(response)
       if (!roomId) {
     Alert.alert("roomId not found in meeting creation response");
  }
      const id_room = await axios.post(
        `https://expertgo-v1.onrender.com/meet/save-room-id/${userId}/${expertId}`,
        { roomId }
      );
      console.log(id_room)
      if (response.status === 201) {
        try {
          const notificationResponse = await axios.get(
            `https://expertgo-v1.onrender.com/noti/get-user-fcm/${expertEmail}`,
          );
          
          const fcmToken = notificationResponse.data.fcm;
          console.log("fcm", fcmToken);
          const notificationData = {
            token: fcmToken,
            title: 'New Meeting Scheduled',
            body: `A meeting titled "${title}" has been scheduled for ${formatDate(startTime)} ${formatTime(startTime)}`,
          };
          
          await axios.post(
            'https://expertgo-v1.onrender.com/noti/send-notification',
            notificationData,
          );
          await axios.post('https://expertgo-v1.onrender.com/noti/save-request' , {
            startTime,
            endTime,
            title,
            isRead : false,
            from : userId,
            to : expertId
          })
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
        }
        
        navigation.replace('MainTabs') 
      }
    } catch (error) {
      console.error('Meeting creation failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create meeting. Please try again.';
      console.log(errorMessage)
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    console.log("here" , startTime.toISOString()  , endTime.toISOString())
    if (!isWithinExpertHours(startTime) || !isWithinExpertHours(endTime)) {
      Alert.alert("Warning", `Expert only available between ${expertStartHour}${expertStartPeriod} - ${expertEndHour}${expertEndPeriod}`);
      return;
    }
    
    const currentTime = new Date();
    if (startTime <= currentTime) {
      Alert.alert('Oops!', 'Please select a future date and time for the meeting');
      return;
    }
    
    const isAvailable = await checkAvailability();
    if (!isAvailable) {
      Alert.alert(
        'Sorry', 
        'The Expert is busy at this time',
      );
      return;
    }
    
    // Form validation
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a meeting title');
      return;
    }
    
    if (endTime <= startTime) {
      Alert.alert('Oops', 'End time must be after start time');
      return;
    }
    
    setPaymentModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Meeting</Text>
      <Text style={styles.header}>{name} is Available between: {availSlots}</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title (Agenda)</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Meeting Title"
                      placeholderTextColor="#888"

        />
      </View>
      
      {/* Date Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={showDatePickerModal}
        >
          <Text>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Start Time Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={showStartTimePickerModal}
        >
          <Text>{formatTime(startTime)}</Text>
        </TouchableOpacity>
      </View>
      
      {/* End Time Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={showEndTimePickerModal}
        >
          <Text>{formatTime(endTime)}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()} // This prevents selecting past dates
        />
      )}
      
      {/* Start Time Picker */}
      {showStartTimePicker && (
        <DateTimePicker
          testID="startTimePicker"
          value={startTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartTimeChange}
        />
      )}
      
      {/* End Time Picker */}
      {showEndTimePicker && (
        <DateTimePicker
          testID="endTimePicker"
          value={endTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndTimeChange}
        />
      )}
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleFormSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Schedule Meeting</Text>
        )}
      </TouchableOpacity>
      
      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Payment Required</Text>
            <Text style={styles.modalText}>
              Please make a payment to schedule the meeting with the expert.
            </Text>
            
            <View style={styles.paymentDetails}>
              <Text style={styles.detailText}>
                Meeting Duration: {Math.round((endTime - startTime) / (1000 * 60))} minutes
              </Text>
              <Text style={styles.detailText}>
                Rate: ₹{baseAmount} per 10 minutes
              </Text>
            </View>
            
            <View style={styles.paymentInputContainer}>
              <Text style={styles.totalAmountLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>₹{calculatedAmount}</Text>
            </View>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setPaymentModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.payButton]}
                onPress={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payButtonText}>Pay Now</Text>
                )}
              </TouchableOpacity>
            </View>
            
            {paymentStatus && (
              <Text style={styles.paymentStatus}>{paymentStatus}</Text>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CreateMeetingScreen;