import uniqBy from "lodash/uniqBy";
import { ActorRefFrom, sendParent } from "xstate";

import { ErrorResponse, findUsers, HttpClient, User } from "../../../../libs";
import { searchUsersModel as model } from "./models";

export type SearchUsersActor = ActorRefFrom<
  ReturnType<typeof createSearchUsersMachine>
>;

export const createSearchUsersMachine = (
  http: HttpClient,
  exclude: User[] = []
) => {
  return model.createMachine(
    {
      id: "group-creator",
      context: {
        ...model.initialContext,
        http,
        exclude,
      },
      initial: "initial",
      on: {
        EXIT: {
          target: "exit",
        },
      },
      states: {
        initial: {
          invoke: {
            src: "fetchFriends",
          },
          on: {
            FRIENDS_FETCHED: {
              actions: [],
              target: "idle",
            },
          },
        },
        idle: {
          on: {
            SEARCH: [
              {
                cond: "hasAtLeastThreeChars",
                actions: setTerm,
                target: "fetchFriends",
              },
              {
                actions: [setTerm, clearResults],
                target: "modifyResults",
              },
            ],
            SELECT: {
              actions: [
                addToExclude,
                removeFromResults,
                sendParent((_, event) => ({
                  type: "USER_SELECTED",
                  user: event.user,
                })),
              ],
            },
          },
        },
        fetchFriends: {
          invoke: {
            src: "searchUsers",
          },
          on: {
            USERS_FETCHED: {
              actions: setResults,
              target: "modifyResults",
            },
            ERROR: {
              actions: setError,
            },
          },
        },
        modifyResults: {
          always: {
            actions: [
              appendMatchingFriends,
              removeDuplicatedResults,
              excludeUsersFromResult,
            ],
            target: "idle",
          },
        },
        exit: {
          type: "final",
          entry: sendParent("EXIT"),
        },
      },
    },
    {
      services: {
        fetchFriends: () => async (callback) => {
          callback({
            type: "FRIENDS_FETCHED",
            users: [],
          });
        },
        searchUsers:
          ({ http, term }) =>
          async (callback) => {
            try {
              const data = await findUsers(http, term);
              callback({
                type: "USERS_FETCHED",
                data,
              });
            } catch (e) {
              callback({
                type: "ERROR",
                error: e as ErrorResponse,
              });
            }
          },
      },
      guards: {
        hasAtLeastThreeChars: (_, e) => {
          if (e.type !== "SEARCH") {
            return false;
          }
          return e.term.length >= 3;
        },
      },
    }
  );
};

const appendMatchingFriends = model.assign({
  results: ({ term: searchTerm, friends, results }) => {
    const term = searchTerm.toLowerCase();
    const filteredFriends = friends.filter((friend) => {
      return friend.name.toLowerCase().startsWith(term);
    });
    return [...filteredFriends, ...results];
  },
});

const removeDuplicatedResults = model.assign({
  results: ({ results }) => {
    return uniqBy(results, "id");
  },
});

const excludeUsersFromResult = model.assign({
  results: ({ results, exclude }) => {
    const idsToExclude = exclude.map((e) => e.id);
    return results.filter((user) => !idsToExclude.includes(user.id));
  },
});

const setTerm = model.assign(
  {
    term: (_, e) => {
      return e.term;
    },
  },
  "SEARCH"
);

const clearResults = model.assign(
  {
    results: [],
  },
  "SEARCH"
);

const addToExclude = model.assign(
  {
    exclude: ({ exclude }, { user }) => {
      return [...exclude, user];
    },
  },
  "SELECT"
);

const removeFromResults = model.assign(
  {
    results: ({ results }, event) => {
      return results.filter((user) => user.id !== event.user.id);
    },
  },
  "SELECT"
);

const setResults = model.assign(
  {
    results: (_, { data }) => {
      return data.users;
    },
  },
  "USERS_FETCHED"
);

const setError = model.assign(
  {
    error: (_, { error }) => {
      return error;
    },
  },
  "ERROR"
);
