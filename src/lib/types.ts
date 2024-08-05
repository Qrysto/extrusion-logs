export interface AuthData {
  sessionId: number;
  accountId: number;
  timestamp: number;
  [key: string]: unknown;
}
