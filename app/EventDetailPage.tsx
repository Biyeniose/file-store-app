import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "./navigationTypes";

const EditEvent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Events</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 50,
    color: "#fff",
  },
  eventList: {
    width: "100%",
    alignItems: "center",
  },
  eventButton: {
    width: "90%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#2b825b",
    borderRadius: 4,
    alignItems: "center",
  },
  eventText: {
    color: "#fff",
    fontSize: 18,
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalHeader: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  searchInput: {
    width: "80%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 4,
    marginBottom: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#2b825b",
    borderRadius: 4,
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  resultsContainer: {
    width: "100%",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2b825b",
    borderRadius: 4,
    marginBottom: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 18,
  },
  addButton: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#2b825b",
    borderRadius: 4,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default EditEvent;
