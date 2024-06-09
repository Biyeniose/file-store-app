import { Stack } from "expo-router";
import { useAuth } from "../../provider/AuthProvider";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationProp } from "@react-navigation/core";
import { RootStackParamList } from "../navigationTypes";

// Simple stack layout within the authenticated area
const StackLayout = () => {
  const { signOut, session } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f0f0f",
        },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="list"
        redirect={!session}
        options={{
          headerTitle: "My Files",
          headerLeft: () => (
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={30} color={"#fff"} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <Ionicons name="settings" size={30} color={"#fff"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default StackLayout;
