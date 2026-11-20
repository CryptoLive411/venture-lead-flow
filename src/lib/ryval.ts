// Ryval API client for the player form: the player's own Ryval account.
//
// The same public endpoints the Ryval web dashboard uses for sign-up
// (ryval-web src/lib/api.ts): /auth/signup → emailed 6-digit code →
// /auth/confirm-signup → /auth/login, then PATCH /profile/me and media uploads
// with the player's own token. Nothing here holds a secret.

export const RYVAL_API =
  (import.meta.env.VITE_RYVAL_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://api.ryvalsports.app";

export const RYVAL_APP_STORE_URL = "https://apps.apple.com/us/app/ryval-sports/id6767488189";
export const RYVAL_WEB_LOGIN_URL = "https://app.ryvalsports.app/login";
export const RYVAL_LEGAL_URL = "https://privacy-policy-ryval.vercel.app/";
export const ryvalProfileLink = (userId: string) => `https://api.ryvalsports.app/p/${userId}`;

export type RyvalSession = {
  idToken: string;
  refreshToken: string | null;
  sub: string;
  email: string;
  userId: string;
  fullName: string | null;
};

type Envelope<T> = { data?: T | null; error?: unknown; detail?: unknown };

/** Same rule as the Ryval app (password_checker.dart) and the Cognito pool. */
export function passwordProblems(password: string): string[] {
  const missing: string[] = [];
  if (password.length < 8) missing.push("length");
  if (!/[A-Z]/.test(password)) missing.push("upper");
  if (!/[a-z]/.test(password)) missing.push("lower");
  if (!/[0-9]/.test(password)) missing.push("digit");
  if (!/[^A-Za-z0-9]/.test(password)) missing.push("special");
  return missing;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function errorText(json: Envelope<unknown> | null, fallback: string): string {
  if (!json) return fallback;
  if (json.error) return String(json.error);
  const d = json.detail;
  if (typeof d === "string" && d.trim()) return d;
  if (Array.isArray(d) && d.length) {
    const first = d[0] as { msg?: string };
    if (first?.msg) return first.msg;
  }
  return fallback;
}

async function call<T>(
  path: string,
  init: RequestInit & { token?: string },
  fallback: string,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  let res: Response;
  try {
    res = await fetch(`${RYVAL_API}${path}`, { ...init, headers });
  } catch {
    throw new RyvalError("Could not reach Ryval. Check your connection and try again.", 0);
  }
  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    // fall through with json = null
  }
  if (!res.ok || !json || json.error || json.data === undefined || json.data === null) {
    throw new RyvalError(errorText(json, `${fallback} (HTTP ${res.status})`), res.status);
  }
  return json.data;
}

export class RyvalError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

/* ---------------- Account ---------------- */

/** A handle from the name, like the Ryval web sign-up does (Signup.tsx). */
export function suggestUsername(fullName: string, email: string): string {
  const fromName = fullName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const base =
    fromName.length >= 3 ? fromName : email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return (base || "player").slice(0, 20);
}

/**
 * A Ryval referral link (app.ryvalsports.app/r/<code>) opens this form with
 * ?ref=<code>&click_id=<uuid>. Sent with sign-up, Ryval credits the new player
 * to that agent. Malformed values are dropped: the API rejects a bad click id.
 */
export function referralFromUrl(search = typeof window === "undefined" ? "" : window.location.search) {
  const params = new URLSearchParams(search);
  const code = (params.get("ref") || "").trim().toLowerCase();
  const click = (params.get("click_id") || "").trim();
  return {
    ...(/^[a-z0-9][a-z0-9_-]{2,63}$/.test(code) ? { referral_code: code } : {}),
    ...(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(click) ? { click_id: click } : {}),
  };
}

/** Starts sign-up. Cognito emails the 6-digit code. */
export async function signUp(fullName: string, email: string, password: string): Promise<void> {
  const base = {
    email: email.trim(),
    password,
    full_name: fullName.trim(),
    role: "athlete",
    sport: "Soccer",
    ...referralFromUrl(),
  };
  let handle = suggestUsername(fullName, email);
  for (let attempt = 0; ; attempt++) {
    try {
      await call("/auth/signup", { method: "POST", body: JSON.stringify({ ...base, username: handle }) }, "Sign-up failed");
      return;
    } catch (err) {
      const taken = err instanceof Error && /username already exists/i.test(err.message);
      if (!taken || attempt >= 4) throw err;
      handle = `${suggestUsername(fullName, email).slice(0, 16)}${Math.floor(100 + Math.random() * 900)}`;
    }
  }
}

export const confirmSignUp = (email: string, code: string) =>
  call("/auth/confirm-signup", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), confirmation_code: code.trim() }),
  }, "That code did not work");

export const resendCode = (email: string) =>
  call("/auth/resend-confirmation-code", {
    method: "POST",
    body: JSON.stringify({ email: email.trim() }),
  }, "Could not send a new code");

type Tokens = { id_token: string; refresh_token?: string | null; sub: string };
type Me = { id: string; role: string; email?: string | null; full_name?: string | null };

/** Signs in and loads the account. Throws NotAPlayer for coach or club accounts. */
export async function signIn(email: string, password: string): Promise<RyvalSession> {
  const tokens = await call<Tokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  }, "Sign-in failed");
  const me = await call<Me>("/profile/me", { method: "GET", token: tokens.id_token }, "Could not load your account");
  if (me.role !== "athlete") throw new NotAPlayer(me.role);
  return {
    idToken: tokens.id_token,
    refreshToken: tokens.refresh_token ?? null,
    sub: tokens.sub,
    email: me.email || email.trim(),
    userId: me.id,
    fullName: me.full_name ?? null,
  };
}

export class NotAPlayer extends Error {
  constructor(readonly role: string) {
    super(`not-a-player:${role}`);
  }
}

export const isAlreadyRegistered = (e: unknown) =>
  e instanceof Error && /already exists/i.test(e.message) && !/username/i.test(e.message);
export const isUnconfirmed = (e: unknown) => e instanceof Error && /not confirmed/i.test(e.message);
export const isWrongPassword = (e: unknown) =>
  e instanceof Error && /incorrect username or password/i.test(e.message);

/** A call with the player's token; one refresh when the hour-long token ran out. */
async function authed<T>(session: RyvalSession, path: string, init: RequestInit, fallback: string): Promise<T> {
  try {
    return await call<T>(path, { ...init, token: session.idToken }, fallback);
  } catch (err) {
    if (!(err instanceof RyvalError) || err.status !== 401 || !session.refreshToken) throw err;
    const fresh = await call<Tokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ sub: session.sub, refresh_token: session.refreshToken }),
    }, "Your sign-in expired");
    session.idToken = fresh.id_token;
    return call<T>(path, { ...init, token: session.idToken }, fallback);
  }
}

/* ---------------- Profile ---------------- */

export const updateProfile = (session: RyvalSession, patch: Record<string, unknown>) =>
  authed(session, "/profile/me", { method: "PATCH", body: JSON.stringify(patch) }, "Could not save your profile");

/** Photo: multipart through the API, as the app does. */
export async function uploadPhoto(session: RyvalSession, file: File): Promise<string> {
  const form = new FormData();
  form.append("kind", "image");
  form.append("file", file, file.name || "photo.jpg");
  const out = await authed<{ media_id: string }>(session, "/media/upload", { method: "POST", body: form }, "Photo upload failed");
  return out.media_id;
}

export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

/**
 * Highlight video: straight to S3 (POST /media/upload/init → PUT → confirm).
 * Video bytes never go through the API.
 */
export async function uploadVideo(
  session: RyvalSession,
  file: File,
  onProgress?: (fraction: number) => void,
): Promise<string> {
  if (file.size > MAX_VIDEO_BYTES) throw new RyvalError("too-large", 413);
  const contentType = file.type && file.type.startsWith("video/") ? file.type : "video/mp4";
  const init = await authed<{ media_id: string; upload_url: string; content_type?: string }>(
    session,
    "/media/upload/init",
    {
      method: "POST",
      body: JSON.stringify({
        filename: file.name || "highlight.mp4",
        content_type: contentType,
        kind: "video",
        size_bytes: file.size,
      }),
    },
    "Could not start the video upload",
  );
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", init.upload_url);
    // Must match the content type signed into the URL.
    xhr.setRequestHeader("Content-Type", init.content_type || contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new RyvalError(`Video upload failed (HTTP ${xhr.status})`, xhr.status));
    xhr.onerror = () => reject(new RyvalError("Video upload failed. Check your connection.", 0));
    xhr.send(file);
  });
  await authed(session, `/media/confirm/${init.media_id}`, { method: "POST" }, "Could not finish the video upload");
  return init.media_id;
}

/* ---------------- Form answers → Ryval profile ---------------- */

/** The app's position values (ryval-web AthleteFlow POSITION_GROUPS), with English labels for Pipedrive. */
export const POSITIONS: [value: string, english: string][] = [
  ["Goalkeeper", "Goalkeeper"],
  ["Center Back", "Center Back"],
  ["Full Back", "Full Back"],
  ["Right Back", "Right Back"],
  ["Left Back", "Left Back"],
  ["Right Wing Back", "Right Wing Back"],
  ["Left Wing Back", "Left Wing Back"],
  ["CDM", "Defensive Midfielder (CDM)"],
  ["CM", "Central Midfielder (CM)"],
  ["CAM", "Attacking Midfielder (CAM)"],
  ["Right Mid", "Right Midfielder"],
  ["Left Mid", "Left Midfielder"],
  ["Winger", "Winger"],
  ["Right Winger", "Right Winger"],
  ["Left Winger", "Left Winger"],
  ["Striker", "Striker"],
];

export const positionEnglish = (value: string) => POSITIONS.find(([v]) => v === value)?.[1] ?? value;

/** Which profile field a highlight link belongs in, or null when Ryval has no field for that site. */
export function highlightField(link: string): "youtube_url" | "veo_url" | "hudl_url" | null {
  let host = "";
  try {
    host = new URL(/^https?:\/\//i.test(link.trim()) ? link.trim() : `https://${link.trim()}`).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(host)) return "youtube_url";
  if (/(^|\.)veo\.co$/.test(host)) return "veo_url";
  if (/(^|\.)hudl\.com$/.test(host)) return "hudl_url";
  return null;
}

const normalizeLink = (link: string) => (/^https?:\/\//i.test(link.trim()) ? link.trim() : `https://${link.trim()}`);

// Divisions and leagues are checked by position in the list (the labels are
// translated), mapped to the app's preferred levels.
const DIVISION_LEVELS: (string | null)[] = ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "JUCO", "JUCO", null];
const LEAGUE_LEVELS: (string | null)[] = [null, "NAIA", "JUCO", "JUCO", null];

export type FormAnswers = {
  phoneNumber: string;
  currentClub: string;
  position: string;
  nationality: string;
  highschoolGPA: string;
  highschoolGradYear: string;
  preferredDivisionIndexes: number[];
  preferredLeagueIndexes: number[];
  highlightsLink?: string;
};

/** The PATCH /profile/me body for the form, same fields as the web onboarding. Blank answers are left out. */
export function profilePatch(a: FormAnswers): Record<string, unknown> {
  const patch: Record<string, unknown> = { sport: "Soccer" };
  const put = (k: string, v: unknown) => {
    if (v !== undefined && v !== null && v !== "") patch[k] = v;
  };
  put("phone_number", a.phoneNumber.trim().slice(0, 40));
  put("club_team", a.currentClub.trim().slice(0, 160));
  if (POSITIONS.some(([v]) => v === a.position)) put("position", a.position);
  put("nationality", a.nationality.trim().slice(0, 80));

  const gpa = Number(a.highschoolGPA.trim().replace(",", "."));
  // Same rule as the Ryval onboarding: up to 5 (weighted) on the 4.0 scale.
  // Other scales (e.g. 15/20) stay in Pipedrive only.
  if (Number.isFinite(gpa) && gpa > 0 && gpa <= 5) {
    put("gpa", gpa);
    put("gpa_value", gpa);
    put("gpa_scale", "4.0");
  }

  const year = a.highschoolGradYear.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year && +year >= 1990 && +year <= 2040) put("graduation_year", +year);

  const levels = new Set<string>();
  a.preferredDivisionIndexes.forEach((i) => DIVISION_LEVELS[i] && levels.add(DIVISION_LEVELS[i]!));
  a.preferredLeagueIndexes.forEach((i) => LEAGUE_LEVELS[i] && levels.add(LEAGUE_LEVELS[i]!));
  if (levels.size) put("preferred_level", [...levels].join(", "));

  if (a.highlightsLink?.trim()) {
    const field = highlightField(a.highlightsLink);
    if (field) put(field, normalizeLink(a.highlightsLink).slice(0, 500));
  }
  return patch;
}
