import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/ExpertActivity';
import axios from 'axios';

const ExpertActivity = ({userRole}) => {
      const navigation = useNavigation();
      const [experts, setExperts] = useState([]);

      const [portfolio, setPortfolio] = useState(false);
      useEffect(() => {
        const fetchUserRole = async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
              const response = await axios.get(
                `http://10.0.2.2:3000/expert/portfolio/${userId}`,
              );
              setPortfolio(response.data.user);
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          }
        };
    
        fetchUserRole();
      }, []);
    
    const handleExpert = () => {
        navigation.navigate('Expert');
      };

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(
          'http://10.0.2.2:3000/expert/getExperts',
        );
        console.warn(response);
        if (response.data.success) {
          setExperts(response.data.famousExperts);
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);
  return (

    <View>
        {
            userRole === "expert" ? (<View style={styles.expertSection}>
                <Text style={styles.header}>Welcome, Expert!</Text>
                
                {!portfolio && (
                    <View>

                    <Text style={styles.subHeader}>
                    Manage your portfolio and showcase your expertise.
                  </Text>
                  <TouchableOpacity style={styles.button} onPress={handleExpert}>
                    <Text style={styles.buttonText}>Create Your Portfolio</Text>
                  </TouchableOpacity> </View>
                )}
                <View style={styles.expertInfo}>
                  <Text style={styles.sectionTitle}>Your Activity</Text>
                  <Text style={styles.sectionContent}>
                    No recent activity. Start by creating your portfolio!
                  </Text>
                </View>
              </View>):(    <View style={styles.userSection}>
            <Text style={styles.header}>Famous Experts</Text>
            <Text style={styles.subHeader}>
              Explore profiles of renowned experts across various fields.
            </Text>
            <FlatList
              data={experts}
              keyExtractor={item => item.id} // adjust key if needed
              horizontal // This makes the list scroll horizontally
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View style={styles.expertCard}>
                  <Text style={styles.expertName}>{item.ratings}</Text>
                  <Text style={styles.expertName}>{item.email}</Text>
                  <Text style={styles.expertField}>{item.bio}</Text>
                  <Text style={styles.expertField}>{item.isVerified}</Text>

                </View>
              )}
              contentContainerStyle={styles.listContent} // you might update this for horizontal spacing if needed
            />
          </View>)
        }
         
    </View>
   
  )
}

export default ExpertActivity