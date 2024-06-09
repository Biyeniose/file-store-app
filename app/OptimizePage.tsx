import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/core";
import { RootStackParamList } from "./navigationTypes";
import { useAuth } from "../provider/AuthProvider";
import { supabase } from "../config/initSupabase";

interface Event {
  id: string;
  event_name: string;
  event_members: string[];
}

const OptimizePage = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("events")
          .select("id, event_name, event_members")
          .eq("creator_id", user.id);

        if (error) {
          console.error(error);
        } else {
          setEvents(data);
        }
      }
    };

    fetchEvents();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Optimize Schedules</Text>
      <View style={styles.eventList}>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventButton}>
            <Text style={styles.eventText}>
              {event.id}: {event.event_name}
            </Text>
          </TouchableOpacity>
        ))}
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
});

export default OptimizePage;
