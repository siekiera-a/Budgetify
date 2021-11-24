export async function UriToBlob(uri: string) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  } catch (e) {
    return null;
  }
}
