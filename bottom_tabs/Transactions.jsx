import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/Context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Transactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Date');
  const { userId } = useContext(UserContext);
  const insets = useSafeAreaInsets();

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
      setLoading(true);
      try {
        const response = await axios.get(`http://10.0.2.2:3000/pay/transactions/${userId}`);
        console.warn("response", response);
        
        // Transform data to match the UI in the image
        const transformedData = (response.data.data || []).map(item => ({
          _id: item._id,
          name: item.to.name || 'Unknown Merchant',
          email: item.to.email,
          amount: `Rs.${item.amount.toLocaleString('id-ID')}`,
          date: new Date(item.date),
          status : item.status
        }));
        
        setTransactions(transformedData);
                setLoading(false);

      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [email, userRole]);

  const groupTransactions = (transactions, key) => {
    const grouped = {};
  
    transactions.forEach(transaction => {
      let groupKey;
  
      if (key === 'Date') {
        groupKey = transaction.date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } else if (key === 'Name') {
        groupKey = transaction.name || 'Unknown Merchant';
      }
  
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(transaction);
    });
  
    return Object.keys(grouped).map(groupKey => ({
      groupKey,
      transactions: grouped[groupKey],
      isToday: activeFilter === 'Date' && 
               new Date().toDateString() === new Date(grouped[groupKey][0].date).toDateString()
    }));
  };
  
  const groupedData = groupTransactions(transactions, activeFilter);
  

  // // Convert to array for FlatList
  // const groupedData = Object.keys(groupedTransactions).map(date => ({
  //   date,
  //   transactions: groupedTransactions[date],
  //   isToday: new Date().toDateString() === new Date(groupedTransactions[date][0].date).toDateString()
  // }));

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.iconContainer}>
          <Icon name="laptop" size={20} color="#6C5CE7" style={styles.categoryIcon} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.merchantName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Icon name="email" size={12} color="#64748B" />
          <Text style={styles.locationText}>{item.email}</Text>
        </View>
        {/* <View style={styles.paymentMethodContainer}>
          {
            item.status === 'pending' ? ( <Text style={styles.cardNumber}>You can cancel the meeting</Text>):( <Text style={styles.cardNumber}> {item.status}</Text>)
          }
       

        </View> */}
      </View>
      <Text style={styles.amount}>{item.amount}</Text>
    </View>
  );

  const renderGroup = ({ item }) => (
    <View style={styles.dateGroup}>
      <Text style={styles.dateHeader}>
        {item.isToday ? 'Today' : item.groupKey}
      </Text>
      {item.transactions.map(transaction => (
        <View key={transaction._id}>
          {renderTransactionItem({ item: transaction })}
        </View>
      ))}
    </View>
  );
  
  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { paddingTop: insets.top > 0 ? 0 : StatusBar.currentHeight }
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        {['Date', 'Name'].map(filter => (
          <TouchableOpacity 
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={styles.filterText}>{filter}</Text>
            {/* <Icon name="keyboard-arrow-down" size={18} color="#000" /> */}
          </TouchableOpacity>
        ))}
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="receipt-long" size={60} color="#CBD5E1" />
          <Text style={styles.noTransactions}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
        data={groupedData}
        keyExtractor={(item) => item.groupKey}
        renderItem={renderGroup}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      )}
    </SafeAreaView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 100,
    flex: 1,
    marginHorizontal: 4,
  },
  activeFilterButton: {
    backgroundColor: '#E2E8F0',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginRight: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginVertical: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0ECFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    opacity: 0.8,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  merchantName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 2,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethod: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  cardNumber: {
    fontSize: 12,
    color: '#64748B',
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noTransactions: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
});