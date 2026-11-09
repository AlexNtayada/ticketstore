import type { EventConfig } from "@/types/event";

interface NewsletterProps {
  config: NonNullable<EventConfig["newsletter"]>;
  labels: { title: string; email: string; submit: string };
}

/**
 * Premium newsletter capture. A plain HTML form posting to the organizer's
 * real provider endpoint (Mailchimp, Brevo, ...). It never fakes a success
 * state: the provider handles the response page.
 */
export function Newsletter({ config, labels }: NewsletterProps) {
  const field = config.emailFieldName ?? "email";
  return (
    <form action={config.actionUrl} method={config.method ?? "post"} className="grid gap-6 md:grid-cols-12 md:items-end">
      <h2 className="t-display-base t-sub md:col-span-4">{labels.title}</h2>
      <div className="md:col-span-5">
        <label htmlFor="newsletter-email" className="t-label mb-2 block text-muted">
          {labels.email}
        </label>
        <input
          id="newsletter-email"
          name={field}
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full border-b border-line bg-transparent text-lg outline-none focus:border-accent"
        />
        <p className="mt-3 text-xs text-muted">{config.consentText}</p>
      </div>
      <button type="submit" className="t-label h-12 rounded-full bg-fg px-6 text-bg md:col-span-3 md:justify-self-end">
        {labels.submit}
      </button>
    </form>
  );
}
