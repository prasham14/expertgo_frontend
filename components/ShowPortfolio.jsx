import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const PortfolioScreen = ({ route }) => {
  const { userId } = route.params;
  console.warn(userId);
  const [expert, setExpert] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expertRes, portfolioRes] = await Promise.all([
          axios.get(`http://10.0.2.2:3000/profile/profile/${userId}`),
          axios.get(`http://10.0.2.2:3000/expert/portfolio/${userId}`)
        ]);

        if (expertRes.data.success) setExpert(expertRes.data.data);
        if (portfolioRes.data.success) setPortfolio(portfolioRes.data.data);
      } catch (error) {
        console.error('Error fetching expert details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* Portfolio Section */}
      {portfolio ? (
        <View style={styles.section}>
          <Text style={styles.name}>{portfolio?.fullName || "N/A"}</Text>
          <Text style={styles.category}>{portfolio?.email || "N/A"}</Text>
          <Text style={styles.bio}>{portfolio?.currentPost || "N/A"}</Text>
          <Text style={styles.email}>{portfolio?.url || "N/A"}</Text>
          <Text style={styles.ratings}>{portfolio?.experience || "N/A"}</Text>
          <Text style={styles.charges}>Skills: {portfolio?.skills || "N/A"}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>No portfolio available {userId ? (null):(<Text>dd</Text>)}</Text>
      )}

      {/* Expert Section */}
      {expert ? (
        <View style={styles.section}>
          <Text style={styles.name}>{expert?.bio || "N/A"}</Text>
          <Text style={styles.category}>Total Deals: {expert?.totalDeals || 0}</Text>
          <Text style={styles.ratings}>{expert?.ratings || 0} ⭐</Text>
          <Text style={styles.charges}>Charges: {expert?.charges?.join(', ') || "N/A"}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>No expert details available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  category: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  bio: {
    fontSize: 16,
    color: '#444',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  ratings: {
    fontSize: 18,
    color: '#FFD700',
    marginTop: 5,
  },
  charges: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PortfolioScreen;
