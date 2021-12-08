export interface IError {
  timestamp: string | Date;
  status: number;
  path: string;
  message?: string;
}

export type Data = Record<string, unknown>;

export type ContentType = "application/json" | "multipart/form-data";

export type HttpOptions = {
  requireAuthorization?: boolean;
  contentType?: ContentType;
};
