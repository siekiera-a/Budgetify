import { HttpClient } from "..";
import { LoginResponse, RegisterRequest } from "./types";

export async function signUp(client: HttpClient, data: RegisterRequest) {
  return await client.post<LoginResponse>("/user", data, false);
}
