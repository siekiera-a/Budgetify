import { HttpClient, GroupResponse } from "..";

export async function findGroups(http: HttpClient) {
  return await http.get<GroupResponse[]>("/group");
}
