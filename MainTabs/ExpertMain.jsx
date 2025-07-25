import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/Ionicons';
import {UserProvider} from '../context/Context';
import Home from '../screens/Home';
import Meetings from '../bottom_tabs/ExpertMeetings';
import Transactions from '../bottom_tabs/Transactions';
import AskAnExpert from '../bottom_tabs/AskAnExpert';
// import Home from '../bottom_tabs/icons/Home';
import { StatusBar } from 'react-native';
const Tab = createBottomTabNavigator();

export const ExpertMainTabs = () => {
  return (
    <UserProvider>
      {' '}

      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Ask') {
              iconName = 'man-outline';
            } else if (route.name === 'Meetings') {
              iconName = 'calendar-clear-outline';
            } else if (route.name === 'Transactions') {
              iconName = 'cash-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: true,
          headerShown: false,
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Meetings" component={Meetings} />
        <Tab.Screen name="Transactions" component={Transactions} />
        <Tab.Screen name="Ask" component={AskAnExpert} />
      </Tab.Navigator>
    </UserProvider>
  );
};
