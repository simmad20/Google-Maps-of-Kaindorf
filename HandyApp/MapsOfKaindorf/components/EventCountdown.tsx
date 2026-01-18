// components/EventCountdown.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useEvent } from '@/components/context/EventContext';

interface CountdownProps {
    compact?: boolean;
}

export default function EventCountdown({ compact = false }: CountdownProps) {
    const { activeEvent } = useEvent();
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (!activeEvent?.endDateTime) return;

        const calculateTimeLeft = () => {
            const end = new Date(activeEvent.endDateTime!).getTime();
            const now = new Date().getTime();
            const difference = end - now;

            if (difference <= 0) {
                return 'Event beendet';
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if (compact) {
                if (days > 0) return `${days}d ${hours}h`;
                return `${hours}h ${minutes}m`;
            }

            if (days > 0) return `${days} Tage ${hours} Stunden`;
            return `${hours} Std ${minutes} Min ${seconds} Sek`;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [activeEvent]);

    if (!activeEvent?.endDateTime) return null;

    return (
        <View style={[styles.container, compact && styles.compact]}>
            <ThemedText style={[styles.label, compact && styles.compactLabel]}>
                {compact ? 'Endet in: ' : 'Event endet in: '}
            </ThemedText>
            <ThemedText style={[styles.time, compact && styles.compactTime, { color: activeEvent.themeColor }]}>
                {timeLeft}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginVertical: 8,
    },
    compact: {
        padding: 8,
        marginVertical: 4,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginRight: 6,
    },
    compactLabel: {
        fontSize: 12,
    },
    time: {
        fontSize: 16,
        fontWeight: '700',
    },
    compactTime: {
        fontSize: 14,
    },
});