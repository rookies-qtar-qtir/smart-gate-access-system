import type { User } from "./user";

export type AccessStatus = "GRANTED" | "DENIED";

export interface AccessLogEntry {
  id?: number | string;
  uid: string;
  timestamp: string;
  vehicle?: string;
  plateNumber?: string;
  status: AccessStatus;
  reason?: string;
  user?: User;
}

export interface AccessLogStats {
  total: number;
  granted: number;
  denied: number;
}
