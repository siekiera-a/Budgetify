import { ErrorResponse, mapToErrorResponse } from "./error";
import { ContentType, Data, HttpOptions, IError } from "./types";

export class HttpClient {
  private static readonly apiUrl = "http://192.168.0.101:8080";

  constructor(private token: string) {}

  public async get<T>(
    url: string,
    params?: Data,
    requireAuthorization = true
  ): Promise<T> {
    url = this.prepareUrl(url);

    if (params) {
      const urlParams = this.mapParams(params);
      if (urlParams.length > 0) {
        url += `?${urlParams.join("&")}`;
      }
    }

    try {
      const response = await fetch(url, {
        headers: requireAuthorization ? this.authorizationHeaders() : undefined,
      });
      return await this.handleResponse(response);
    } catch (e) {
      if (e instanceof ErrorResponse) {
        throw e;
      }
      throw mapToErrorResponse(e, url);
    }
  }

  private async send<T>(
    url: string,
    data: Data,
    requireAuthorization: boolean,
    method: "POST" | "PUT",
    contentType: ContentType = "application/json"
  ): Promise<T> {
    url = this.prepareUrl(url);
    const headers = requireAuthorization
      ? this.authorizationHeaders()
      : new Headers();

    headers.append("Content-Type", contentType);

    const body = this.getBody(data, contentType);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
      });
      return await this.handleResponse(response);
    } catch (e) {
      if (e instanceof ErrorResponse) {
        throw e;
      }
      throw mapToErrorResponse(e, url);
    }
  }

  public async post<T>(
    url: string,
    data: Data,
    options: HttpOptions = {
      contentType: "application/json",
      requireAuthorization: true,
    }
  ) {
    const { contentType = "application/json", requireAuthorization = true } =
      options;
    return this.send<T>(url, data, requireAuthorization, "POST", contentType);
  }

  public async put<T>(
    url: string,
    data: Data,
    requireAuthorization = true
  ): Promise<T> {
    return this.send(url, data, requireAuthorization, "PUT");
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: T | IError = await response.json();

    if (response.ok) {
      return data as T;
    }

    console.error(data);
    throw new ErrorResponse(data as IError);
  }

  private prepareUrl(url: string) {
    return HttpClient.apiUrl + url;
  }

  private getBody(data: Data, contentType: ContentType) {
    if (contentType === "application/json") {
      return JSON.stringify(data);
    }

    const formData = new FormData();
    for (const key in data) {
      const value = data[key];
      const convertedData = this.convertUnknown(value);
      if (convertedData) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formData.append(key, convertedData);
      }
    }

    return formData;
  }

  private authorizationHeaders() {
    if (this.token.length === 0) {
      throw new Error("User not logged in!");
    }

    const headers = new Headers();
    headers.append("Authorization", this.token);
    return headers;
  }

  private mapParams(params: Data) {
    return Object.entries(params)
      .map(([key, v]) => {
        const value = this.convertUnknown(v);

        if (!value || typeof value === "object") {
          return undefined;
        }

        return `${encodeURI(key)}=${encodeURI(value)}`;
      })
      .filter((e) => !!e);
  }

  private convertUnknown(value: unknown) {
    switch (typeof value) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "symbol":
        return value.toString();
      case "object":
        return value;
    }

    return undefined;
  }
}
