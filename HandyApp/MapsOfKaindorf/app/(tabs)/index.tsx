import { LanguageContext, LanguageContextType } from '@/components/context/LanguageContext';
import { Platform, Pressable, StyleSheet } from 'react-native';

import Feedback from '@/components/Feedback';
import { HelloWave } from '@/components/HelloWave';
import Icon from 'react-native-vector-icons/FontAwesome';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { texts, switchLanguage } = useContext<LanguageContextType>(LanguageContext);
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
      headerImage={
        <ThemedView style={styles.headerTextContainer}>
          <ThemedText style={styles.headerTextOuter}>
            <ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText>
            <Pressable style={styles.headerGear} onPress={() => router.push('/settings')}>
              <Icon name="gear" size={25} color="#a453ec" />
            </Pressable>
          </ThemedText>
        </ThemedView>
      }
      headerHeight={80}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{texts.greeting}</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="default">{texts.desc}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="default">{texts.nav}</ThemedText>
      </ThemedView>

      <Pressable style={styles.switchLanguageButton} onPress={() => switchLanguage()}>
        <ThemedText style={styles.buttonText}>{texts.otherLanguage}</ThemedText>
      </Pressable>

      <Feedback />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d283e',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderRightColor: '#a453ec',
    borderLeftColor: '#a453ec',
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomColor: '#a453ec',
  },
  headerTextOuter: {},
  headerText: {
    color: '#a453ec',
    fontSize: 24,
    fontFamily: 'Nice',
  },
  headerGear: { marginLeft: 20 },
  titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepContainer: { gap: 8, marginBottom: 8, fontFamily: 'Montserrat' },
  switchLanguageButton: { backgroundColor: '#2d283e', padding: 5, width: 100, borderRadius: 7 },
  buttonText: { color: '#a453ec', fontSize: 14, textAlign: 'center' },
});