import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../provider/AuthProvider";

import { supabase } from "../../config/initSupabase";
import { FileObject } from "@supabase/storage-js";
//import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

import CalendarComponent from "../../components/CalenderComponent";

import DateTimePicker from "@react-native-community/datetimepicker";
import TimeRangePicker from "../../components/TimeRangePicker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigationTypes";

const list = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [files, setFiles] = useState<FileObject[]>([]);
  //const [date, setDate] = useState(new Date());
  const [username, setUsername] = useState("");
  //const [range, setRange] = useState({});
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState(dayjs());
  const formattedDate = dayjs("2024-06-10");
  //const [value, onChange] = useState<Value>([new Date(), new Date()]);

  // Format the date to a string in 'DD/MM/YYYY' format
  const date_1 = formattedDate.format("DD/MM/YYYY");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Load user images
    get_user_name();
    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from("files").list(user!.id);
    if (data) {
      setFiles(data);
    }
  };

  const get_user_name = async () => {
    const user = supabase.auth.getUser();
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", (await user).data.user?.id);

    if (data) {
      setUsername(data[0]?.username ?? "Temp");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.defaultText}>Hi user</Text>
      <Text style={styles.usernameText}>Username : {username} </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BusyTimes")}
      >
        <Text style={styles.buttonText}>Edit Busy Times</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddEvent")}
      >
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditEvent")}
      >
        <Text style={styles.buttonText}>Edit Event</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("OptimizePage")}
      >
        <Text style={styles.buttonText}>Schedule Optimizer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#151515",
    alignItems: "center",
  },
  fab: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: "#2b825b",
    borderRadius: 100,
  },
  defaultText: {
    color: "#fff",
  },
  usernameText: {
    color: "lightgreen",
  },
  button: {
    backgroundColor: "#2b825b",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
});

export default list;
