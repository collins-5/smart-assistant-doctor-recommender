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

    const { data, loading, error } = useSubscription(ON_NEW_NOTIFICATION, {
        variables: {
            patientId,
            jwtToken: jwt || '',
        },
        skip: !patientId || !jwt,
        onError: (err) => {
            console.warn('Notification subscription error:', err);
        },
    });

    useEffect(() => {
        if (data?.retrieveNewNotifications) {
            const newNotif: Notification = data.retrieveNewNotifications;

            setNotifications((prev) => {
                if (prev.some((n) => n.id === newNotif.id)) {
                    return prev;
                }
                return [newNotif, ...prev];
            });
        }
    }, [data]);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        notifications,
        unreadCount,
        loading,
        error,
    };
};