import Animated, {
    useSharedValue,
    withSpring,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    useDerivedValue,
    runOnJS,
} from 'react-native-reanimated';
import { gestureHandlerRootHOC, PanGestureHandler, LongPressGestureHandler, GestureDetector } from 'react-native-gesture-handler';


const ComposedGestureWrapper = gestureHandlerRootHOC(({ gesture, children }) => (
    <GestureDetector gesture={gesture}>
        {children}
    </GestureDetector>
));

export default ComposedGestureWrapper;