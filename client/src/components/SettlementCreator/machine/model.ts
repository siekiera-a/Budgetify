import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { EventFrom } from "xstate";
import { createModel } from "xstate/lib/model";
import { User } from "../../../libs";

export type UserStatus = {
  user: User;
  checked: boolean;
};

type Mode = "SELECT_USERS" | "SELECT_IMAGE";

export type Item = {
  name: string;
  price: number;
  assignedUsers: UserStatus[];
};

export type SettlementEvents = EventFrom<typeof settlementModel>;

export const settlementModel = createModel(
  {
    photos: [] as ImageInfo[] | string[],
    users: [] as User[],
    items: [] as Item[],
    mode: undefined as Mode | undefined,
    temporaryItem: undefined as Item | undefined,
    orginalItem: undefined as Item | undefined,
    creator: 0,
    additionalWindowOpen: false,
  },
  {
    events: {
      CREATE_ITEM: () => ({}),
      SAVE_ITEM: (item: Item) => ({ item }),
      SELECT_PHOTOS: () => ({}),
      CLOSE_WINDOW: () => ({}),
      HIDE_WINDOW: () => ({}),
      IMAGES_LOADED: (images: ImageInfo[]) => ({ images }),
      ASSIGN_USERS: () => ({}),
      CANCEL: () => ({}),
      REMOVE: (index: number) => ({ index }),
      EDIT: (index: number) => ({ index }),
      USERS_ASSIGNED: (users: UserStatus[]) => ({ users }),
      DELETE_IMAGE: (index: number) => ({ index }),
      SUBMIT: () => ({}),
    },
  }
);
