import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ExpertDash = () => {
  return (
 <View style={homeStyles.expertDashboard}>
                <Text style={homeStyles.dashboardTitle}>Expert Dashboard</Text>
                <View style={homeStyles.statsContainer}>
                  <View style={homeStyles.statCard}>
                    <Text style={homeStyles.statValue}>0</Text>
                    <Text style={homeStyles.statLabel}>Upcoming Calls</Text>
                  </View>
                  <View style={homeStyles.statCard}>
                    <Text style={homeStyles.statValue}>0</Text>
                    <Text style={homeStyles.statLabel}>This Week</Text>
                  </View>
                  <View style={homeStyles.statCard}>
                    <Text style={homeStyles.statValue}>$0</Text>
                    <Text style={homeStyles.statLabel}>Earnings</Text>
                  </View>
                </View> 
        </View>

  )
}

export default ExpertDash

const styles = StyleSheet.create({})