import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contexts/AuthContext";
import { RootStack } from "./src/navigation/RootStack";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* <AuthProvider> */}
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootStack />
      </NavigationContainer>
      {/* </AuthProvider> */}
    </SafeAreaProvider>
  );
}
