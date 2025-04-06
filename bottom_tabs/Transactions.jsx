import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/Context';
const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const {userId} = useContext(UserContext)
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
    if (!email || userRole !== 'user') return;

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:3000/pay/transactions/${userId}`);
        console.warn("response",response);
        setTransactions(response.data.data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [email, userRole]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Transactions</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No transactions found.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <Text style={styles.transactionText}> Amount: Rs. {item.amount}</Text>
              <Text style={styles.transactionText}>
                Date: {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={styles.transactionText}>To: {item.to.name}</Text>
              <Text style={styles.transactionText}>Expert Email: {item.to.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 16, 
    paddingTop: 20 
  },

  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E293B', 
    marginBottom: 16, 
    textAlign: 'center' 
  },

  noTransactions: { 
    fontSize: 16, 
    color: '#64748B', 
    textAlign: 'center', 
    marginTop: 20 
  },

  transactionCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 4, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },

  transactionText: { 
    fontSize: 16, 
    color: '#334155', 
    marginBottom: 6, 
    fontWeight: '500' 
  }
});
