import {TouchableOpacity} from "react-native";
import Svg, { Circle, Line, Path } from 'react-native-svg';

const FullscreenIcon = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.fullscreenButton}
    >
        <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                fill="#fff"
            />
        </Svg>
    </TouchableOpacity>
);

const styles = StyleSheet.create({})