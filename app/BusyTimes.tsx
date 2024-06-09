import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/core";
import { RootStackParamList } from "./navigationTypes";
import { useAuth } from "../provider/AuthProvider";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../config/initSupabase";

const BusyTimes = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [myTimeString, setMyTimeString] = useState<Date>(new Date());
  const [timeString, setTimeString] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const [myDate, setMyDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState<string>(
    new Date().toDateString()
  );

  const [myTimeString2, setMyTimeString2] = useState<Date>(new Date());
  const [timeString2, setTimeString2] = useState<string>(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  const onChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setMyDate(selectedDate);
      setDateString(selectedDate.toDateString());
    }
  };

  const onChange2 = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setMyTimeString(selectedDate);
      setTimeString(
        selectedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  const onChange3 = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setMyTimeString2(selectedDate);
      setTimeString2(
        selectedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Busy Times</Text>
      <View style={styles.time}>
        <DateTimePicker
          value={myDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
        <Text>{dateString}</Text>

        <DateTimePicker value={myTimeString} mode="time" onChange={onChange2} />
        <Text>{timeString}</Text>

        <DateTimePicker
          value={myTimeString2}
          mode="time"
          onChange={onChange3}
        />
        <Text>{timeString2}</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        <Ionicons name="arrow-back" size={30} color={"#fff"} />
        <Text style={styles.buttonText}>Back to HomePage</Text>
      </TouchableOpacity>
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
  time: {
    alignItems: "center",
    backgroundColor: "white",
    color: "orange",
    padding: 10,
    borderRadius: 10,
  },
});

export default BusyTimes;
