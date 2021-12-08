import React, { useCallback, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";

type Props = {
  images: string[];
};

const imageSize = 100;

export const Images = React.memo(function Images({ images }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const closeViewer = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const imagesCollection = useMemo(
    () => images.map((image) => ({ uri: image })),
    [images]
  );

  const showInViewer = useCallback(
    (index: number) => {
      setIndex(index);
      setVisible(true);
    },
    [setVisible, setIndex]
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <ImageView
        visible={visible}
        onRequestClose={closeViewer}
        imageIndex={index}
        images={imagesCollection}
        keyExtractor={(_, index) => index.toString()}
        animationType="slide"
        FooterComponent={({ imageIndex }) => (
          <View>
            <Text style={styles.modalText}>
              {imageIndex + 1}/{images.length}
            </Text>
          </View>
        )}
      />
      <View style={styles.container}>
        {images.map((image, index) => (
          <TouchableWithoutFeedback
            key={image}
            style={styles.imagePlaceholder}
            onPress={() => showInViewer(index)}
          >
            <Image
              source={{ uri: image, width: imageSize, height: imageSize }}
            />
          </TouchableWithoutFeedback>
        ))}
      </View>
    </React.Fragment>
  );
});

const styles = StyleSheet.create({
  imagePlaceholder: {
    borderRadius: 8,
    overflow: "hidden",
    margin: 4,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "auto",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
  },
});
