import { HttpClient } from "..";
import { LoginRequest, LoginResponse } from "./types";

export async function signIn(client: HttpClient, data: LoginRequest) {
  return await client.post<LoginResponse>("/user/login", data, false)
}