export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  name: string;
};

export type LoginResponse = {
  token: string;
  user: Profile;
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
