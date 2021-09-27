export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials extends Credentials {
  name: string;
}
