// pages/nosotros.js
import Layout from "../components/Layout";

export default function Nosotros() {
  return (
    <Layout>
      <section className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-3xl font-title mb-2">Nosotros</h2>
          <p className="text-lg mb-4">
            Somos <strong>BENCOM S.R.L.</strong>, dedicados al mantenimiento
            integral y soluciones para empresas. Nos orientamos a ofrecer un
            servicio profesional, rápido y garantizado en CABA y AMBA.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Contact info card */}
            <div className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Nuestros contactos</h3>
              <dl className="space-y-3 text-lg">
                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl">
                    {" "}
                    <img
                      src="https://img.icons8.com/m_outlined/512/whatsapp--v2.png"
                      alt="WhatsApp"
                      className="w-5 h-5 filter invert object-contain"
                      width={20}
                      height={20}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <div>
                    <dt className="font-medium">Teléfono</dt>
                    <dd>
                      <a
                        href="https://wa.me/+5491127797320"
                        className="text-secondary underline break-all"
                        aria-label="Llamar al 11 2779 7320"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Chat de WhatsApp
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      fill="#2e358c"
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
                        href="mailto:mantenimiento@bencom.com.ar"
                        className="text-secondary underline break-all"
                        aria-label="Enviar correo a mantenimiento"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Nuestro correo
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl">
                    <svg
                      fill="none"
                      stroke="#2e358c"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect
                        width="20"
                        height="20"
                        x="2"
                        y="2"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                    </svg>
                  </span>
                  <div>
                    <dt className="font-medium">Instagram</dt>
                    <dd>
                      <a
                        href="https://instagram.com/bencomsrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary underline break-all"
                        aria-label="Abrir Instagram de bencomsrl"
                      >
                        Ver más novedades
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Quiénes somos / horario / ubicacion */}
            <div className="p-4 border rounded-lg flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-3">Medios de pago</h3>
              <ul className="list-inside list-disc space-y-2 text-lg">
                <li>Efectivo</li>
                <li>Transferencia</li>
                <li>Cuenta corriente</li>
              </ul>

              <div className="mt-4 flex-1" />

              <div>
                <a
                  href="mailto:mantenimiento@bencom.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 px-4 py-2 bg-secondary text-white rounded shadow hover:opacity-90"
                >
                  Enviar consulta
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
