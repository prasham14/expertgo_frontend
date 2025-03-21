import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Payment= ({route}) => {
  const { from, to ,type,preferredTime,time,notiId} = route.params;
    const printDetail =async ()=>{
       console.warn("From : " ,  from , "to: ", to,preferredTime);
    }

    useEffect(()=>{
        printDetail();
    },[])
    const navigation  = useNavigation();
  const [amount, setAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://10.0.2.2:3000/pay/order',
        { amount },

      );

      if (data.data) {
        const { id: order_id } = data.data;

        const options = {
          key: 'rzp_test_IEH95UAGO7qP8Z', // Replace with your actual Razorpay key
          amount: amount * 100, // Razorpay works in paisa (INR)
          currency: 'INR',
          name: 'ExpertGo',
          description: 'Payment for ExpertGo',
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
                  amount: amount,
                  from: to,
                  to : from ,
                  type:type,
                  time:time,
                  preferredTime:preferredTime,
                  notiId
                },
              );

              setPaymentStatus(verifyResponse.data.message);
              Alert.alert('Success', 'Payment Successful!');
              
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
                  title: 'Payment Completed by User',
                  body: `Your Meeting has been scheduled at ${preferredTime} as a Video Call`,
                };
          
                await axios.post(
                  'http://10.0.2.2:3000/noti/send-notification',
                  notificationData,
                );
                
                navigation.navigate('MainTabs')
              } catch (error) {
                console.warn('Error', error);
                Alert.alert('Something went wrong, try again later.');
              }
       
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
    }
  };

  return (
    <View style={{ marginTop: 20, alignItems: 'center', width: '100%' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Donate Now</Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'black',
            padding: 10,
            width: 150,
            borderRadius: 10,
            marginRight: 10,
          }}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          onPress={handlePayment}
          disabled={loading}
          style={{
            backgroundColor: 'black',
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white' }}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>

      {paymentStatus && <Text style={{ marginTop: 10 }}>{paymentStatus}</Text>}
    </View>
  );
};

export default Payment;
