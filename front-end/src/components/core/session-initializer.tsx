// src/components/core/session-initializer.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useVerifyTokenMutation } from "~/lib/graphql/generated/graphql";
import { useSessionStore } from "~/lib/store/auth";
import { useConnectivityStore } from "~/lib/store/offline";

const SessionInitContext = createContext<{ loading: boolean }>({
  loading: true,
});
export const useSessionInit = () => useContext(SessionInitContext);

const SessionInitializer = ({ children }: { children: React.ReactNode }) => {
  const { session, clearSession } = useSessionStore();
  const { isOffline } = useConnectivityStore();
  const [verifyToken] = useVerifyTokenMutation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!session?.jwt) {
        setLoading(false);
        return;
      }

      console.log("SessionInit: Verifying token for", session.email);

      try {
        // THIS IS THE FINAL FIX — PASS TOKEN MANUALLY
        const result = await verifyToken({
          variables: { token: session.jwt }, // ← Direct token
          context: {
            headers: {
              Authorization: `Bearer ${session.jwt}`, // ← Force header
            },
          },
        });

        if (result.data?.verifyToken?.payload) {
          console.log("SUCCESS: Token verified! Welcome back");
        } else {
          console.warn("Token invalid");
          !isOffline && clearSession();
        }
      } catch (err: any) {
        console.error("JWT verification failed:", err.message || err);
        if (!isOffline) clearSession();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [session?.jwt, verifyToken, clearSession, isOffline]);

  return (
    <SessionInitContext.Provider value={{ loading }}>
      {children}
    </SessionInitContext.Provider>
  );
};

export default SessionInitializer;
