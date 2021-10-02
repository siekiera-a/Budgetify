export interface IError {
  timestamp: string | Date;
  status: number;
  path: string;
  message?: string;
}

export type Data = Record<string, unknown>;
