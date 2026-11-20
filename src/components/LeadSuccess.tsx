import { AlertTriangle, CheckCircle2, Globe, Smartphone } from "lucide-react";
import ryvalLogo from "@/assets/ryval-logo.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { fill } from "@/translations/account";
import { RYVAL_APP_STORE_URL, RYVAL_WEB_LOGIN_URL } from "@/lib/ryval";

interface Props {
  firstName: string;
  email: string;
  warnings: string[];
}

/** After submit: the rep will call, and the player's Ryval profile is ready in the app or on the web. */
export const LeadSuccess = ({ firstName, email, warnings }: Props) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-3">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h3 className="text-3xl font-bold text-foreground">{fill(t("account.successTitle"), { name: firstName })}</h3>
        <p className="mx-auto max-w-xl text-muted-foreground">{t("form.successMessage")}</p>
      </div>

      <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent-blue/10 to-primary/5 p-6 text-left md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/30 bg-black">
            <img src={ryvalLogo} alt="Ryval" className="h-full w-full object-contain" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground md:text-2xl">{t("account.appTitle")}</h4>
            <p className="mt-1 text-muted-foreground">{fill(t("account.appBody"), { email })}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={RYVAL_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-bold text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            <Smartphone className="h-5 w-5" />
            {t("account.appButton")}
          </a>
          <a
            href={RYVAL_WEB_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary/40 px-6 font-bold text-foreground transition hover:border-primary"
          >
            <Globe className="h-5 w-5" />
            {t("account.webButton")}
          </a>
        </div>
      </div>

      {warnings.length ? (
        <div className="space-y-2 text-left">
          {warnings.map((w) => (
            <p key={w} className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              {w}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};
