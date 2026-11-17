import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { disciplines, ui } from "@/components/mads/copy";
import { useLang } from "@/components/mads/language";
import { Button } from "@/components/ui/button";

const TO = "mads@madsgallery.art";
const SUBJECT = "M.A.D.S. TRIENNALE 2027–2029 | Artist Advisory — Programme Request";

type Status = "idle" | "ready" | "error";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  website: string;
  discipline: string;
};

type MailLinks = {
  mailto: string;
  gmail: string;
  outlook: string;
};

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || /\s/.test(url.hostname)) {
    throw new Error("invalid");
  }
  return url.href;
}

function requestText(fields: Fields, website: string) {
  return [
    "Request for the complete TRIENNALE PROJECT 2027–2029 programme",
    "",
    `First name: ${fields.firstName}`,
    `Last name: ${fields.lastName}`,
    `Email: ${fields.email}`,
    `Website / Portfolio: ${website || "Not provided"}`,
    `Artistic discipline: ${fields.discipline}`,
    "Consent to be contacted: Yes",
    "",
    "Please contact me with further information about the M.A.D.S. Artist Advisory Project.",
  ].join("\n");
}

function mailLinks(body: string): MailLinks {
  const subject = encodeURIComponent(SUBJECT);
  const encoded = encodeURIComponent(body);
  const to = encodeURIComponent(TO);
  return {
    mailto: `mailto:${TO}?subject=${subject}&body=${encoded}`,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${encoded}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${encoded}`,
  };
}

function openMail(href: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  if (href.startsWith("mailto:")) {
    anchor.target = "_self";
  } else {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function RequestForm() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState("");
  const [links, setLinks] = useState<MailLinks | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWebsiteError("");
    setCopied(false);
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields: Fields = {
      firstName: String(data.get("firstName") || "").trim(),
      lastName: String(data.get("lastName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      website: String(data.get("website") || "").trim(),
      discipline: String(data.get("discipline") || "").trim(),
    };
    const consent = data.get("consent") === "yes";
    if (!fields.firstName || !fields.lastName || !fields.email || !fields.discipline || !consent) {
      setNotice(t(ui.required));
      setStatus("error");
      return;
    }
    let website = "";
    if (fields.website) {
      try {
        website = normalizeWebsite(fields.website);
      } catch {
        setWebsiteError(t(ui.websiteError));
        return;
      }
    }
    const body = requestText(fields, website);
    setDraft(body);
    if (String(data.get("company") || "").trim()) {
      setLinks(null);
      setStatus("ready");
      form.reset();
      return;
    }
    const next = mailLinks(body);
    setLinks(next);
    setStatus("ready");
    setNotice("");
    form.reset();
    openMail(next.mailto);
  }

  async function copyRequest() {
    if (!draft) return;
    await navigator.clipboard.writeText(draft);
    setCopied(true);
  }

  if (status === "ready" && links) {
    return (
      <div className="dossier flex min-h-80 flex-col justify-between gap-8 p-6 sm:p-8">
        <div>
          <div className="mb-6 grid size-12 place-items-center rounded-full bg-aqua text-ink">
            <Check aria-hidden="true" />
          </div>
          <h3 className="display text-4xl text-paper sm:text-5xl">{t(ui.sentTitle)}</h3>
          <p className="mt-4 max-w-md text-paper/75">{t(ui.sentBody)}</p>
        </div>
        <div className="grid gap-3">
          <Button onClick={() => openMail(links.mailto)}>{t(ui.openAgain)}</Button>
          <Button asChild variant="secondary">
            <a href={links.gmail} target="_blank" rel="noreferrer">
              {t(ui.gmail)}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={links.outlook} target="_blank" rel="noreferrer">
              {t(ui.outlook)}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" className="justify-start px-0" onClick={copyRequest}>
            {copied ? t(ui.copied) : t(ui.copy)}
          </Button>
          <Button variant="ghost" className="justify-start px-0" onClick={() => setStatus("idle")}>
            {t(ui.another)}
          </Button>
        </div>
      </div>
    );
  }

  if (status === "ready") {
    return (
      <div className="dossier flex min-h-80 flex-col justify-between gap-8 p-6 sm:p-8">
        <div>
          <div className="mb-6 grid size-12 place-items-center rounded-full bg-aqua text-ink">
            <Check aria-hidden="true" />
          </div>
          <h3 className="display text-4xl text-paper sm:text-5xl">{t(ui.sentTitle)}</h3>
        </div>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          {t(ui.another)}
        </Button>
      </div>
    );
  }

  return (
    <form className="dossier relative grid gap-5 p-6 sm:p-8" onSubmit={onSubmit} noValidate>
      <label className="trap">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="kicker text-paper/70">{t(ui.first)} *</span>
          <input className="field" name="firstName" autoComplete="given-name" maxLength={90} required />
        </label>
        <label className="grid gap-2">
          <span className="kicker text-paper/70">{t(ui.last)} *</span>
          <input className="field" name="lastName" autoComplete="family-name" maxLength={90} required />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="kicker text-paper/70">{t(ui.email)} *</span>
        <input className="field" name="email" type="email" autoComplete="email" maxLength={160} required />
      </label>
      <label className="grid gap-2">
        <span className="kicker text-paper/70">{t(ui.website)}</span>
        <input
          className="field"
          name="website"
          inputMode="url"
          autoComplete="url"
          maxLength={300}
          placeholder="artist.com"
          aria-describedby="website-hint"
          onChange={() => setWebsiteError("")}
        />
        <small id="website-hint" className={websiteError ? "text-pink" : "text-paper/55"}>
          {websiteError || t(ui.websiteHint)}
        </small>
      </label>
      <label className="grid gap-2">
        <span className="kicker text-paper/70">{t(ui.discipline)} *</span>
        <select className="field" name="discipline" defaultValue="" required>
          <option value="" disabled>
            {t(ui.selectDiscipline)}
          </option>
          {disciplines.map((item) => (
            <option key={item.en} value={item.en}>
              {t(item)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-h-11 items-start gap-3 text-sm leading-snug text-paper/80">
        <input className="mt-1 size-4 accent-pink" name="consent" type="checkbox" value="yes" required />
        <span>{t(ui.consent)} *</span>
      </label>
      <Button type="submit">
        {t(ui.send)}
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Button>
      <p className="text-sm text-paper/70" role="status" aria-live="polite">
        {notice}
      </p>
      <p className="text-sm text-paper/55">{t(ui.fine)}</p>
    </form>
  );
}
