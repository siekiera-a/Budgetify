import { HttpClient } from "..";
import { Profile } from "./types";

export async function updateBankAccount(
  client: HttpClient,
  bankAccount: string
) {
  return await client.put<Profile>("/user/bankAccount", { bankAccount });
}
