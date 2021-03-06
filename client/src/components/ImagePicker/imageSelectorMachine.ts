import { createModel } from "xstate/lib/model";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { ActorRefFrom } from "xstate";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

export type Source = "GALLERY" | "CAMERA";

const model = createModel(
  {
    source: "CAMERA" as Source,
    hasPermissions: false,
    images: [] as ImageInfo[],
    success: false,
  },
  {
    events: {
      SELECT_SOURCE: (source: Source) => ({ source }),
      PERMISSIONS_READED: (result: boolean) => ({ result }),
      ERROR: () => ({}),
      IMAGES_LOADED: (images: ImageInfo[]) => ({ images }),
      RESTART: () => ({}),
    },
  }
);

export type ImageSelectorActor = ActorRefFrom<
  ReturnType<typeof createImageSelectorMachine>
>;

export function createImageSelectorMachine() {
  return model.createMachine(
    {
      context: {
        ...model.initialContext,
      },
      initial: "waitForSource",
      states: {
        waitForSource: {
          on: {
            SELECT_SOURCE: {
              actions: setSource,
              target: "getPermissions",
            },
          },
        },
        getPermissions: {
          invoke: {
            src: "getPermissions",
          },
          on: {
            PERMISSIONS_READED: {
              actions: setHasPermissions,
              target: "processPermissions",
            },
          },
        },
        processPermissions: {
          always: [
            { cond: "permissionsGranted", target: "readImage" },
            { target: "imageNotReaded" },
          ],
        },
        readImage: {
          invoke: {
            src: "getImage",
          },
          on: {
            ERROR: {
              actions: setError,
              target: "imageNotReaded",
            },
            IMAGES_LOADED: {
              actions: setData,
              target: "imageReaded",
            },
          },
        },
        imageNotReaded: {
          on: {
            RESTART: {
              target: "waitForSource",
              actions: restartMachine,
            },
          },
        },
        imageReaded: {
          on: {
            RESTART: {
              actions: restartMachine,
              target: "waitForSource",
            },
          },
        },
      },
    },
    {
      guards: {
        permissionsGranted: ({ hasPermissions }) => hasPermissions,
      },
      services: {
        getPermissions:
          ({ source }) =>
          async (callback) => {
            const response = await (source === "CAMERA"
              ? requestCameraPermissionsAsync()
              : requestMediaLibraryPermissionsAsync());

            callback({ type: "PERMISSIONS_READED", result: response.granted });
          },

        getImage:
          ({ source }) =>
          async (callback) => {
            const response = await (source === "GALLERY"
              ? launchImageLibraryAsync({
                  mediaTypes: MediaTypeOptions.Images,
                  quality: 1,
                  allowsMultipleSelection: true,
                })
              : launchCameraAsync({
                  mediaTypes: MediaTypeOptions.Images,
                  quality: 1,
                }));

            if (!response.cancelled) {
              const images: ImageInfo[] = [];
              if ("selected" in response) {
                images.push(...response.selected);
              } else {
                images.push(response);
              }

              callback({
                type: "IMAGES_LOADED",
                images,
              });
              return;
            }

            callback("ERROR");
          },
      },
    }
  );
}

const setSource = model.assign(
  {
    source: (_, e) => {
      return e.source;
    },
  },
  "SELECT_SOURCE"
);

const setHasPermissions = model.assign(
  { hasPermissions: (_, e) => e.result },
  "PERMISSIONS_READED"
);

const setData = model.assign(
  {
    images: (_, e) => {
      return [...e.images];
    },
    success: () => true,
  },
  "IMAGES_LOADED"
);

const setError = model.assign(
  {
    success: () => false,
  },
  "ERROR"
);

const restartMachine = model.assign(
  () => ({ ...model.initialContext }),
  "RESTART"
);
