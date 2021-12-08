import { useMachine } from "@xstate/react";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import React, { useCallback, useEffect } from "react";
import { useSettings } from "../../contexts";
import { BottomAction } from "../../ui";
import { ImagePickerPrompt } from "./ImagePickerPrompt";
import { createImageSelectorMachine } from "./imageSelectorMachine";

type Props = {
  onImagesLoaded: (images: ImageInfo[]) => void;
  onDismiss?: () => void;
  onOptionPressed?: () => void;
  onDeleteImage?: () => void;
  deleteAvailable?: boolean;
  visible: boolean;
};

export function ImagePicker({
  onImagesLoaded,
  onDismiss,
  visible,
  deleteAvailable = false,
  onDeleteImage,
  onOptionPressed,
}: Props) {
  const { dictionary } = useSettings();
  const [, send, service] = useMachine(createImageSelectorMachine());

  useEffect(() => {
    service.onTransition((e) => {
      if (e.matches("imageReaded")) {
        const { images } = service.getSnapshot().context;
        onImagesLoaded([...images]);
        send("RESTART");
      }
      if (e.matches("imageNotReaded")) {
        send("RESTART");
      }
    });
  }, [service, onImagesLoaded, send]);

  const cameraPress = useCallback(() => {
    send({ type: "SELECT_SOURCE", source: "CAMERA" });
    if (onOptionPressed) {
      onOptionPressed();
    }
  }, [send, onOptionPressed]);

  const galleryPress = useCallback(() => {
    send({ type: "SELECT_SOURCE", source: "GALLERY" });
    if (onOptionPressed) {
      onOptionPressed();
    }
  }, [send, onOptionPressed]);

  const deletePress = useCallback(() => {
    if (onDeleteImage) {
      onDeleteImage();
    }
    if (onOptionPressed) {
      onOptionPressed();
    }
  }, [onDeleteImage, onOptionPressed]);

  return (
    <BottomAction
      title={dictionary.addPicture}
      visible={visible}
      onDismiss={onDismiss}
    >
      <ImagePickerPrompt
        onCameraPress={cameraPress}
        onGalleryPress={galleryPress}
        onDeletePress={deleteAvailable ? deletePress : undefined}
      />
    </BottomAction>
  );
}
