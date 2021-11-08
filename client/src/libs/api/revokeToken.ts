import { HttpClient, LoginResponse, TokenRequest } from "..";

export async function revokeToken(http: HttpClient, data: TokenRequest) {
  return await http.post<LoginResponse>("/user/revoke-token", data);
}
