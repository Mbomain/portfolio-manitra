import type { AuthProvider } from "react-admin";
import { API_URL } from "../config";
import { session } from "./session";

type Credentials = { username: string; password: string };
type AccessToken = { token: string; expiresAt: string };

const UNAUTHORIZED_STATUSES = new Set([401, 403]);

const requestToken = async ({ username, password }: Credentials): Promise<AccessToken> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Identifiant ou mot de passe incorrect");
  }
  return response.json();
};

export const authProvider: AuthProvider = {
  login: async (credentials: Credentials) => {
    const { token, expiresAt } = await requestToken(credentials);
    session.save({ username: credentials.username, token, expiresAt });
  },

  logout: async () => session.clear(),

  checkAuth: async () => {
    if (!session.current()) {
      throw new Error("Session expirée");
    }
  },

  checkError: async ({ status }: { status?: number }) => {
    if (status && UNAUTHORIZED_STATUSES.has(status)) {
      session.clear();
      throw new Error("Session expirée");
    }
  },

  getIdentity: async () => {
    const current = session.current();
    if (!current) {
      throw new Error("Non connecté");
    }
    return { id: current.username, fullName: current.username };
  },
};
