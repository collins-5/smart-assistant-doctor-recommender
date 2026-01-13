// src/components/chat/MessageBubble.tsx

import React from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";
import { format, isToday, isYesterday } from "date-fns";
import { Platform } from "react-native";

import DoctorsCarousel from "./doctors-carousel";
import SpecialtiesGrid from "./specialties-grid";
import BookAppointmentButton from "./BookAppointmentButton";

interface MessageBubbleProps {
  text: string;
  isBot: boolean;
  createdAt: Date;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isBot,
  createdAt,
}) => {
  const hasDoctors = text.includes("<DOCTORS_LIST/>");
  const hasSpecialties = text.includes("<SPECIALTIES_LIST/>");
  const hasBookButton = text.includes("<BOOK_APPOINTMENT_BUTTON/>");
  const hasAnyCard = hasDoctors || hasSpecialties || hasBookButton;

  const cleanText = text
    .replace(/<DOCTORS_LIST\/>/g, "")
    .replace(/<SPECIALTIES_LIST\/>/g, "")
    .replace(/<BOOK_APPOINTMENT_BUTTON\/>/g, "")
    .trim();

  // Format timestamp based on date
  const formatTimestamp = () => {
    if (isToday(createdAt)) {
      return format(createdAt, "h:mm a");
    } else if (isYesterday(createdAt)) {
      return format(createdAt, "'Yesterday', h:mm a");
    } else {
      return format(createdAt, "dd MMM, h:mm a");
    }
  };

  return (
    <View
      className={`
        my-2
        ${hasAnyCard ? "w-full px-4" : "max-w-[85%] mx-6"}
        ${isBot ? "items-start" : "items-end"}
      `}
    >
      <View
        className={`
          ${hasAnyCard ? "w-full" : "max-w-full"}
          rounded-2xl px-3 py-3
          ${isBot ? "bg-muted rounded-bl-none" : "bg-green-100 rounded-br-none"}
        `}
      >
        {cleanText && (
          <Markdown
            style={{
              body: {
                fontSize: 15,
                lineHeight: 22,
                color: isBot ? "#164e63" : "#166534",
              },
              paragraph: { marginTop: 0, marginBottom: 8 },
              strong: { fontWeight: "700" },
              em: { fontStyle: "italic" },
              heading1: { fontSize: 22, fontWeight: "700", marginVertical: 8 },
              heading2: { fontSize: 20, fontWeight: "600", marginVertical: 6 },
              code_inline: {
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 4,
                fontSize: 14,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                backgroundColor: "#f3f4f6",
              },
            }}
          >
            {cleanText}
          </Markdown>
        )}

        {hasDoctors && (
          <View className="mt-4">
            <DoctorsCarousel />
          </View>
        )}

        {hasSpecialties && (
          <View className="mt-4 -mx-4">
            <SpecialtiesGrid />
          </View>
        )}

        {hasBookButton && (
          <View className="mt-4">
            <BookAppointmentButton />
          </View>
        )}

        <Text className="text-xs text-gray-500 mt-3 text-right">
          {formatTimestamp()}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
