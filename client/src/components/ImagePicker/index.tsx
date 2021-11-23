import { useMachine } from "@xstate/react";
import React, { useCallback, useEffect } from "react";
import { useSettings } from "../../contexts";
import { BottomAction } from "../../ui";
import { ImagePickerPrompt } from "./ImagePickerPrompt";
import { createImageSelectorMachine } from "./imageSelectorMachine";

type Props = {
  onImagesLoaded: (images: string[]) => void;
  onDismiss?: () => void;
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
}: Props) {
  const { dictionary } = useSettings();
  const [, send, service] = useMachine(createImageSelectorMachine());

  useEffect(() => {
    service.onTransition((e) => {
      if (e.matches("imageReaded")) {
        const { images } = service.getSnapshot().context;
        onImagesLoaded([...images]);
      }
    });
  }, [service, onImagesLoaded]);

  const cameraPress = useCallback(() => {
    send({ type: "SELECT_SOURCE", source: "CAMERA" });
    if (onDismiss) {
      onDismiss();
    }
  }, [send, onDismiss]);

  const galleryPress = useCallback(() => {
    send({ type: "SELECT_SOURCE", source: "GALLERY" });
    if (onDismiss) {
      onDismiss();
    }
  }, [send, onDismiss]);

  const deletePress = useCallback(() => {
    if (onDeleteImage) {
      onDeleteImage();
    }
    if (onDismiss) {
      onDismiss();
    }
  }, [onDeleteImage, onDismiss]);

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
