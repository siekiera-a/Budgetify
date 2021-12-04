import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import {
  convertImageToSend,
  createInvoice,
  HttpClient,
  uploadImage,
  User,
} from "../../../libs";
import { settlementModel as model } from "./model";

type SettlementMachineParams = {
  users: User[];
  groupId: number;
  http: HttpClient;
};

export function createSettlementMachine({
  users,
  groupId,
  http,
}: SettlementMachineParams) {
  return model.createMachine(
    {
      id: "settlement-machine",
      context: {
        ...model.initialContext,
        users,
        groupId,
        http,
      },
      initial: "idle",
      states: {
        idle: {
          id: "idle",
          entry: resetMode,
          on: {
            CREATE_ITEM: {
              actions: createTemporaryItem,
              target: "creatingItem",
            },
            SELECT_PHOTOS: {
              target: "selectingPhotos",
            },
            EDIT: {
              target: "creatingItem",
              actions: [setOrginalItem, setTemporaryItem, dropItem],
            },
            SUBMIT: {
              target: "save",
            },
          },
        },
        creatingItem: {
          entry: model.assign({ mode: "SELECT_USERS" }),
          initial: "editing",
          states: {
            editing: {
              on: {
                SAVE_ITEM: {
                  actions: saveItem,
                  target: "clear",
                },
                ASSIGN_USERS: {
                  actions: openWindow,
                  target: "assigning",
                },
                CANCEL: {
                  target: "clear",
                  actions: restoreItem,
                },
              },
            },
            assigning: {
              on: {
                USERS_ASSIGNED: {
                  actions: assignUsers,
                  target: "editing",
                },
              },
            },
            clear: {
              always: {
                actions: [resetMode, clearTemporaryData],
                target: "#idle",
              },
            },
          },
        },
        selectingPhotos: {
          entry: model.assign({
            mode: "SELECT_IMAGE",
            additionalWindowOpen: true,
          }),
          exit: resetMode,
          initial: "selecting",
          states: {
            selecting: {
              on: {
                IMAGES_LOADED: {
                  actions: imagesLoaded,
                  target: "clear",
                },
                HIDE_WINDOW: {
                  actions: hideWindow,
                },
                CLOSE_WINDOW: {
                  actions: closeWindow,
                  target: "clear",
                },
              },
            },
            clear: {
              always: {
                actions: resetMode,
                target: "#idle",
              },
            },
          },
        },
        save: {
          initial: "uploadImages",
          states: {
            uploadImages: {
              invoke: {
                src: "uploadImages",
              },
              on: {
                IMAGES_UPLOADED: {
                  target: "createInvoice",
                  actions: setRemoteUrls,
                },
                ERROR: {
                  target: "#idle",
                },
              },
            },
            createInvoice: {
              invoke: {
                src: "createInvoice",
              },
              on: {
                ERROR: {
                  target: "#idle",
                },
                INVOICE_CREATED: {
                  target: "#final",
                },
              },
            },
          },
        },
        final: {
          id: "final",
          type: "final",
        },
      },
      on: {
        REMOVE: {
          actions: removeItem,
        },
        DELETE_IMAGE: {
          actions: deleteImage,
        },
      },
    },
    {
      services: {
        uploadImages:
          ({ http, photos }) =>
          async (callback) => {
            if (photos.length === 0) {
              callback({ type: "IMAGES_UPLOADED", urls: [] });
              return;
            }
            if (!isStringArray(photos)) {
              try {
                const promises = photos.map((photo) =>
                  uploadImage(http, { file: convertImageToSend(photo) })
                );
                const uploadedImages = await Promise.all(promises);

                const urls = uploadedImages
                  .map((response) => response.path)
                  .filter((path): path is string => !!path);

                callback({ type: "IMAGES_UPLOADED", urls });
                return;
              } catch (e) {
                console.log(e);
              }
            }
            callback({ type: "ERROR" });
          },

        createInvoice:
          ({ http, photos, groupId, items }) =>
          async (callback) => {
            try {
              const invoice = await createInvoice(http, {
                groupId,
                images: isStringArray(photos) ? photos : [],
                items: items.map((item) => ({
                  price: item.price,
                  text: item.name,
                  assignedUsers: item.assignedUsers
                    .filter((user) => user.checked)
                    .map((user) => user.user.id),
                })),
              });
              callback({ type: "INVOICE_CREATED", data: invoice });
            } catch (e) {
              callback("ERROR");
            }
          },
      },
    }
  );
}

const resetMode = model.assign({
  mode: () => undefined,
});

const createTemporaryItem = model.assign(
  {
    temporaryItem: ({ users }) => ({
      name: "",
      price: 0,
      assignedUsers: users.map((user) => ({ user, checked: true })),
    }),
  },
  "CREATE_ITEM"
);

const saveItem = model.assign(
  {
    items: ({ items, temporaryItem }, event) => {
      if (temporaryItem) {
        const { name, price } = event.item;
        return [
          ...items,
          { name, price, assignedUsers: temporaryItem.assignedUsers },
        ];
      }
      return items;
    },
  },
  "SAVE_ITEM"
);

const closeWindow = model.assign(
  {
    additionalWindowOpen: () => false,
  },
  "CLOSE_WINDOW"
);

const hideWindow = model.assign(
  {
    additionalWindowOpen: () => false,
  },
  "HIDE_WINDOW"
);

const openWindow = model.assign(
  {
    additionalWindowOpen: () => true,
  },
  "ASSIGN_USERS"
);

const imagesLoaded = model.assign(
  {
    photos: ({ photos }, event) => {
      return [...(photos as ImageInfo[]), ...event.images];
    },
    additionalWindowOpen: () => false,
  },
  "IMAGES_LOADED"
);

const removeItem = model.assign(
  {
    items: ({ items }, event) => {
      const index = event.index;
      if (index >= items.length) {
        return items;
      }

      return items.filter((_, i) => index !== i);
    },
  },
  "REMOVE"
);

const setOrginalItem = model.assign(
  {
    orginalItem: ({ items }, event) => {
      const index = event.index;
      if (index >= items.length) {
        return undefined;
      }

      return { ...items[index] };
    },
  },
  "EDIT"
);

const setTemporaryItem = model.assign(
  {
    temporaryItem: ({ orginalItem }) => {
      if (orginalItem) {
        return { ...orginalItem };
      }
    },
  },
  "EDIT"
);

const restoreItem = model.assign(
  {
    items: ({ orginalItem, items }) => {
      if (orginalItem) {
        return [...items, orginalItem];
      }
      return items;
    },
  },
  "CANCEL"
);

const dropItem = model.assign(
  {
    items: ({ items }, event) => {
      const index = event.index;
      if (index >= items.length) {
        return items;
      }
      return items.filter((_, i) => index !== i);
    },
  },
  "EDIT"
);

const clearTemporaryData = model.assign({
  temporaryItem: undefined,
  orginalItem: undefined,
});

const assignUsers = model.assign(
  {
    temporaryItem: ({ temporaryItem }, event) => {
      if (!temporaryItem) {
        return undefined;
      }

      const { name, price } = temporaryItem;
      const users = event.users;

      return {
        name,
        price,
        assignedUsers: users,
      };
    },
    additionalWindowOpen: false,
  },
  "USERS_ASSIGNED"
);

const deleteImage = model.assign(
  {
    photos: ({ photos }, event) => {
      return (photos as string[]).filter((_, index) => index !== event.index);
    },
  },
  "DELETE_IMAGE"
);

const setRemoteUrls = model.assign(
  {
    photos: (_, event) => {
      return event.urls;
    },
  },
  "IMAGES_UPLOADED"
);

const isStringArray = (array: ImageInfo[] | string[]): array is string[] => {
  return array.length === 0 || typeof array[0] === "string";
};
