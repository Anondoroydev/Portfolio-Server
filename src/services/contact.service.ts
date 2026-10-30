import { Resend } from "resend";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import type { ContactInput } from "../validation/contact.schema.js";
import { generateContactReply } from "./gemini.service.js";

const resend = new Resend(env.RESEND_API_KEY);
const fallbackReply =
  "Thank you for reaching out. I have received your message and will review it. I will get back to you as soon as possible.";

async function sendEmail(
  email: Parameters<typeof resend.emails.send>[0],
  label: string,
): Promise<boolean> {
  try {
    const { error } = await resend.emails.send(email);
    if (error) {
      console.error(`${label} email was rejected:`, error);
      return false;
    }
    return true;
  } catch (error: unknown) {
    console.error(`${label} email failed:`, error);
    return false;
  }
}

export async function createContactMessage(input: ContactInput) {
  const contact = await prisma.contactMessage.create({ data: input });

  let reply = fallbackReply;
  let aiReplyGenerated = false;

  try {
    reply = await generateContactReply(input);
    aiReplyGenerated = true;
  } catch (error: unknown) {
    console.error("Gemini contact reply generation failed; sending the fallback reply:", error);
  }

  const [notificationSent, autoReplySent] = await Promise.all([
    sendEmail({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      replyTo: input.email,
      subject: `Portfolio contact: ${input.subject}`,
      text: [
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Subject: ${input.subject}`,
        "",
        input.message,
      ].join("\n"),
    }, "Contact notification"),
    sendEmail({
      from: env.CONTACT_FROM_EMAIL,
      to: input.email,
      subject: `Re: ${input.subject}`,
      text: `Hi ${input.name},\n\n${reply}\n\nBest regards`,
    }, "Contact auto-reply"),
  ]);

  return { id: contact.id, notificationSent, autoReplySent, aiReplyGenerated };
}
