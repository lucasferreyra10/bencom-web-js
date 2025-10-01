// lib/wa.js
export function normalizePhoneForWa(number) {
  if (!number) return "";
  return String(number).replace(/[^\d]/g, "");
}

export function getWhatsAppNumber(fallback = "+5491127797320") {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) {
    return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  }
  return fallback;
}

/**
 * waLink(number?, text?)
 * - number: opcional, si no se pasa usa NEXT_PUBLIC_WHATSAPP_NUMBER o fallback
 * - text: opcional, texto a incluir en ?text=
 */
export function waLink(number, text = "") {
  const raw = number || getWhatsAppNumber();
  const digits = normalizePhoneForWa(raw);
  if (!digits) return "https://wa.me/+5491127797320";
  const base = `https://wa.me/${digits}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
