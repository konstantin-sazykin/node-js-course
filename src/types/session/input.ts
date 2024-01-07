export interface UserAgentDataType {
  IP: string;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
}

export interface CreateSessionInputType {
  userId: string;
  IP?: string;
  browserName?: string;
  browserVersion?: string;
  osName?: string;
  osVersion?: string;
}

export interface CreateSessionRepositoryType {
  userId: string;
  IP: string;
  browser: string;
  os: string;
}

export interface UpdateSessionInputType {
  userId: string;
  sessionId: string;
  createdAt: string;
}

export interface QuerySessionIdType {
  id: string;
};
