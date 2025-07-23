import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
const ExpertDash = () => {
  const [upcomingCalls, setUpcomingCalls] = useState(0)
  const [weekCalls, setWeekCalls] = useState(0)
  const [earnings, setEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
const navigation = useNavigation();
  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const expertId = await AsyncStorage.getItem('userId')
        if (!expertId) {
          console.error('Expert ID not found')
          setLoading(false)
          return
        }

        // Fetch upcoming meetings using your API
        const response = await axios.get(`https://expertgo-v1.onrender.com/meet/upcoming-meetings/${expertId}`)
        console.log("meetings : " , response)
        if (response.data && response.data.upcomingCount !== undefined) {
          setUpcomingCalls(response.data.upcomingCount)
          
          // Calculate this week's calls
          const today = new Date()
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay()) // Start of current week (Sunday)
          startOfWeek.setHours(0, 0, 0, 0)
          
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6) // End of week (Saturday)
          endOfWeek.setHours(23, 59, 59, 999)
          
          // Count meetings in current week
          const thisWeekMeetings = response.data.data.filter(meeting => {
            const meetingDate = new Date(meeting.startTime)
            return meetingDate >= startOfWeek && meetingDate <= endOfWeek
          })
          
          setWeekCalls(thisWeekMeetings.length)
          
          // You would need another API endpoint for earnings
          // This is a placeholder
          setEarnings(0)
        }
      } catch (error) {
        console.error('Error fetching expert data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpertData()
  }, [])

  return (
    <View style={styles.expertDashboard}>
      <TouchableOpacity 
        style={styles.dashboardTitle} 
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.titleText}>Expert Dashboard</Text>
      </TouchableOpacity>
      
      <View style={styles.statsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" />
        ) : (
          <>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{upcomingCalls}</Text>
              <Text style={styles.statLabel}>Upcoming Calls</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{weekCalls}</Text>
              <Text style={styles.statLabel}>Missed Meetings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Rs.{earnings}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

export default ExpertDash

const styles = StyleSheet.create({
  expertDashboard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardTitle: {
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 80,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
})