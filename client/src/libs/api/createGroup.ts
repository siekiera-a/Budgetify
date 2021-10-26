import { HttpClient } from "..";
import { CreateGroupRequest, GroupResponse } from "./types";

export async function createGroup(http: HttpClient, data: CreateGroupRequest) {
  return await http.post<GroupResponse>("/group", data);
}
