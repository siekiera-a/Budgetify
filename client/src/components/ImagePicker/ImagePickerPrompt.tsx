import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useSettings } from "../../contexts";

type Props = {
  onCameraPress: () => void;
  onGalleryPress: () => void;
};

const iconSize = 35;

export function ImagePickerPrompt({ onCameraPress, onGalleryPress }: Props) {
  const { dictionary } = useSettings();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="file-image-outline"
          onPress={onGalleryPress}
          size={iconSize}
        />
        <Text>{dictionary.gallery}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="camera-outline"
          onPress={onCameraPress}
          size={iconSize}
        />
        <Text>{dictionary.camera}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttonContainer: {
    alignItems: "center",
  },
});
