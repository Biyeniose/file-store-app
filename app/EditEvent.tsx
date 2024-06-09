import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
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

interface Profile {
  id: string;
  username: string;
}

const EditEvent = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [events, setEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

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

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .ilike("username", `%${searchQuery}%`);

    if (error) {
      console.error(error);
    } else {
      setSearchResults(data);
    }
  };

  const handleAddMember = async (profileId: string) => {
    if (selectedEventId) {
      const { data: event, error: fetchError } = await supabase
        .from("events")
        .select("event_members")
        .eq("id", selectedEventId)
        .single();

      if (fetchError) {
        console.error(fetchError);
        return;
      }

      const updatedMembers = event.event_members || [];

      if (updatedMembers.includes(profileId)) {
        Alert.alert("Error", "User has already been added to the event.");
        return;
      }

      updatedMembers.push(profileId);

      const { error: updateError } = await supabase
        .from("events")
        .update({ event_members: updatedMembers })
        .eq("id", selectedEventId);

      if (updateError) {
        console.error(updateError);
      } else {
        setModalVisible(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Events</Text>
      <View style={styles.eventList}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventButton}
            onPress={() => {
              setSelectedEventId(event.id);
              setModalVisible(true);
            }}
          >
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Search Users</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
          <ScrollView style={styles.resultsContainer}>
            {searchResults.map((profile) => (
              <View key={profile.id} style={styles.resultItem}>
                <Text style={styles.resultText}>{profile.username}</Text>
                <TouchableOpacity
                  onPress={() => handleAddMember(profile.id)}
                  style={styles.addButton}
                >
                  <Ionicons name="add" size={20} color={"#000"} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
