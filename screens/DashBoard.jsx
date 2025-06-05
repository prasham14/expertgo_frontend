import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Image, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { format } from 'date-fns'

const MeetingsDetailScreen = ({ navigation }) => {
  const [meetings, setMeetings] = useState([])
  const [expert, setExpert] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMeetingsData = async () => {
      try {
        setLoading(true)
        const expertId = await AsyncStorage.getItem('userId')
        
        if (!expertId) {
          throw new Error('Expert ID not found')
        }

        const response = await axios.get(`http://10.0.2.2:3000/meet/upcoming-meetings/${expertId}`)
        
        if (response.data && response.data.data) {
          setMeetings(response.data.data)
          setExpert(response.data.expert)
          setUser(response.data.user)
        }
      } catch (err) {
        console.error('Error fetching meetings:', err)
        setError(err.message || 'Failed to fetch meetings')
      } finally {
        setLoading(false)
      }
    }

    fetchMeetingsData()
  }, [])

  const renderMeetingItem = ({ item }) => {
    const startDate = new Date(item.startTime)
    const endDate = new Date(item.endTime)
    
    const formattedDate = format(startDate, 'MMM dd, yyyy')
    const startTime = format(startDate, 'h:mm a')
    const endTime = format(endDate, 'h:mm a')
    
    // Calculate if meeting is happening today
    const today = new Date()
    const isToday = startDate.getDate() === today.getDate() && 
                    startDate.getMonth() === today.getMonth() && 
                    startDate.getFullYear() === today.getFullYear()

    return (
      <View style={styles.meetingCard}>
        <View style={styles.meetingHeader}>
          <Text style={styles.meetingTitle}>{item.title || 'Consultation Meeting'}</Text>
          {isToday && <View style={styles.todayBadge}><Text style={styles.todayText}>Today</Text></View>}
        </View>
        
        <View style={styles.meetingDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{startTime} - {endTime}</Text>
          </View>
          
          {item.meetLink && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Meeting Link:</Text>
              <Text style={styles.meetingLink}>{item.meetLink}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderHeader = () => {
    if (!meetings.length) return null
    
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Upcoming Meetings</Text>
        <Text style={styles.meetingCount}>
          {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} scheduled
        </Text>
      </View>
    )
  }

  const renderUserInfo = () => {
    if (!user) return null
    
    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.userHeader}>
          <Text style={styles.sectionTitle}>Client Information</Text>
        </View>
        <View style={styles.userCard}>
          <View style={styles.userAvatarContainer}>
            {user.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
              </View>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name || 'Client Name'}</Text>
            {user.email && <Text style={styles.userEmail}>{user.email}</Text>}
          </View>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading meetings...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null)
            fetchMeetingsData()
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={meetings}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={renderMeetingItem}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderUserInfo()}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming meetings found</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  )
}

export default MeetingsDetailScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  meetingCount: {
    fontSize: 16,
    color: '#666',
  },
  meetingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  meetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  todayBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  todayText: {
    color: '#0066cc',
    fontWeight: '600',
    fontSize: 12,
  },
  meetingDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  meetingLink: {
    fontSize: 15,
    color: '#0066cc',
    flex: 1,
  },
  description: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  scheduleButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  userHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userAvatarContainer: {
    marginRight: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  }
})