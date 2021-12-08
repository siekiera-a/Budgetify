import { FileRequest, FileResponse } from ".";
import { HttpClient } from "..";

export async function uploadImage(client: HttpClient, data: FileRequest) {
  return await client.post<FileResponse>("/files/upload", data, {
    requireAuthorization: true,
    contentType: "multipart/form-data",
  });
}
