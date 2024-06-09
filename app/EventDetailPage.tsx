import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "./navigationTypes";
import { supabase } from "../config/initSupabase";
import optimizeFunc from "../utils/optimizeFunc";
import moment from "moment";

type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetailPage">;
type DateRange = [string, string, string];

const EventDetailPage = () => {
  const navigation = useNavigation();
  const route = useRoute<EventDetailRouteProp>();
  const { eventId, eventName } = route.params;

  const [tempDateStart, setTempDateStart] = useState<string | null>(null);
  const [tempDateEnd, setTempDateEnd] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [eventLength, setEventLength] = useState<number | null>(null);
  const [results, setResults] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("temp_date_start, temp_date_end, event_members, length")
        .eq("id", eventId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setTempDateStart(data.temp_date_start);
        setTempDateEnd(data.temp_date_end);
        setEventLength(data.length);

        // Fetch usernames for event members
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .in("id", data.event_members);

        if (profileError) {
          console.error(profileError);
        } else {
          setUsernames(profiles.map((profile) => profile.username));
        }
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleOptimizeSchedule = async () => {
    try {
      // Fetch busy times for event members
      const { data: event, error: eventError } = await supabase
        .from("events")
        .select("event_members")
        .eq("id", eventId)
        .single();

      if (eventError) {
        throw new Error(eventError.message);
      }

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("busy_times")
        .in("id", event.event_members);

      if (profileError) {
        throw new Error(profileError.message);
      }

      const busyTimes: DateRange[] = [];
      profiles.forEach((profile) => {
        busyTimes.push(...profile.busy_times);
      });

      // Call the optimize function
      if (tempDateStart && tempDateEnd && eventLength !== null) {
        const optimizedResults = optimizeFunc(
          tempDateStart,
          tempDateEnd,
          eventLength,
          busyTimes
        );
        setResults(optimizedResults);

        const blockedTimes = [
          "23:00:00",
          "00:00:00",
          "01:00:00",
          "02:00:00",
          "03:00:00",
          "04:00:00",
          "05:00:00",
          "06:00:00",
          "07:00:00",
        ];
        const finalAnswers: { start: string; end: string }[] = [];

        optimizedResults.forEach((block) => {
          const blockStart = block.start.split(" ")[1];
          const blockEnd = block.end.split(" ")[1];

          if (
            blockedTimes.includes(blockStart) ||
            blockedTimes.includes(blockEnd)
          ) {
            return;
          }

          finalAnswers.push(block);
        });

        setResults(finalAnswers);
      } else {
        Alert.alert("Error", "Event details are incomplete.");
      }
    } catch (error) {
      Alert.alert("Error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Event Details</Text>
      <Text style={styles.eventText}>ID: {eventId}</Text>
      <Text style={styles.eventText}>Name: {eventName}</Text>
      {eventLength !== null && (
        <Text style={styles.eventText}>Length: {eventLength}</Text>
      )}
      {tempDateStart && tempDateEnd && (
        <Text style={styles.eventText}>
          Suggested Event Dates: {tempDateStart} and {tempDateEnd}
        </Text>
      )}

      <Text style={styles.subHeader}>Event Members:</Text>
      <View style={styles.membersList}>
        {usernames.map((username, index) => (
          <Text key={index} style={styles.memberText}>
            {username}
          </Text>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleOptimizeSchedule}
        style={styles.optimizeButton}
      >
        <Text style={styles.buttonText}>Optimize Schedule</Text>
      </TouchableOpacity>

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>Optimized Time Slots:</Text>
          {results.map((result, index) => {
            const startMoment = moment(result.start);
            const startDate = startMoment.format("YYYY-MM-DD");
            const startTime = startMoment.format("HH:mm:ss");
            const endTime = moment(result.end).format("HH:mm:ss");
            const dayOfWeek = startMoment.format("dddd");
            return (
              <Text key={index} style={styles.resultText}>
                {dayOfWeek}, {startDate} {startTime} - {endTime}
              </Text>
            );
          })}
        </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        <Ionicons name="arrow-back" size={30} color={"#fff"} />
        <Text style={styles.buttonText}>Back to OptimizePage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
    color: "#fff",
  },
  eventText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 24,
    color: "#fff",
    marginVertical: 10,
  },
  membersList: {
    width: "100%",
    marginVertical: 10,
  },
  memberText: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 5,
    paddingLeft: 20,
  },
  optimizeButton: {
    width: "90%",
    padding: 12,
    backgroundColor: "#2b825b",
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 10,
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
  resultsContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
  },
  resultsHeader: {
    fontSize: 20,
    color: "#000",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    color: "#000",
    marginVertical: 5,
  },
});

export default EventDetailPage;
