import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from 'react-redux';
import { store } from "./store/index";
import { UserProvider } from "./context/Context";
import GoogleSignupScreen from './screens/GoogleSignIn';
import { requestPermissionAndroid, setupNotificationListeners } from "./MainTabs/Service";
import { MainTabs } from "./MainTabs/Main";
import { ExpertMainTabs } from "./MainTabs/ExpertMain";
import Profile from "./screens/Profile";
import Notifications from "./screens/Notifications";
import Search from "./screens/Search";
import ChangePassword from "./screens/ChangePassword";
import TandC from "./components/TandC";
import Portfolio from "./screens/Portfolio";
import PortfolioScreen from "./screens/ShowPortfolio";
import EditPortfolio from "./screens/EditPortfolio";
import CreateMeetingScreen from "./screens/MeetingScreen";
import ChatScreen from "./screens/Chat";
import ConversationsListScreen from "./screens/ConversationList";
import ContactsScreen from "./screens/ContactUsers";
import DashBoard from "./screens/DashBoard";
import CancelTnC from "./screens/CancelTnC";
import BankDetailsScreen from "./screens/AddBankDetails";
import BankTerms from "./screens/BankTnc";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestPermissionAndroid();
    setupNotificationListeners();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const userRole = await AsyncStorage.getItem("userRole");
        if (userId && userRole === 'user') {
          setInitialRoute("MainTabs");
        } else if (userId && userRole === 'expert') {
          setInitialRoute("ExpertMainTabs");
        } else {
          setInitialRoute("Google");
        }
      } catch (error) {
        console.error("Error checking login status", error);
        setInitialRoute("Google");
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

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
        <SafeAreaProvider>
<StatusBar barStyle="dark-content" backgroundColor="white" translucent={false} />

          <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen name="ExpertMainTabs" component={ExpertMainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
              <Stack.Screen name="Notifications" component={Notifications} />
              <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
              <Stack.Screen name="TnC" component={TandC} options={{ headerShown: false }} />
              <Stack.Screen name="Portfolio" component={Portfolio} options={{ headerShown: false }} />
              <Stack.Screen name="PortfolioScreen" component={PortfolioScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Conversations" component={ConversationsListScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Contacts" component={ContactsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EditPortfolio" component={EditPortfolio} />
              <Stack.Screen name="Dashboard" component={DashBoard} options={{ headerShown: false }} />
              <Stack.Screen name="CancelTnC" component={CancelTnC} />
              <Stack.Screen name="Bank-details" component={BankDetailsScreen} />
              <Stack.Screen name="BankTerms" component={BankTerms} />
              <Stack.Screen name="Meet" component={CreateMeetingScreen} />
              <Stack.Screen name="Google" component={GoogleSignupScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
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
