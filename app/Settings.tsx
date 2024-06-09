// app/Settings.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/core";
import { RootStackParamList } from "./navigationTypes";

const Settings = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        <Ionicons name="arrow-back" size={30} color={"#fff"} />
        <Text style={styles.buttonText}>Back to List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 50,
    color: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});

export default Settings;
