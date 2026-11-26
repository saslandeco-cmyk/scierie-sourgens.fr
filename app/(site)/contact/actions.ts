"use server";

import { Resend } from "resend";
import { z } from "zod";
import { INTEREST_OPTIONS } from "./constants";

const schema = z.object({
  lastName: z.string().min(1, "Le nom est requis."),
  firstName: z.string().optional(),
  company: z.string().optional(),
  email: z.string().email("Adresse email invalide."),
  address: z.string().min(1, "L'adresse postale est requise."),
  postalCity: z.string().min(1, "Le code postal et la ville sont requis."),
  phone: z.string().min(1, "Le numéro de téléphone est requis."),
  interest: z.enum(INTEREST_OPTIONS),
  message: z.string().optional(),
});

export type ContactFormState = { error?: string; success?: boolean };

function parseContactForm(formData: FormData) {
  return schema.safeParse({
    lastName: formData.get("lastName"),
    firstName: formData.get("firstName") || undefined,
    company: formData.get("company") || undefined,
    email: formData.get("email"),
    address: formData.get("address"),
    postalCity: formData.get("postalCity"),
    phone: formData.get("phone"),
    interest: formData.get("interest"),
    message: formData.get("message") || undefined,
  });
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  if (formData.get("rgpd") !== "on") {
    return { error: "Vous devez accepter la collecte de vos données pour envoyer ce message." };
  }

  const parsed = parseContactForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) {
    return { error: "Le formulaire de contact n'est pas encore configuré. Merci de nous appeler directement." };
  }

  const d = parsed.data;
  const lines = [
    `Nom : ${d.lastName}`,
    d.firstName && `Prénom : ${d.firstName}`,
    d.company && `Société : ${d.company}`,
    `Email : ${d.email}`,
    `Adresse postale : ${d.address}`,
    `Code postal et ville : ${d.postalCity}`,
    `Téléphone : ${d.phone}`,
    `Intéressé par : ${d.interest}`,
    d.message && `Message : ${d.message}`,
  ].filter(Boolean);

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "Scierie R. Sourgens <onboarding@resend.dev>",
      to,
      replyTo: d.email,
      subject: `Nouveau message de contact — ${d.lastName}${d.firstName ? ` ${d.firstName}` : ""}`,
      text: lines.join("\n"),
    });
    if (result.error) {
      return { error: "L'envoi du message a échoué. Merci de réessayer ou de nous appeler directement." };
    }
  } catch {
    return { error: "L'envoi du message a échoué. Merci de réessayer ou de nous appeler directement." };
  }

  return { success: true };
}
