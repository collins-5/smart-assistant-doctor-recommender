// src/components/SearchBar.tsx (create this new file)
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "~/components/ui/icon";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLocationPress: () => void;
  locationLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onLocationPress,
  locationLoading,
}) => {
  return (
    <View className="px-4 py-4  w-full bg-background border-b border-border">
      <View className="flex-row items-center bg-muted rounded-full px-4 py-3">
        <Icon name="magnify" size={20} color="#666" />
        <TextInput
          placeholder="Search by name, specialty, or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="flex-1 ml-3 mr-2 text-foreground text-base"
          placeholderTextColor="#999"
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* Clear button */}
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
        {/* Location Button */}
        <TouchableOpacity
          onPress={onLocationPress}
          disabled={locationLoading}
          className="ml-3"
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color="#0d9488" />
          ) : (
            <Icon name="map-marker-radius-outline" size={24} color="#0d9488" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
