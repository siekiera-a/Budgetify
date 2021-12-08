import React, { useCallback } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSettings } from "../../contexts";
import { SettlementEvents as Events } from "./machine/model";

type Props = {
  onZonePress: () => void;
  photos: string[];
  send: (event: Events) => void;
};

export function ImageZone({ onZonePress, photos, send }: Props) {
  const { theme } = useSettings();

  const onDeletePress = useCallback(
    (index: number) => {
      send({ type: "DELETE_IMAGE", index });
    },
    [send]
  );

  return (
    <View style={photos.length === 0 ? styles.center : undefined}>
      <ScrollView horizontal>
        {photos.map((photo, index) => (
          <View key={index} style={[styles.imagePlaceholder, styles.image]}>
            <Image
              source={{
                uri: photo,
                width: placeholderSize,
                height: placeholderSize,
              }}
            />
            <IconButton
              icon={(props) => <Icon {...props} name="cancel" />}
              size={20}
              style={styles.deleteIcon}
              onPress={() => onDeletePress(index)}
            />
          </View>
        ))}
        <TouchableHighlight
          style={[styles.zone, styles.imagePlaceholder]}
          onPress={onZonePress}
        >
          <Icon
            name="add-photo-alternate"
            size={placeholderSize / 3}
            color={theme.colors.text}
          />
        </TouchableHighlight>
      </ScrollView>
    </View>
  );
}

const placeholderSize = 110;

const styles = StyleSheet.create({
  center: {
    alignItems: "center"
  },
  imagePlaceholder: {
    borderRadius: 8,
    width: placeholderSize,
    height: placeholderSize,
    overflow: "hidden",
  },
  image: {
    marginRight: 8,
    position: "relative",
  },
  zone: {
    borderStyle: "dashed",
    borderColor: "#424242",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    position: "absolute",
    top: -5,
    right: -5,
  },
});
