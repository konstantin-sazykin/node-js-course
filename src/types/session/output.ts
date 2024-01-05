export type SessionType = {
  userId: string;
  createdAt: string;
  extendedAt: string;
  IP: string;
  browser: string;
  os: string;
};

export type CreateSessionRepositoryOutputType = {
  userId: string;
  sessionId: string;
  createdAt: string;
};
