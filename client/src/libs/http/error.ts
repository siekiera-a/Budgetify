import { IError } from "./types";

export class ErrorResponse extends Error {
  private _error: IError;

  public get error() {
    return this._error;
  }

  constructor(error: IError) {
    if (error.message) {
      super(error.message);
    } else {
      super(`Request to ${error.path} failed with status ${error.status}`);
    }

    if (typeof error.timestamp === "string") {
      error.timestamp = new Date(error.timestamp);
    }

    this._error = error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapToErrorResponse = (e: any, url: string) => {
  return new ErrorResponse({
    path: url,
    timestamp: new Date(),
    status: 500,
    message: e.toString(),
  });
};
