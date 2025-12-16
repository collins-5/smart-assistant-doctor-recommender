import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderSafeAreaView from "~/components/core/header-safe-area-view";
import { StatusBar } from "react-native";
import ThemeStatusBar from "~/components/core/status-bar";
import Icon from "~/components/ui/icon";

export default function TabsLayout() {
  return (
    <>
      <ThemeStatusBar />
      <HeaderSafeAreaView />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#rgb(14, 103, 126)",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: { backgroundColor: "#fff" },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="doctors"
          options={{
            tabBarLabel: "Doctors",
            tabBarIcon: ({ color, size }) => (
              <Icon name="doctor" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarked"
          options={{
            title: "Bookmarks",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appointments",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarLabel: "Notifications",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="musical-notes-sharp" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
