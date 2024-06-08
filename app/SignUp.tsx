// app/SignUp.tsx
import {
  Alert,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "../config/initSupabase";
import { useNavigation } from "@react-navigation/native";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onSignUpPress = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (!error) {
      const user = supabase.auth.getUser();
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: (await user).data.user?.id,
          username,
          full_name: fullName,
          last_name: lastName,
        })
        .select();

      if (updateError) Alert.alert(updateError.message);
    } else {
      Alert.alert(error.message);
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Spinner visible={loading} />

        <Text style={styles.header}>Create Account</Text>

        <TextInput
          autoCapitalize="none"
          placeholder="john@doe.com"
          value={email}
          onChangeText={setEmail}
          style={styles.inputField}
        />
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputField}
        />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.inputField}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.inputField}
        />

        <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
          <Text style={{ color: "#fff" }}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Text style={{ color: "#fff" }}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 200,
    padding: 20,
    backgroundColor: "#151515",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    margin: 50,
    color: "#fff",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#2b825b",
    borderRadius: 4,
    padding: 10,
    color: "#fff",
    backgroundColor: "#363636",
  },
  button: {
    marginVertical: 15,
    alignItems: "center",
    backgroundColor: "#2b825b",
    padding: 12,
    borderRadius: 4,
  },
});

export default SignUp;
