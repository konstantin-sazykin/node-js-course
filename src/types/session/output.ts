export interface SessionType {
  userId: string;
  createdAt: string;
  extendedAt: string;
  expiresAt: string;
  IP: string;
  browser: string;
  os: string;
}

export interface SessionRepositoryOutputType {
  userId: string;
  sessionId: string;
  createdAt: string;
  extendedAt: string;
}

export interface SessionReadRepositoryOutputType {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
}
