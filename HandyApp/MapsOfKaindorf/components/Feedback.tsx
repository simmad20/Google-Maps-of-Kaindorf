import { LanguageContext, LanguageContextType } from '@/components/context/LanguageContext';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Feedback() {
  const { texts } = useContext<LanguageContextType>(LanguageContext);
  const [show, setShow] = useState(true);

  if (!show) return null;

  const handleFeedback = (feedback: 'GOOD' | 'MID' | 'BAD') => {
    console.log('Feedback:', feedback);
    setShow(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text}>{texts.feedback}</ThemedText>
      <ThemedText style={styles.emoji}>
        <Text onPress={() => handleFeedback('GOOD')}>😊</Text>
        <Text onPress={() => handleFeedback('MID')}>😑</Text>
        <Text onPress={() => handleFeedback('BAD')}>☹️️</Text>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  emoji: { fontSize: 40, lineHeight: 50, textAlign: 'center' },
  text: { textAlign: 'center' },
});