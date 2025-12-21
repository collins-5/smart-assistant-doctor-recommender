
import { useState, useCallback } from "react";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Optional safety check
if (!GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is missing from .env!');
}

const SYSTEM_PROMPT = `
You are a friendly, professional Health Assistant in a telemedicine app.
Your role is to:
- Listen empathetically to the user's symptoms
- Ask clarifying questions when needed
- Provide general, non-diagnostic information
- Suggest safe home care tips
- Always recommend consulting a doctor for serious or persistent symptoms
- Offer to help book an appointment

RULES:
- NEVER diagnose conditions
- NEVER prescribe medication
- NEVER give urgent medical advice without directing to emergency services
- Always include: "I'm not a doctor — this is general information only."
- Use simple, warm, and clear language
- Keep responses concise and easy to read on mobile

When appropriate, ask: "Would you like help booking an appointment?"
`;

export type ChatMessage = {
    id: string;
    text: string;
    isBot: boolean;
    createdAt: Date;
};

export const useAIAssistant = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(() => [
        {
            id: "greeting-1",
            text: "Hi! I'm your Health Assistant. 👋\n\nHow are you feeling today? Please describe any symptoms you're experiencing, and I'll help guide you with general information.\n\nRemember: I'm not a doctor — this is for informational purposes only.",
            isBot: true,
            createdAt: new Date(),
        },
    ]);

    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(
        async (userText: string) => {
            if (!userText.trim()) return;

            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                text: userText.trim(),
                isBot: false,
                createdAt: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setInputText("");
            setIsLoading(true);

            try {
                const contents = [
                    { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
                    ...messages.flatMap((msg) => [
                        { role: msg.isBot ? "model" : "user", parts: [{ text: msg.text }] },
                    ]),
                    { role: "user", parts: [{ text: userText }] },
                ];

                const res = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents,
                            generationConfig: {
                                temperature: 0.7,
                                maxOutputTokens: 800,
                            },
                        }),
                    }
                );

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Gemini API error: ${res.status} – ${errorText}`);
                }

                const data = await res.json();
                const botText =
                    data.candidates?.[0]?.content?.parts?.[0]?.text ||
                    "I'm having trouble responding right now. Please try again.";

                const botMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: botText.trim(),
                    isBot: true,
                    createdAt: new Date(),
                };

                setMessages((prev) => [...prev, botMessage]);
            } catch (error: any) {
                console.error("AI Assistant Error:", error);

                const errorMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: "Sorry, I'm having connection issues. Please try again in a moment.",
                    isBot: true,
                    createdAt: new Date(),
                };

                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [messages] 
    );

    return {
        messages,
        inputText,
        setInputText,
        isLoading,
        sendMessage,
    };
};