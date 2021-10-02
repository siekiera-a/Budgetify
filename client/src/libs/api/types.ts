export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  name: string;
};

export type LoginResponse = {
  token: string;
  user: ProfileInfo;
};

export type ProfileInfo = {
  id: number;
  name: string;
  email: string;
  registrationTime: string;
  blikNumber: string;
  bankAccount: string;
  avatar: string;
};
