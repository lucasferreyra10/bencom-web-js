// pages/nosotros.js
import Layout from "../components/Layout";
import { waLink } from "../lib/wa";

export default function Nosotros() {
  return (
    <Layout>
      <section className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-title mb-2">Nosotros</h2>
          <p className="text-lg mb-4">
            Somos <strong>Seona Deco</strong>, una propuesta dedicada a la
            decoración y aromatización de espacios. Nuestro catálogo reúne
            sahumerios, velas, difusores, jabones líquidos, aromatizantes y
            productos de decoración, pensados para aportar aroma, calidez y
            personalidad a cada ambiente.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Contact info card */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Nuestros contactos</h3>
              <dl className="space-y-3 text-lg">
                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl text-primary">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .2 5.3.2 11.86c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.83 11.83 0 005.66 1.44h.01c6.56 0 11.86-5.3 11.86-11.86 0-3.17-1.24-6.15-3.41-8.42zM12.06 21.5h-.01a9.6 9.6 0 01-4.9-1.34l-.35-.21-3.66.96.98-3.57-.23-.36a9.6 9.6 0 01-1.47-5.12c0-5.3 4.32-9.62 9.64-9.62 2.58 0 5 1 6.82 2.83a9.57 9.57 0 012.82 6.8c0 5.3-4.32 9.63-9.64 9.63z" />
                    </svg>
                  </span>
                  <div>
                    <dt className="font-medium">Teléfono</dt>
                    <dd>
                      <a
                        href={waLink()}
                        className="text-secondary underline break-all"
                        aria-label="Chat de WhatsApp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Chat de WhatsApp
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl text-primary">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M20 4H4C2.895 4 2 4.895 2 6v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <div>
                    <dt className="font-medium">Email</dt>
                    <dd>
                      <a
                        href="mailto:seonadeco@gmail.com"
                        className="text-secondary underline break-all"
                        aria-label="Enviar correo a Seona Deco"
                        rel="noopener noreferrer"
                      >
                        Nuestro correo
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl text-primary">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                    </svg>
                  </span>
                  <div>
                    <dt className="font-medium">Instagram</dt>
                    <dd>
                      <a
                        href="https://www.instagram.com/seona.deco/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary underline break-all"
                        aria-label="Abrir Instagram de Seona Deco"
                      >
                        Ver más novedades
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Contact form card (derecha) */}
            <div className="p-4 border rounded-lg flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-3">Envianos tu consulta</h3>
              {/* --- Formulario que usa /api/send-email --- */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const name = f.name.value.trim();
                  const email = f.email.value.trim();
                  const subject = f.subject.value.trim();
                  const message = f.message.value.trim();

                  // validación mínima en cliente
                  if (!email) {
                    alert("Por favor ingresá tu email.");
                    f.email.focus();
                    return;
                  }
                  if (!message) {
                    alert("Por favor ingresá un mensaje.");
                    f.message.focus();
                    return;
                  }

                  // UI: bloqueo botón
                  const btn = f.querySelector("button[type='submit']");
                  btn.disabled = true;
                  const original = btn.innerHTML;
                  btn.innerHTML = "Enviando...";

                  try {
                    const res = await fetch("/api/send-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name, email, subject, message }),
                    });

                    const data = await res.json();
                    if (!res.ok)
                      throw new Error(data?.error || "Error desconocido");

                    // success
                    alert(
                      "Mensaje enviado correctamente. Te responderemos pronto."
                    );
                    f.reset();
                  } catch (err) {
                    console.error(err);
                    alert(
                      "Ocurrió un error al enviar el mensaje. Intentá de nuevo más tarde."
                    );
                  } finally {
                    btn.disabled = false;
                    btn.innerHTML = original;
                  }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <label className="col-span-1 sm:col-span-1">
                  <span className="sr-only">Tu nombre</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </label>

                <label className="col-span-1 sm:col-span-1">
                  <span className="sr-only">Tu email</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="Tu email (requerido)"
                    className="w-full border rounded-md p-2 text-sm"
                    required
                  />
                </label>

                <label className="col-span-1 sm:col-span-2">
                  <span className="sr-only">Asunto</span>
                  <input
                    name="subject"
                    type="text"
                    placeholder="Asunto"
                    className="w-full border rounded-md p-2 text-sm"
                  />
                </label>

                <label className="col-span-1 sm:col-span-2">
                  <span className="sr-only">Mensaje</span>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tu mensaje"
                    className="w-full border rounded-md p-2 text-sm"
                    required
                  />
                </label>

                <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-secondary text-white text-sm"
                    aria-label="Enviar mensaje"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}