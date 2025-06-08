import React, { useEffect, useState,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { UserContext } from '../context/Context';
import Feather from 'react-native-vector-icons/Feather'; // Add this to top imports

const BankDetailsScreen = ({navigation}) => {
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    upiId: '',
  });
    const { userId } = useContext(UserContext);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://10.0.2.2:3000/bank/get-bank-details/${userId}`);
      if (response.data) {
        setBankData(response.data);
        setIsEditing(true);
      }
    } catch (err) {
      console.log('No existing bank details or fetch error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!bankData.accountHolderName || !bankData.accountNumber || !bankData.ifscCode || !bankData.bankName) {
      return Alert.alert('Error', 'Please fill in all required fields');
    }

    try {
      setIsLoading(true);
      if (isEditing) {
        await axios.put(`http://10.0.2.2:3000/bank/edit-bank-details/${userId}`, bankData);
        Alert.alert('Success', 'Bank details updated');
        navigation.goBack();
      } else {
         console.log("s",userId)
        await axios.post('http://10.0.2.2:3000/bank/add-bank-details', {
          userId,
          ...bankData,
        });
       
        setIsEditing(true);
        Alert.alert('Success', 'Bank details saved');
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save bank details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bank Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Account Holder Name"
        value={bankData.accountHolderName}
        onChangeText={(text) => setBankData({ ...bankData, accountHolderName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Account Number"
        keyboardType="numeric"
        value={bankData.accountNumber}
        onChangeText={(text) => setBankData({ ...bankData, accountNumber: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="IFSC Code"
        autoCapitalize="characters"
        value={bankData.ifscCode}
        onChangeText={(text) => setBankData({ ...bankData, ifscCode: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Bank Name"
        value={bankData.bankName}
        onChangeText={(text) => setBankData({ ...bankData, bankName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Branch Name"
        value={bankData.branchName}
        onChangeText={(text) => setBankData({ ...bankData, branchName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="UPI ID (Optional)"
        value={bankData.upiId}
        onChangeText={(text) => setBankData({ ...bankData, upiId: text })}
      />
<View style={styles.termsContainer}>
  <Feather name="shield" size={18} color="#6B7280" />
  <TouchableOpacity onPress={() => navigation.navigate('BankTerms')}>
    <Text style={styles.termsText}>  Terms & Conditions</Text>
  </TouchableOpacity>
</View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isEditing ? 'Update Details' : 'Save Details'}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BankDetailsScreen;


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#F9FAFB',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    color: '#1F2937',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  termsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 12,
},
termsText: {
  color: '#2563EB',
  fontSize: 14,
  textDecorationLine: 'underline',
},

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
