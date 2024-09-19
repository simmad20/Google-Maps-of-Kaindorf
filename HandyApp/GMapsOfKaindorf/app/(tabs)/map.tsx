import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Handy from '@/components/Handy';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Path to the Teacher</ThemedText>
      </ThemedView>
      
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MapsOfKaindorf />
      </GestureHandlerRootView>
      <Handy />
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
