import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import mime from "mime";
import { FileData } from "../api";

export const convertImageToSend = (image: ImageInfo): FileData => {
  return { name: "name", type: mime.getType(image.uri) || "", uri: image.uri };
};
