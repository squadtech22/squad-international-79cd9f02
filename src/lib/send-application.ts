import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buildBody, sendEmail, type SendResult } from "./email";
import { site } from "./site-data";

/**
 * Delivers careers applications through Resend. Shares RESEND_API_KEY and
 * ENQUIRY_FROM with the contact form; CAREERS_TO optionally routes applications
 * to a different inbox than enquiries.
 *
 * No CV upload: Resend takes attachments as base64 in the request body, which
 * means holding the file in memory and policing size and type. Applicants link
 * to a CV or LinkedIn profile instead.
 */

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(60),
  role: z.string().trim().min(1).max(160),
  link: z.string().trim().max(400),
  message: z.string().trim().min(10, "Tell us a little about your experience").max(5000),
  /** Honeypot — see send-enquiry.ts for why this is validated leniently. */
  company_website: z.string().max(200),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const sendApplication = createServerFn({ method: "POST" })
  .validator((data: unknown) => applicationSchema.parse(data))
  .handler(async ({ data }): Promise<SendResult> => {
    if (data.company_website) return { ok: true };

    const to = process.env["CAREERS_TO"] ?? site.careersEmail;

    const { text, html } = buildBody(
      `New application — ${data.role}`,
      [
        ["Name", data.name],
        ["Email", data.email],
        ["Phone", data.phone || "—"],
        ["Role", data.role],
        ["CV / profile", data.link || "—"],
      ],
      { label: "About the applicant", text: data.message },
    );

    return sendEmail({
      to,
      replyTo: data.email,
      subject: `Application — ${data.role} (${data.name})`,
      text,
      html,
      context: "application",
    });
  });
