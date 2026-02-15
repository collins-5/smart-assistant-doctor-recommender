import { useState, useCallback, useEffect } from "react";
import { useAIChatMessages, useSendAIChatMessage } from "./useAIChatMessages";
import { SYSTEM_PROMPT } from "./ai-prompt";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing from .env!");
}

export type ChatMessage = {
    id: string;
    text: string;
    isBot: boolean;
    createdAt: Date;
};

const WELCOME_MESSAGE: ChatMessage = {
    id: "greeting-1",
    text:
        "Hi! I'm your Health Assistant.\n\nHow are you feeling today? Please describe any symptoms you're experiencing, and I'll help guide you with general information.\n\nRemember: I'm not a doctor — this is for informational purposes only.",
    isBot: true,
    createdAt: new Date(),
};

export const useAIAssistant = () => {
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const { messages: backendMessages, loading: loadingHistory, refetch } = useAIChatMessages();
    const { sendMessage: saveMessageToBackend } = useSendAIChatMessage();

    // Sync backend messages → local messages
    useEffect(() => {
        if (backendMessages.length > 0) {
            const formatted = backendMessages.map((msg: any) => ({
                id: msg.id.toString(),
                text: msg.text,
                isBot: !msg.isFromUser,
                createdAt: new Date(msg.createdAt),
            }));
            setMessages(formatted);
        } else if (!loadingHistory) {
            setMessages([WELCOME_MESSAGE]);
        }
    }, [backendMessages, loadingHistory]);

    const sendMessage = useCallback(
        async (userText: string) => {
            if (!userText.trim()) return;

            const trimmedText = userText.trim();
            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                text: trimmedText,
                isBot: false,
                createdAt: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setInputText("");
            setIsLoading(true);

            try {
                await saveMessageToBackend(trimmedText, true);

                const contents = [
                    { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
                    ...messages.flatMap((msg) => [
                        { role: msg.isBot ? "model" : "user", parts: [{ text: msg.text }] },
                    ]),
                    { role: "user", parts: [{ text: trimmedText }] },
                ];

                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents,
                            generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
                        }),
                    }
                );

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Gemini API error: ${res.status} — ${errorText}`);
                }

                const data = await res.json();
                let botText =
                    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
                    "I'm having trouble responding right now. Please try again.";

                // === TOOL INTERCEPTION ===
                let processedText = botText;
                if (processedText.includes("[TOOL:SHOW_DOCTORS]")) {
                processedText = processedText.replace(
                        /\[TOOL:SHOW_DOCTORS\](.*?)\[\/TOOL\]/s,
                    "$1\n\n<DOCTORS_LIST/>"
                );
                }
                if (processedText.includes("[TOOL:SHOW_SPECIALTIES]")) {
                processedText = processedText.replace(
                        /\[TOOL:SHOW_SPECIALTIES\](.*?)\[\/TOOL\]/s,
                    "$1\n\n<SPECIALTIES_LIST/>"
                );
                }
                // if (processedText.includes("[TOOL:BOOK_APPOINTMENT]")) {
                //     processedText = processedText.replace(
                //         /\[TOOL:BOOK_APPOINTMENT\](.*?)\[\/TOOL\]/s,
                //         "$1\n\n<BOOK_APPOINTMENT_BUTTON/>"
                //     );
                // }

                const aiMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: processedText,
                    isBot: true,
                    createdAt: new Date(),
                };

                setMessages((prev) => [...prev, aiMessage]);
                await saveMessageToBackend(processedText, false);
            } catch (error: any) {
                console.error("AI Assistant Error:", error);
                const errorMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: "Sorry, I'm having trouble connecting. Please try again.",
                    isBot: true,
                    createdAt: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [messages, saveMessageToBackend]
    );

    const refreshChat = useCallback(() => refetch(), [refetch]);

    return {
        messages,
        inputText,
        setInputText,
        isLoading,
        loadingHistory,
        sendMessage,
        refreshChat,
    };
};