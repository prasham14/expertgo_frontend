import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, PermissionsAndroid, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { Provider } from 'react-redux'; // Import Redux Provider
import {store} from "./store/index";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Home from "./components/Home";
import ChangePassword from "./components/ChangePassword";
import Expert from "./components/Expert";
import Profile from "./components/Profile";
import TandC from "./components/TandC";
import Portfolio from "./components/Portfolio";
import PortfolioScreen from "./components/ShowPortfolio";
import VideoCall from "./components/Booking";
import Notifications from "./components/Notifications";
import Payment from "./components/Payment";
import Meetings from "./components/Meetings";
import Transactions from "./components/Transactions";
import Ionicons from "react-native-vector-icons/Ionicons";
import Search from "./components/Search";
import VC from "./components/VC";
import Chat from './components/Chat';
import { UserProvider } from "./components/Context";
import AskAnExpert from "./components/AskAnExpert";
import EditPortfolio from "./components/EditPortfolio";

// Create navigation objects
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define MainTabs component
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Ask") {
            iconName = "question-outline";
          }
          else if (route.name === "Meetings") {
            iconName = "calendar-outline";
          } else if (route.name === "Transactions") {
            iconName = "cash-outline";
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Meetings" component={Meetings} />
      <Tab.Screen name="Transactions" component={Transactions} />
      <Tab.Screen name="Ask" component={AskAnExpert} />
    </Tab.Navigator>
  );
};

// The main App component
const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestPermissionAndroid();
  }, []);

  const requestPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getToken();
    } else {
      Alert.alert("Permission denied");
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  const onDisplayNotification = async (remoteMessage) => {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        smallIcon: "ic_launcher",
        pressAction: { id: "default" },
      },
    });
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setInitialRoute("MainTabs");
        } else {
          setInitialRoute("Signup");
        }
      } catch (error) {
        console.error("Error checking login status", error);
        setInitialRoute("Signup");
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const getToken = async () => {
    const token = await messaging().getToken();
    console.warn("token", token);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
            <Stack.Screen name="Expert" component={Expert} options={{ headerShown: false }} />
            <Stack.Screen name="TnC" component={TandC} options={{ headerShown: false }} />
            <Stack.Screen name="Portfolio" component={Portfolio} options={{ headerShown: false }} />
            <Stack.Screen name="PortfolioScreen" component={PortfolioScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VideoCall" component={VideoCall} options={{ headerShown: false }} />
            <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
            <Stack.Screen name="Video" component={VC} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="EditPortfolio" component={EditPortfolio} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;