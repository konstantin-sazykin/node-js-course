export type UserAgentDataType = {
  IP: string;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
};

export type CreateSessionInputType = {
  userId: string;
  IP?: string;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
};

export type CreateSessionRepositoryType = {
  userId: string;
  IP: string;
  browser: string;
  os: string;
};

export type UpdateSessionInputType = {
  userId: string;
  sessionId: string;
  createdAt: string;
};
