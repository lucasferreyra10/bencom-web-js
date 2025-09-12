// pages/api/send-email.js
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  EMAIL_TO,
} = process.env;

function validateEmail(email) {
  return typeof email === "string" && /\S+@\S+\.\S+/.test(email);
}

function escapeHtml(unsafe = "") {
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name = "", email = "", subject = "", message = "" } = req.body || {};

    // Validación mínima
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }
    if (!message || message.trim().length < 2) {
      return res.status(400).json({ error: "El mensaje es muy corto" });
    }

    let transporter;
    let usingTestAccount = false;

    // Si no hay SMTP configurado, usar cuenta de prueba (Ethereal) en dev
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      usingTestAccount = true;
      console.warn("Usando cuenta de prueba Nodemailer (test account).");
    } else {
      const port = parseInt(SMTP_PORT || "587", 10);
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465, // true si 465
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });
    }

    const subjectFinal = subject && subject.trim().length ? subject.trim() : "Consulta desde web";

    const textBody = `Nombre: ${name}\nEmail: ${email}\n\n${message}`;
    const htmlBody = `
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr/>
      <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
    `;

    const mailOptions = {
      from: EMAIL_FROM || SMTP_USER || "no-reply@example.com",
      to: EMAIL_TO || "mantenimiento@bencom.com.ar",
      subject: subjectFinal,
      text: textBody,
      html: htmlBody,
      replyTo: email,
    };

    const info = await transporter.sendMail(mailOptions);

    // Si usamos test account, devolver preview URL para ver el correo en Ethereal
    let previewUrl = null;
    if (usingTestAccount) {
      previewUrl = nodemailer.getTestMessageUrl(info) || null;
    }

    return res.status(200).json({ ok: true, messageId: info.messageId, previewUrl });
  } catch (err) {
    console.error("Error sending mail:", err?.response || err);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
}
