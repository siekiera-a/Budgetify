import { HttpClient, SearchUsersResponse } from "..";

export async function findUsers(
  http: HttpClient,
  searchTerm: string,
  page = 0
) {
  return await http.get<SearchUsersResponse>("/user/find", {
    term: searchTerm,
    page,
  });
}
