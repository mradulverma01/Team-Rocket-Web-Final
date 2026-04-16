"use client";

import { useState } from "react";

type SubmissionConfirmationProps = {
  referenceId: string;
  submittedAt: string;
  automationConfigured: boolean;
  title?: string;
};

export function SubmissionConfirmation({
  referenceId,
  submittedAt,
  automationConfigured,
  title = "We received your message",
}: SubmissionConfirmationProps) {
  const [copied, setCopied] = useState(false);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const formatted = new Date(submittedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      aria-live="polite"
      className="mt-6 rounded-xl border border-[color:var(--secondary)]/40 bg-[color:var(--secondary)]/10 p-6"
      role="status"
    >
      <p className="font-heading text-lg font-semibold text-[color:var(--text-dark)]">
        {title}
      </p>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        Save your reference number if you need to follow up with the hospital desk.
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <dt className="font-medium text-[color:var(--text-dark)]">
            Reference
          </dt>
          <dd className="font-mono text-[color:var(--text-dark)]">
            {referenceId}
          </dd>
          <button
            className="rounded-lg border border-[color:var(--surface-border)] bg-white px-3 py-1 text-xs font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--surface)]"
            onClick={() => void copyReference()}
            type="button"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div>
          <dt className="sr-only">Submitted at</dt>
          <dd className="text-[color:var(--muted)]">Submitted {formatted}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-[color:var(--muted)]">
        {automationConfigured
          ? "A confirmation email or message may arrive shortly, depending on your channel and hospital policy."
          : "Staff will respond using the contact details you provided. Automation is not configured in this environment."}
      </p>
    </div>
  );
}
