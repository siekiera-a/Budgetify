import {HttpClient} from "..";

export type TimeRangeSummary = {
  total: number;
  expenses: number;
  settled: number;
  waiting: number;
  notPaid: number;
  from: string;
  to: string;
};

export function getTimeRangeSummary(http: HttpClient) {
  return http.get<TimeRangeSummary>("/payments/timeRangeSummary");
}
