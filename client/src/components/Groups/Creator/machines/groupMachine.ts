import { ActorRefFrom, spawn } from "xstate";
import { HttpClient } from "../../../../libs";
import { groupModel as model } from "./models";
import { createSearchUsersMachine } from "./searchUsersMachine";

export function createGroupMachine(http: HttpClient) {
  return model.createMachine({
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
    },
  });
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

const addMember = model.assign({
  members: (context, event) => {
    return [...context.members, event.user]
  }
}, "USER_SELECTED")
