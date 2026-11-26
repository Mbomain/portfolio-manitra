const STORAGE_KEY = "portfolio-admin-session";

export type Session = {
  username: string;
  token: string;
  expiresAt: string;
};

const isExpired = ({ expiresAt }: Session, now: Date) => new Date(expiresAt) <= now;

const read = (): Session | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? (JSON.parse(stored) as Session) : null;
};

export const session = {
  save: (value: Session) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),

  clear: () => localStorage.removeItem(STORAGE_KEY),

  /** The current session, or null once it has expired. */
  current: (now = new Date()): Session | null => {
    const stored = read();
    return stored && !isExpired(stored, now) ? stored : null;
  },
};
