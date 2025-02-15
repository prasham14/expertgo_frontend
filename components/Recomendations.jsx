import { Text, View, FlatList } from 'react-native';
import React from 'react';

const Recommendations = () => {
  const recommendedData = [
    { id: '1', title: '🚀 Tech Trends', subtitle: 'Discover the latest in tech innovations.' },
    { id: '2', title: '🎨 Portfolio Tips', subtitle: 'Maximize your impact as an expert.' },
    { id: '3', title: '📈 Business Growth', subtitle: 'Strategies to scale your business.' },
    { id: '4', title: '🧠 Productivity Hacks', subtitle: 'Work smarter, not harder!' },
    { id: '5', title: '💼 Career Advice', subtitle: 'Boost your career with expert tips.' },
  ];

  return (
    <View style={styles.recommendedSection}>
      <Text style={styles.sectionTitle}>🔥 Recommended For You</Text>
      <FlatList
        data={recommendedData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recommendedCard}>
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <Text style={styles.recommendedSubtitle}>{item.subtitle}</Text>
          </View>
        )}
        contentContainerStyle={styles.recommendedList}
      />
    </View>
  );
};

export default Recommendations;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  recommendedSection: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937', // Dark grayish blue for a premium look
    marginBottom: 20,
  },

  recommendedList: {
    paddingHorizontal: 15,
  },

  recommendedCard: {
    backgroundColor: '#2D5F89', // Professional deep blue
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    minWidth: 230,
    minHeight: 140,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    justifyContent: 'center',
  },

  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },

  recommendedSubtitle: {
    fontSize: 14,
    color: '#E3E8EF', // Light grayish-blue for a soft contrast
    opacity: 0.9,
  },
});
