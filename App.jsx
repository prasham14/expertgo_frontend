import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignUp from "./components/SignUp"; 
import Login from "./components/Login";
import Home from "./components/Home";
import ChangePassword from "./components/ChangePassword";
import UserRole from "./components/UserRole";
import Expert from "./components/Expert";
import User from "./components/User";
import Profile from "./components/Profile";
import TandC from "./components/TandC";
import Portfolio from "./components/Portfolio";
import PortfolioScreen from './components/ShowPortfolio'
const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if a user ID exists in AsyncStorage
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          setInitialRoute("Signup");
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
        <Stack.Screen name="UserRole" component={UserRole} options={{ headerShown: false }} />
        <Stack.Screen name="Expert" component={Expert} options={{ headerShown: false }} />
        <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        <Stack.Screen name="TnC" component={TandC} options={{ headerShown: false }} />
        <Stack.Screen name="Portfolio" component={Portfolio} options={{ headerShown: false }} />
        <Stack.Screen name="PortfolioScreen" component={PortfolioScreen} options={{ headerShown: false }} />

      </Stack.Navigator>PortfolioScreen
    </NavigationContainer>
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
