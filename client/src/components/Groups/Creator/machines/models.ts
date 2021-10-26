import { createModel } from "xstate/lib/model";
import {
  ErrorResponse,
  HttpClient,
  SearchUsersResponse,
  User,
} from "../../../../libs";
import { SearchUsersActor } from "./searchUsersMachine";

export const searchUsersModel = createModel(
  {
    friends: [] as User[],
    results: [] as User[],
    exclude: [] as User[],
    http: new HttpClient(""),
    term: "",
    error: undefined as ErrorResponse | undefined,
  },
  {
    events: {
      SEARCH: (term: string) => ({ term }),
      TEST: (xd: number) => ({ xd }),
      USERS_FETCHED: (data: SearchUsersResponse) => ({ data }),
      FRIENDS_FETCHED: (users: User[]) => ({ users }),
      ERROR: (error: ErrorResponse) => ({ error }),
      EXIT: () => ({}),
      SELECT: (user: User) => ({ user }),
    },
  }
);

export const groupModel = createModel(
  {
    name: "",
    photo: undefined as string | undefined,
    members: [] as User[],
    http: new HttpClient(""),
    searchUsersService: undefined as SearchUsersActor | undefined,
  },
  {
    events: {
      SELECT_USER: (user: User) => ({ user }),
      SET_NAME: (name: string) => ({ name }),
      SEARCH_PEOPLE: () => ({}),
      EXIT: () => ({}),
      USER_SELECTED: (user: User) => ({ user }),
    },
  }
);
