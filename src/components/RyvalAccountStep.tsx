import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { fill } from "@/translations/account";
import {
  NotAPlayer,
  RYVAL_LEGAL_URL,
  type RyvalSession,
  confirmSignUp,
  isAlreadyRegistered,
  isEmail,
  isUnconfirmed,
  isWrongPassword,
  passwordProblems,
  resendCode,
  signIn,
  signUp,
} from "@/lib/ryval";

type Mode = "create" | "signin" | "code";

interface Props {
  session: RyvalSession | null;
  onSession: (session: RyvalSession | null, fullName?: string) => void;
}

/**
 * Top of the form: the player creates their Ryval account (name, email,
 * password, then the 6-digit code Cognito emails), or signs in to the one
 * they have. The rest of the form opens once this is done.
 */
export const RyvalAccountStep = ({ session, onSession }: Props) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (mode !== "code" || now >= resendAt) return;
    const id = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(id);
  }, [mode, now, resendAt]);

  const message = (err: unknown) => {
    if (err instanceof NotAPlayer) return t("account.notPlayer");
    return err instanceof Error ? err.message : String(err);
  };

  const finish = async () => {
    const s = await signIn(email, password);
    onSession(s, name.trim() || s.fullName || "");
  };

  const toCode = async (sendNew: boolean) => {
    if (sendNew) await resendCode(email);
    setCode("");
    setMode("code");
    setResendAt(Date.now() + 30_000);
    setNow(Date.now());
  };

  const run = (fn: () => Promise<void>) => async (e?: FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  };

  const onCreate = run(async () => {
    if (!name.trim()) throw new Error(t("account.errName"));
    if (!isEmail(email)) throw new Error(t("account.errEmail"));
    if (passwordProblems(password).length) throw new Error(t("account.errPassword"));
    try {
      await signUp(name, email, password);
      await toCode(false);
    } catch (err) {
      if (!isAlreadyRegistered(err)) throw err;
      // The email is already on Ryval: the same password signs them in.
      try {
        await finish();
      } catch (loginErr) {
        if (isUnconfirmed(loginErr)) return toCode(true);
        if (isWrongPassword(loginErr)) {
          setMode("signin");
          setPassword("");
          throw new Error(t("account.existingAccount"));
        }
        throw loginErr;
      }
    }
  });

  const onSignIn = run(async () => {
    if (!isEmail(email)) throw new Error(t("account.errEmail"));
    if (!password) throw new Error(t("account.errPassword"));
    try {
      await finish();
    } catch (err) {
      if (isUnconfirmed(err)) return toCode(true);
      throw err;
    }
  });

  const onVerify = run(async () => {
    if (!/^\d{6}$/.test(code.trim())) throw new Error(t("account.errCode"));
    await confirmSignUp(email, code);
    await finish();
  });

  const onResend = run(async () => {
    await toCode(true);
    setInfo(t("account.codeResent"));
  });

  const reset = () => {
    onSession(null);
    setMode("create");
    setPassword("");
    setCode("");
    setError(null);
    setInfo(null);
  };

  if (session) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">{fill(t("account.ready"), { email: session.email })}</p>
            <p className="text-sm text-muted-foreground">{t("account.readyHint")}</p>
          </div>
        </div>
        <button type="button" onClick={reset} className="text-sm font-medium text-primary hover:underline">
          {t("account.notYou")}
        </button>
      </div>
    );
  }

  const passwordField = (label: string, autoComplete: string) => (
    <div className="space-y-2">
      <Label htmlFor="ryval-password">{label} *</Label>
      <div className="relative">
        <Input
          id="ryval-password"
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 md:p-6">
      <h3 className="text-xl font-bold text-foreground">{mode === "signin" ? t("account.signIn") : t("account.title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("account.subtitle")}</p>

      {mode === "code" ? (
        <form onSubmit={onVerify} className="mt-5 space-y-4" noValidate>
          <div>
            <p className="font-semibold text-foreground">{t("account.codeTitle")}</p>
            <p className="text-sm text-muted-foreground">{fill(t("account.codeSent"), { email: email.trim() })}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ryval-code">{t("account.codeLabel")}</Label>
            <Input
              id="ryval-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="max-w-[12rem] text-center text-lg tracking-[0.4em]"
              autoFocus
            />
          </div>
          <Button type="submit" disabled={busy} className="h-11 w-full font-bold sm:w-auto">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {busy ? t("account.verifying") : t("account.verify")}
          </Button>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <button
              type="button"
              onClick={() => onResend()}
              disabled={busy || now < resendAt}
              className="font-medium text-primary hover:underline disabled:cursor-default disabled:text-muted-foreground disabled:no-underline"
            >
              {now < resendAt
                ? fill(t("account.resendIn"), { s: Math.ceil((resendAt - now) / 1000) })
                : t("account.resend")}
            </button>
            <button type="button" onClick={reset} className="font-medium text-muted-foreground hover:text-foreground">
              {t("account.useAnother")}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={mode === "create" ? onCreate : onSignIn} className="mt-5 space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mode === "create" ? (
              <div className="space-y-2">
                <Label htmlFor="ryval-name">{t("form.fullName")} *</Label>
                <Input
                  id="ryval-name"
                  autoComplete="name"
                  placeholder={t("form.fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="ryval-email">{t("form.email")} *</Label>
              <Input
                id="ryval-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder={t("form.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mode === "create"
              ? passwordField(t("account.password"), "new-password")
              : passwordField(t("account.passwordSignIn"), "current-password")}
          </div>
          {mode === "create" ? <p className="text-xs text-muted-foreground">{t("account.passwordHint")}</p> : null}

          <Button type="submit" disabled={busy} className="h-11 w-full font-bold sm:w-auto">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === "create"
              ? busy ? t("account.creating") : t("account.create")
              : busy ? t("account.signingIn") : t("account.signIn")}
          </Button>

          <p className="text-sm text-muted-foreground">
            {mode === "create" ? t("account.haveAccount") : t("account.newHere")}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "create" ? "signin" : "create");
                setError(null);
              }}
              className="font-medium text-primary hover:underline"
            >
              {mode === "create" ? t("account.signIn") : t("account.createLink")}
            </button>
          </p>
          {mode === "create" ? (
            <p className="text-xs text-muted-foreground">
              {t("account.terms")}{" "}
              <a href={RYVAL_LEGAL_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {t("account.termsLink")}
              </a>
              .
            </p>
          ) : null}
        </form>
      )}

      {error ? (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {info ? <p className="mt-4 text-sm text-primary">{info}</p> : null}
    </div>
  );
};
