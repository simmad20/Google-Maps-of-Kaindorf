import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useEvent } from '@/components/context/EventContext';
import { useTheme } from '@/app/hooks/useTheme';

interface CountdownProps {
    compact?: boolean;
    showLabel?: boolean;
    showIcon?: boolean;
    variant?: 'default' | 'minimal' | 'inline';
}

export default function EventCountdown({
                                           compact = false,
                                           showLabel = true,
                                           showIcon = false,
                                           variant = 'default'
                                       }: CountdownProps) {
    const { activeEvent } = useEvent();
    const { isDarkMode } = useTheme();
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [timeComponents, setTimeComponents] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Theme-basierte Farben
    const themeColors = {
        background: isDarkMode ? '#1e293b' : '#f8f9fa',
        label: isDarkMode ? '#94a3b8' : '#666',
        text: isDarkMode ? '#f1f5f9' : '#333',
    };

    useEffect(() => {
        if (!activeEvent?.endDateTime) return;

        const calculateTimeLeft = () => {
            const end = new Date(activeEvent.endDateTime!).getTime();
            const now = new Date().getTime();
            const difference = end - now;

            if (difference <= 0) {
                return {
                    text: 'Event beendet',
                    components: { days: 0, hours: 0, minutes: 0, seconds: 0 }
                };
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            let text = '';
            if (compact) {
                if (days > 0) {
                    text = `${days}d ${hours}h`;
                } else if (hours > 0) {
                    text = `${hours}h ${minutes}m`;
                } else {
                    text = `${minutes}m ${seconds}s`;
                }
            } else {
                if (days > 0) {
                    text = `${days} Tage ${hours} Stunden`;
                } else if (hours > 0) {
                    text = `${hours} Std ${minutes} Min`;
                } else {
                    text = `${minutes} Min ${seconds} Sek`;
                }
            }

            return {
                text,
                components: { days, hours, minutes, seconds }
            };
        };

        const updateTime = () => {
            const result = calculateTimeLeft();
            setTimeLeft(result.text);
            setTimeComponents(result.components);
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, [activeEvent, compact]);

    if (!activeEvent?.endDateTime) return null;

    const eventColor = activeEvent.themeColor || '#7A3BDF';
    const isEventEnded = timeLeft === 'Event beendet';

    // Verschiedene Varianten
    switch (variant) {
        case 'minimal':
            return (
                <View style={styles.minimalContainer}>
                    <ThemedText style={[styles.minimalTime, { color: isEventEnded ? '#ef4444' : eventColor }]}>
                        {timeLeft}
                    </ThemedText>
                </View>
            );

        case 'inline':
            return (
                <View style={styles.inlineContainer}>
                    {showIcon && (
                        <View style={[styles.inlineIcon, { backgroundColor: `${eventColor}20` }]}>
                            {/* Icon würde hier hin */}
                        </View>
                    )}
                    <ThemedText style={[styles.inlineLabel, { color: themeColors.label }]}>
                        {showLabel ? 'Endet in: ' : ''}
                    </ThemedText>
                    <ThemedText style={[styles.inlineTime, { color: eventColor }]}>
                        {timeLeft}
                    </ThemedText>
                </View>
            );

        default:
            return (
                <View style={[
                    styles.container,
                    compact && styles.compact,
                    { backgroundColor: themeColors.background }
                ]}>
                    {showIcon && !compact && (
                        <View style={[styles.iconContainer, { backgroundColor: `${eventColor}20` }]}>
                            {/* Icon würde hier hin */}
                        </View>
                    )}
                    {showLabel && (
                        <ThemedText style={[
                            styles.label,
                            compact && styles.compactLabel,
                            { color: themeColors.label }
                        ]}>
                            {compact ? 'Endet in: ' : 'Event endet in: '}
                        </ThemedText>
                    )}
                    <ThemedText style={[
                        styles.time,
                        compact && styles.compactTime,
                        { color: isEventEnded ? '#ef4444' : eventColor },
                        isEventEnded && styles.endedText
                    ]}>
                        {timeLeft}
                    </ThemedText>
                </View>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    compact: {
        padding: 8,
        marginVertical: 4,
        borderRadius: 8,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    label: {
        fontSize: 14,
        marginRight: 6,
        fontWeight: '500',
    },
    compactLabel: {
        fontSize: 12,
    },
    time: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    compactTime: {
        fontSize: 14,
    },
    endedText: {
        fontWeight: '600',
        opacity: 0.9,
    },
    minimalContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: 'transparent',
    },
    minimalTime: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    inlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    inlineIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 6,
    },
    inlineLabel: {
        fontSize: 12,
        marginRight: 4,
    },
    inlineTime: {
        fontSize: 13,
        fontWeight: '600',
    },
});