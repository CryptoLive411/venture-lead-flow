import { useEffect, useRef } from "react";
import { AlertTriangle, Check, CheckCircle2 } from "lucide-react";
import ryvalLogo from "@/assets/ryval-logo.jpg";
import appScores from "@/assets/ryval-app/app-scores.jpg";
import appMessages from "@/assets/ryval-app/app-messages.jpg";
// Apple's official "Download on the App Store" badge, unmodified (Apple's
// marketing guidelines: keep it as supplied, at least 40px tall).
import appStoreBadge from "@/assets/ryval-app/app-store-badge.svg";
import { useLanguage } from "@/contexts/LanguageContext";
import { fill } from "@/translations/account";
import { RYVAL_APP_STORE_URL, RYVAL_WEB_LOGIN_URL } from "@/lib/ryval";

interface Props {
  firstName: string;
  email: string;
  warnings: string[];
}

/** A phone-shaped frame around an App Store screenshot of the Ryval app. */
const Phone = ({ src, className }: { src: string; className: string }) => (
  <div className={`absolute overflow-hidden rounded-[1.6rem] border-[5px] border-neutral-900 bg-black shadow-2xl ring-1 ring-white/10 ${className}`}>
    <img src={src} alt="" className="block w-full" loading="lazy" />
  </div>
);

/** After submit: the rep will call, and the Ryval app comes free as a bonus. */
export const LeadSuccess = ({ firstName, email, warnings }: Props) => {
  const { t } = useLanguage();
  const points = [t("account.bonusGames"), t("account.bonusPlayers"), t("account.bonusRecruiting")];
  const top = useRef<HTMLDivElement>(null);

  // The form was long and this is short: bring the top of it into view.
  useEffect(() => {
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div ref={top} className="scroll-mt-28 space-y-8 text-center">
      <div className="space-y-3">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h3 className="text-3xl font-bold text-foreground">{fill(t("account.successTitle"), { name: firstName })}</h3>
        <p className="mx-auto max-w-xl text-muted-foreground">{t("form.successMessage")}</p>
      </div>

      <div className="overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent-blue/10 to-primary/5 text-start">
        <div className="grid items-center gap-8 p-6 md:grid-cols-[1.15fr_1fr] md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 py-1 pe-3 ps-1">
              <img src={ryvalLogo} alt="Ryval" className="h-6 w-6 rounded-full bg-black object-contain" />
              <span className="text-xs font-bold uppercase tracking-wide text-primary">{t("account.bonusEyebrow")}</span>
            </div>
            <h4 className="mt-4 text-2xl font-bold leading-tight text-foreground md:text-3xl">{t("account.bonusTitle")}</h4>
            <p className="mt-3 text-muted-foreground">{t("account.bonusIntro")}</p>
            <ul className="mt-4 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 font-semibold text-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <a
              href={RYVAL_APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block transition hover:opacity-85"
            >
              <img src={appStoreBadge} alt={t("account.appStoreAlt")} className="h-14 w-auto" />
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              {fill(t("account.bonusSignIn"), { email })}{" "}
              <a
                href={RYVAL_WEB_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {t("account.webLink")}
              </a>
            </p>
          </div>

          <div className="relative mx-auto aspect-[10/13] w-full max-w-[320px]" aria-hidden>
            <Phone src={appMessages} className="left-0 top-[7%] w-[52%] -rotate-6 opacity-90" />
            <Phone src={appScores} className="right-0 top-0 w-[58%] rotate-3" />
          </div>
        </div>
      </div>

      {warnings.length ? (
        <div className="space-y-2 text-start">
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
