import { ActorRefFrom, spawn } from "xstate";
import {
  HttpClient,
  createGroup,
  ErrorResponse,
  uploadImage,
  convertImageToSend,
} from "../../../../libs";
import { groupModel as model } from "./models";
import { createSearchUsersMachine } from "./searchUsersMachine";

export function createGroupMachine(http: HttpClient) {
  return model.createMachine(
    {
      id: "create-group",
      context: {
        ...model.initialContext,
        http,
      },
      initial: "idle",
      states: {
        idle: {
          on: {
            SET_NAME: {
              actions: setName,
            },
            SEARCH_PEOPLE: {
              target: "searchPeople",
            },
            DELETE_USER: {
              actions: removeMember,
            },
            CREATE: {
              target: "createGroup",
            },
            SET_IMAGE: {
              actions: setImage,
            },
          },
        },
        searchPeople: {
          entry: spawnSearchUsersMachine,
          on: {
            EXIT: {
              target: "idle",
            },
            USER_SELECTED: {
              actions: addMember,
            },
          },
        },
        createGroup: {
          initial: "initial",
          states: {
            initial: {
              always: [
                { cond: "photoExists", target: "uploadPhoto" },
                { target: "create" },
              ],
            },
            uploadPhoto: {
              invoke: { src: "uploadPhoto" },
              on: {
                SET_IMAGE: {
                  actions: setImage,
                  target: "create",
                },
              },
            },
            create: {
              invoke: {
                src: "createGroup",
              },
              on: {
                GROUP_CREATED: {
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
    },
    {
      services: {
        createGroup:
          ({ http, name, photo, members }) =>
          async (callback) => {
            try {
              const response = await createGroup(http, {
                name,
                avatar: typeof photo === "string" ? photo : undefined,
                members: members.map((member) => member.id),
              });
              callback({ type: "GROUP_CREATED", data: response });
            } catch (e) {
              callback({ type: "ERROR", error: e as ErrorResponse });
            }
          },
        uploadPhoto:
          ({ photo, http }) =>
          async (callback) => {
            if (!photo || typeof photo === "string") {
              return;
            }
            try {
              const uploadedFile = await uploadImage(http, {
                file: convertImageToSend(photo),
              });
              if (!uploadedFile.path) {
                callback({ type: "SET_IMAGE", image: undefined });
                return;
              }

              callback({
                type: "SET_IMAGE",
                image: uploadedFile.path,
              });
            } catch (e) {
              callback({ type: "SET_IMAGE", image: undefined });
            }
          },
      },
      guards: {
        photoExists: ({ photo }) => !!photo,
      },
    }
  );
}

export type GroupActor = ActorRefFrom<ReturnType<typeof createGroupMachine>>;

const setName = model.assign(
  {
    name: (_, { name }) => {
      return name;
    },
  },
  "SET_NAME"
);

const spawnSearchUsersMachine = model.assign({
  searchUsersService: ({ http, members }) => {
    return spawn(createSearchUsersMachine(http, members));
  },
});

const addMember = model.assign(
  {
    members: (context, event) => {
      return [...context.members, event.user];
    },
  },
  "USER_SELECTED"
);

const removeMember = model.assign(
  {
    members: ({ members }, { user }) => {
      return members.filter((member) => member.id !== user.id);
    },
  },
  "DELETE_USER"
);

const setImage = model.assign(
  {
    photo: (_, e) => {
      return e.image;
    },
  },
  "SET_IMAGE"
);
