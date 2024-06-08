// SecureStore helps us persist actual session of a user
import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

// Use a custom secure storage solution for the Supabase client to store the JWT
// Adapter Manager to get/set/remove items
// pass this to initialization of Supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Initialize the Supabase client uses SecureStore for Storage
export const supabase = createClient(url!, key!, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    detectSessionInUrl: false,
  },
});
