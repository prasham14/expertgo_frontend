import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from './Search';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
        const response = await axios.get(`http://10.0.2.2:3000/pay/transactions/${email}`);
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

  // if (loading) return <Text>Loading...</Text>;
  // if (userRole !== 'user') return <Text>Access Denied</Text>;

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
              <Text style={styles.transactionText}>💰 Amount: ${item.amount}</Text>
              <Text style={styles.transactionText}>📅 Date: {item.date}</Text>
              <Text style={styles.transactionText}>To: {item.to}</Text>

            </View>
          )}
        />
      )}
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  noTransactions: { fontSize: 14, color: 'gray' },
  transactionCard: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
  transactionText: { fontSize: 14 }
});