import { User } from "../../libs";

export type TabNavigationParamList = {
  Analysis: undefined;
  Payments: undefined;
  GroupsTab: undefined;
  Settings: undefined;
};

export type StackAuthenticationNavigationParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type StackNavigationParamList = {
  App: undefined;
  CreateGroup: undefined;
  SettlementCreator: {
    users: User[];
  };
};
