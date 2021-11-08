export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  name: string;
};

export type LoginResponse = {
  token: string;
  profile: Profile;
};

export type SearchUsersResponse = {
  users: User[];
  searchTerm: string;
  totalPages: number;
  currentPage: number;
  totalCount: number;
};

export type User = {
  id: number;
  name: string;
  avatar: string | null;
};

export type Profile = User & {
  email: string;
  registrationTime: string;
  blikNumber: string;
  bankAccount: string;
};

export type CreateGroupRequest = {
  name: string;
  avatar?: string;
  members: number[];
};

export type GroupResponse = {
  id: number;
  name: string;
  avatar: string | null;
  creationTime: string;
  owner: User;
  members: User[];
};

export type TokenRequest = {
  token: string;
}
