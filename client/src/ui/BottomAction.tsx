import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Portal, Surface, Title } from "react-native-paper";

type TitlePosition = "center" | "left" | "right";

type Props = {
  children?: React.ReactNode;
  title?: string;
  titlePosition?: TitlePosition;
  visible: boolean;
  onDismiss?: () => void;
};

const animationDuration = 100;
const maxValue = 100;

export function BottomAction({
  children,
  title,
  titlePosition = "center",
  visible,
  onDismiss,
}: Props) {
  const styles = React.useMemo(
    () => createStyles(titlePosition),
    [titlePosition]
  );

  const [height, setHeight] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: visible ? 0 : maxValue,
      duration: animationDuration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [visible]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setHeight(e.nativeEvent.layout.height);
    },
    [setHeight]
  );

  return (
    <Portal>
      {visible && (
        <TouchableWithoutFeedback
          onPress={onDismiss}
          containerStyle={styles.touchable}
          style={styles.touchable}
        >
          <View style={styles.container} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[
          styles.surfaceContainer,
          {
            transform: [
              {
                translateY: slideAnimation.interpolate({
                  inputRange: [0, maxValue],
                  outputRange: [0, height],
                }),
              },
            ],
          },
        ]}
        onLayout={onLayout}
      >
        <Surface style={styles.surface}>
          {title && <Title style={styles.title}>{title}</Title>}
          {children}
        </Surface>
      </Animated.View>
    </Portal>
  );
}

const borderRadius = 32;

const createStyles = (titlePosition: TitlePosition) => {
  return StyleSheet.create({
    container: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      flex: 1,
    },
    touchable: {
      flex: 1,
    },
    surface: {
      padding: 16,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      elevation: 10,
    },
    surfaceContainer: {
      position: "absolute",
      width: "100%",
      bottom: 0,
    },
    title: {
      textAlign: titlePosition,
      marginBottom: 16,
    },
  });
};
