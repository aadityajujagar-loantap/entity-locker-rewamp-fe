"use client";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api/v1/portal";
const AUTH_STORAGE_KEY = "entityLocker.authSession";
const AUTH_SESSION_CHANGED_EVENT = "entityLocker.authSessionChanged";

let cachedAuthSessionRaw: string | null = null;
let cachedAuthSession: AuthSession | null = null;

export interface PortalUser {
  id: number;
  employeeId: string | null;
  pfNumber: string | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
  status: string | null;
}

export interface BranchDetails {
  branchCode: string | null;
  branchName: string | null;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: PortalUser;
  roles: string[];
  branch: BranchDetails | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: PortalUser;
  roles: string[];
  branch: BranchDetails | null;
}

interface LoginCredentials {
  login: string;
  password: string;
  deviceName?: string;
}

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

export function getPortalApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_PORTAL_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_PORTAL_API_BASE_URL.replace(/\/+$/, "");
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/, "");
    return base.endsWith("/api/v1/portal") ? base : `${base}/api/v1/portal`;
  }
  return DEFAULT_API_BASE_URL.replace(/\/+$/, "");
}

export async function loginToPortal(credentials: LoginCredentials): Promise<LoginResponseData> {
  const response = await fetch(`${getPortalApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: credentials.login,
      password: credentials.password,
      device_name: credentials.deviceName || "entity-locker-web",
    }),
    cache: "no-store",
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new AuthApiError(
      getApiErrorMessage(payload, "Unable to sign in. Please check your credentials."),
      getStatusCode(payload, response.status),
      getValidationErrors(payload),
    );
  }

  const data = getLoginResponseData(payload);

  if (!data) {
    throw new AuthApiError("Login succeeded but returned an unexpected response.");
  }

  return data;
}

export async function logoutFromPortal(session: AuthSession): Promise<void> {
  const response = await fetch(`${getPortalApiBaseUrl()}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: session.refreshToken,
    }),
    cache: "no-store",
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new AuthApiError(
      getApiErrorMessage(payload, "Unable to log out from the server."),
      getStatusCode(payload, response.status),
      getValidationErrors(payload),
    );
  }
}

export function saveAuthSession(data: LoginResponseData) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const session: AuthSession = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + data.expiresIn * 1000,
    user: data.user,
    roles: data.roles,
    branch: data.branch,
  };

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  cachedAuthSessionRaw = storage.getItem(AUTH_STORAGE_KEY);
  cachedAuthSession = session;
  notifyAuthSessionChanged();
}

export function getAuthSession(): AuthSession | null {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    cachedAuthSessionRaw = null;
    cachedAuthSession = null;
    return null;
  }

  if (rawSession === cachedAuthSessionRaw) {
    return cachedAuthSession && cachedAuthSession.expiresAt > Date.now() ? cachedAuthSession : null;
  }

  try {
    const parsedSession: unknown = JSON.parse(rawSession);

    if (!isAuthSession(parsedSession)) {
      cachedAuthSessionRaw = rawSession;
      cachedAuthSession = null;
      return null;
    }

    if (parsedSession.expiresAt <= Date.now()) {
      cachedAuthSessionRaw = rawSession;
      cachedAuthSession = null;
      return null;
    }

    cachedAuthSessionRaw = rawSession;
    cachedAuthSession = parsedSession;
    return parsedSession;
  } catch {
    cachedAuthSessionRaw = rawSession;
    cachedAuthSession = null;
    return null;
  }
}

export function clearAuthSession() {
  getStorage()?.removeItem(AUTH_STORAGE_KEY);
  cachedAuthSessionRaw = null;
  cachedAuthSession = null;
  notifyAuthSessionChanged();
}

export function subscribeAuthSession(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_SESSION_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, onStoreChange);
  };
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function notifyAuthSessionChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

function getApiErrorMessage(payload: unknown, fallback: string) {
  const errors = getValidationErrors(payload);
  const firstValidationMessage = errors ? Object.values(errors).flat()[0] : null;

  if (firstValidationMessage) {
    return firstValidationMessage;
  }

  if (isRecord(payload) && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
}

function getStatusCode(payload: unknown, fallback: number) {
  if (isRecord(payload) && typeof payload.statusCode === "number") {
    return payload.statusCode;
  }

  return fallback;
}

function getValidationErrors(payload: unknown): Record<string, string[]> | undefined {
  if (!isRecord(payload) || !isRecord(payload.errors)) {
    return undefined;
  }

  const errors: Record<string, string[]> = {};

  for (const [field, value] of Object.entries(payload.errors)) {
    if (Array.isArray(value)) {
      errors[field] = value.filter((message): message is string => typeof message === "string");
    }
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

function getLoginResponseData(payload: unknown): LoginResponseData | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (isLoginResponseData(payload.responseData)) {
    return payload.responseData;
  }

  if (isLoginResponseData(payload.data)) {
    return payload.data;
  }

  if (isLoginResponseData(payload)) {
    return payload;
  }

  return null;
}

function isAuthSession(value: unknown): value is AuthSession {
  return (
    isRecord(value) &&
    typeof value.accessToken === "string" &&
    typeof value.refreshToken === "string" &&
    typeof value.expiresAt === "number" &&
    isPortalUser(value.user) &&
    isStringArray(value.roles) &&
    isBranchDetailsOrNull(value.branch)
  );
}

function isLoginResponseData(value: unknown): value is LoginResponseData {
  return (
    isRecord(value) &&
    typeof value.accessToken === "string" &&
    typeof value.refreshToken === "string" &&
    typeof value.expiresIn === "number" &&
    isPortalUser(value.user) &&
    isStringArray(value.roles) &&
    isBranchDetailsOrNull(value.branch)
  );
}

function isPortalUser(value: unknown): value is PortalUser {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    isNullableString(value.employeeId) &&
    isNullableString(value.pfNumber) &&
    isNullableString(value.name) &&
    isNullableString(value.email) &&
    isNullableString(value.mobile) &&
    isNullableString(value.status)
  );
}

function isBranchDetailsOrNull(value: unknown): value is BranchDetails | null {
  if (value === null) {
    return true;
  }

  return isRecord(value) && isNullableString(value.branchCode) && isNullableString(value.branchName);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
