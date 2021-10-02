import { ErrorResponse, mapToErrorResponse } from "./error";
import { Data, IError } from "./types";

export class HttpClient {
  private static readonly apiUrl = "http://localhost:8080";

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
    method: "POST" | "PUT"
  ): Promise<T> {
    url = this.prepareUrl(url);
    const headers = requireAuthorization
      ? this.authorizationHeaders()
      : new Headers();

    headers.append("Content-Type", "application/json");

    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
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
    requireAuthorization = true
  ): Promise<T> {
    return this.send(url, data, requireAuthorization, "POST");
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
        let value: string | undefined = undefined;

        switch (typeof v) {
          case "bigint":
          case "boolean":
          case "number":
          case "string":
          case "symbol":
            value = v.toString();
        }

        if (!value) {
          return undefined;
        }

        return `${encodeURI(key)}=${encodeURI(value)}`;
      })
      .filter((e) => !!e);
  }
}
