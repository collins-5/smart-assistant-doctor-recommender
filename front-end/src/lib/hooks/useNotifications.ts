// src/lib/hooks/useNotifications.ts
import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useSessionStore } from '~/lib/store/auth';

export const ON_NEW_NOTIFICATION = gql`
  subscription OnNewNotification($patientId: Int!, $jwtToken: String!) {
    retrieveNewNotifications(patientId: $patientId, jwtToken: $jwtToken) {
      id
      title
      description
      createdAt
      isRead
    }
  }
`;

export type Notification = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    isRead: boolean;
};

type UseNotificationsResult = {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error?: any;
};

export const useNotifications = (patientId: number | null): UseNotificationsResult => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const jwt = useSessionStore((s) => s.session?.jwt);

    console.log('🔌 [useNotifications] Hook initialized');
    console.log('   Patient ID:', patientId);
    console.log('   JWT available:', !!jwt);
    console.log('   Subscription skipped:', !patientId || !jwt);

    const { data, loading, error } = useSubscription(ON_NEW_NOTIFICATION, {
        variables: {
            patientId,
            jwtToken: jwt || '',
        },
        skip: !patientId || !jwt,
        onError: (err) => {
            console.error('❌ [useNotifications] Subscription error:', err);
        },
        onSubscriptionData: ({ subscriptionData }) => {
            console.log('📬 [useNotifications] Raw subscription data received:', subscriptionData);
        },
    });

    useEffect(() => {
        if (data?.retrieveNewNotifications) {
            const newNotif: Notification = data.retrieveNewNotifications;

            console.log('🔔 [useNotifications] New notification received!');
            console.log('   ID:', newNotif.id);
            console.log('   Title:', newNotif.title);
            console.log('   Description:', newNotif.description);
            console.log('   Created At:', newNotif.createdAt);
            console.log('   Is Read:', newNotif.isRead);

            setNotifications((prev) => {
                const alreadyExists = prev.some((n) => n.id === newNotif.id);
                if (alreadyExists) {
                    console.log('⚠️ [useNotifications] Duplicate notification ignored (ID:', newNotif.id, ')');
                    return prev;
                }

                console.log('✅ [useNotifications] Adding new notification to list');
                return [newNotif, ...prev];
            });
        }
    }, [data]);

    // Log loading & error states
    useEffect(() => {
        if (loading) {
            console.log('⏳ [useNotifications] Subscription is connecting...');
        }
    }, [loading]);

    if (error) {
        console.error('🚨 [useNotifications] Subscription error state:', error);
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    console.log(`📊 [useNotifications] Current state → Notifications: ${notifications.length}, Unread: ${unreadCount}`);

    return {
        notifications,
        unreadCount,
        loading,
        error,
    };
};