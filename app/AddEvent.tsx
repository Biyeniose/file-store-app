import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/core";
import { RootStackParamList } from "./navigationTypes";
import { useAuth } from "../provider/AuthProvider";
import { ScrollView } from "react-native";
import { supabase } from "../config/initSupabase";

import CalendarComponent from "../components/CalenderComponent";

const AddEvent = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [eventName, setEventName] = useState<string>("");
  const [numberOfHours, setNumberOfHours] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    // Load user images
  }, [user]);

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const createEvent = async () => {
    const user = supabase.auth.getUser();
    const { error } = await supabase.from("events").insert({
      creator_id: (await user).data.user?.id, // USER ID
      event_name: eventName,
      length: numberOfHours,
      temp_date_start: startDate,
      temp_date_end: endDate,
    });
    //.select() // select ALL
    //.eq("id", (await user).data.user?.id); // this is the id

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Event Added");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Add Event Times</Text>

        <TextInput
          style={styles.input}
          placeholder="Event Name"
          placeholderTextColor="#ccc"
          value={eventName}
          onChangeText={setEventName}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of hours"
          placeholderTextColor="#ccc"
          value={numberOfHours}
          onChangeText={setNumberOfHours}
          keyboardType="numeric"
        />
        <View style={styles.cal}>
          <CalendarComponent onDateChange={handleDateChange} />
        </View>
        <Text style={styles.dateText}>
          Start Date: {startDate ? startDate.toDateString() : "None"}
        </Text>
        <Text style={styles.dateText}>
          End Date: {endDate ? endDate.toDateString() : "None"}
        </Text>

        <TouchableOpacity onPress={() => createEvent()} style={styles.button}>
          <Ionicons name="calendar-number" size={30} color={"#fff"} />
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Ionicons name="arrow-back" size={30} color={"#fff"} />
          <Text style={styles.buttonText}>Back to HomePage</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 45,
    color: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
    backgroundColor: "#F29727",
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  cal: {
    marginTop: 15,
    padding: 20,
    paddingLeft: 10,
    paddingRight: 25,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    width: "104%",
  },
  dateText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginTop: 10,
    color: "#000",
  },
});

export default AddEvent;
