import { HttpClient } from "..";
import { Profile } from "./types";

export async function updatePhoneNumber(
  client: HttpClient,
  phoneNumber: string
) {
  return await client.put<Profile>("/user/phone", { phoneNumber });
}
