// src/lib/hooks/useCurrentLocation.ts
import { useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export const useCurrentLocation = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getLocation = async () => {
        setIsLoading(true);

        try {
            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "Location permission is required to find nearby doctors."
                );
                return null;
            }

            // Get current position
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Reverse geocode to get approximate location name
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                const locationText = [
                    address.city || address.subregion || address.region ||  "Unknown Area",
                    address.country || "Unknown Country",
                ]
                    .filter(Boolean)
                    .join(", ");

                if (locationText !== "Unknown Area, Unknown Country") {
                    return locationText;
                } else {
                    Alert.alert("Location", "Could not determine your city/county.");
                    return null;
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to get your location. Try again.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { getLocation, isLoading };
};