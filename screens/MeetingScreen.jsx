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
  const { expertId,type,amount } = route.params;
  const { userId } = useContext(UserContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); 
  const [googleId, setGoogleId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [currentEditingTime, setCurrentEditingTime] = useState('start');
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [baseAmount, setBaseAmount] = useState(amount);
  const [calculatedAmount, setCalculatedAmount] = useState(amount);


  useEffect(() => {
    const fetchGoogleId = async () => {
      try {
        const id = await AsyncStorage.getItem('googleId');
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
  calculateAmount(startTime, endTime);
  }, []);
const calculateAmount = (start, end) => {
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.max(1, Math.round(durationMs / (1000 * 60)));
  const tenMinuteBlocks = Math.ceil(durationMinutes / 10);
  const newAmount = (baseAmount * tenMinuteBlocks).toString();
  setCalculatedAmount(newAmount);
  return newAmount;
};

const onDateChange = (event, selectedDate) => {
  if (Platform.OS === 'android') {
    setShowStartPicker(false);
    setShowEndPicker(false);
  }
  
  if (!selectedDate) return;

  let newStartTime = startTime;
  let newEndTime = endTime;

  if (currentEditingTime === 'start') {
    if (pickerMode === 'date') {
      if (Platform.OS === 'android') {
        const newDate = new Date(selectedDate);
        const currentTime = new Date(startTime);
        newDate.setHours(currentTime.getHours());
        newDate.setMinutes(currentTime.getMinutes());
        newStartTime = newDate;
        setStartTime(newDate);
        
        setPickerMode('time');
        setTimeout(() => setShowStartPicker(true), 100);
      } else {
        newStartTime = selectedDate;
        setStartTime(selectedDate);
      }
    } else {
      newStartTime = selectedDate;
      setStartTime(selectedDate);
      setPickerMode('date'); 

      if (endTime < selectedDate) {
        newEndTime = new Date(selectedDate.getTime() + 60 * 60 * 1000); 
        setEndTime(newEndTime);
      }
    }
  } else {
    // For end time
    if (pickerMode === 'date') {
      // If we just picked the date, now let's pick the time (Android)
      if (Platform.OS === 'android') {
        const newDate = new Date(selectedDate);
        const currentTime = new Date(endTime);
        newDate.setHours(currentTime.getHours());
        newDate.setMinutes(currentTime.getMinutes());
        newEndTime = newDate;
        setEndTime(newDate);
        
        // Show time picker next
        setPickerMode('time');
        setTimeout(() => setShowEndPicker(true), 100);
      } else {
        // iOS handles both date and time in one picker
        newEndTime = selectedDate;
        setEndTime(selectedDate);
      }
    } else {
      // We finished picking the time
      newEndTime = selectedDate;
      setEndTime(selectedDate);
      setPickerMode('date'); // Reset for next time
    }
  }
  
  // Calculate new amount based on duration
  calculateAmount(newStartTime, newEndTime);
};

  // Show date pickers in a platform-appropriate way
  const showDateTimePicker = (timeType) => {
    setCurrentEditingTime(timeType);
    setPickerMode('date');
    
    if (timeType === 'start') {
      setShowStartPicker(true);
      setShowEndPicker(false);
    } else {
      setShowEndPicker(true);
      setShowStartPicker(false);
    }
  };

  // Format date for display
  const formatDateTime = (date) => {
    return date.toLocaleString();
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
        'http://10.0.2.2:3000/pay/order',
        { amount :calculatedAmount}
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
                'http://10.0.2.2:3000/pay/verify',
                {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                  amount: calculatedAmount,
                  from: userId,
                  to: expertId,
                  type: type,
                  time: startTime,
                  preferredTime: formatDateTime(startTime),
                }
              );

              setPaymentStatus(verifyResponse.data.message);
              setPaymentComplete(true);
              Alert.alert('Success', 'Payment Successful! Creating your meeting...');
              
              // Now proceed to create the meeting after successful payment
              createMeeting();
              
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
  
    try {
      const response = await axios.get('http://10.0.2.2:3000/meet/check-availability', {
        params: {
          googleId,
          title,
          description,
          expertId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        }
      });
  
      if (response.data.error) {
        return true; 
      } else {
        return false; 
      }
  
    } catch (error) {
      console.error('Availability check failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to check availability. Please try again.';
      // Alert.alert('Error', errorMessage);
      return true; // assume busy if there's an error
    } finally {
      setLoading(false);
    }
  };
  
  // Create meeting after payment success
  const createMeeting = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post('http://10.0.2.2:3000/meet/create-meeting', {
        googleId,
        title,
        description,
        expertId: expertId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
      
      if (response.status === 201) {
        // Try to send notification
        try {
          const notificationResponse = await axios.get(
            `http://10.0.2.2:3000/noti/get-user-fcm/${expertId}`,
          );
          
          const fcmToken = notificationResponse.data.fcm;
          
          const notificationData = {
            token: fcmToken,
            title: 'New Meeting Scheduled',
            body: `A meeting titled "${title}" has been scheduled for ${formatDateTime(startTime)}`,
          };
          
          await axios.post(
            'http://10.0.2.2:3000/noti/send-notification',
            notificationData,
          );
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // Continue even if notification fails
        }
        
        Alert.alert(
          'Success', 
          'Meeting created successfully! Check your Notifications for meeting link.',
          [{ text: 'OK', onPress: () => navigation.navigate('MainTabs') }]
        );
      }
    } catch (error) {
      console.error('Meeting creation failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create meeting. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit =async () => {
    const currentTime = new Date();
    if (startTime <= currentTime) {
      Alert.alert('Oops!', 'Please select a future date and time for the meeting');
      return;
    }
    const response = await checkAvailability();
      if(response){
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
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Meeting Title"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Meeting Description"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => showDateTimePicker('start')}
        >
          <Text>{formatDateTime(startTime)}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => showDateTimePicker('end')}
        >
          <Text>{formatDateTime(endTime)}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Conditionally render the date/time pickers */}
      {showStartPicker && (
        <DateTimePicker
          testID="startTimePicker"
          value={startTime}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      
      {showEndPicker && (
        <DateTimePicker
          testID="endTimePicker"
          value={endTime}
          mode={pickerMode}
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
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
        {/* <Text style={styles.detailText}>
          10-minute blocks: {Math.ceil(Math.round((endTime - startTime) / (1000 * 60)) / 10)}
        </Text> */}
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