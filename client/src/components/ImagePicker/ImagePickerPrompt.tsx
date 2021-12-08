import React from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSettings } from "../../contexts";

type Props = {
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onDeletePress?: () => void;
};

const iconSize = 35;

export function ImagePickerPrompt({
  onCameraPress,
  onGalleryPress,
  onDeletePress,
}: Props) {
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
      {onDeletePress && (
        <View style={styles.buttonContainer}>
          <IconButton
            icon={(props) => <FontAwesome name="remove" {...props} />}
            onPress={onDeletePress}
            size={iconSize}
          />
          <Text>{dictionary.delete}</Text>
        </View>
      )}
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
