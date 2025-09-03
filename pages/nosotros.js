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
                  <span className="mr-3 text-2xl">📞</span>
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
                        11 2779-7320
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl">✉️</span>
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
                        mantenimiento@bencom.com.ar
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-center flex-wrap">
                  <span className="mr-3 text-2xl">📸</span>
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
                        @bencomsrl
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
