// app/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./index";
import SignUp from "./SignUp";
import List from "./(auth)/list";
import Settings from "./Settings";
import AddEvent from "./AddEvent";
import BusyTimes from "./BusyTimes";
import EditEvent from "./EditEvent";
import OptimizePage from "./OptimizePage";
import EventDetailPage from "./EventDetailPage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="AddEvent" component={AddEvent} />
        <Stack.Screen name="BusyTimes" component={BusyTimes} />
        <Stack.Screen name="EditEvent" component={EditEvent} />
        <Stack.Screen name="OptimizePage" component={OptimizePage} />
        <Stack.Screen name="EventDetailPage" component={EventDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
