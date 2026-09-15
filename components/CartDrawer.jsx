// components/CartDrawer.jsx
import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { useRouter } from "next/router";
import { waLink } from "../lib/wa";

export default function CartDrawer() {
  const router = useRouter();
  const isProducts =
    router?.pathname === "/productos" ||
    (router?.asPath && router.asPath.startsWith("/productos"));

  const { cart, updateQty, removeItem, clearCart, getTotal, getCount } =
    useCart();

  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [mounted, setMounted] = useState(false);
  const [qtyInput, setQtyInput] = useState({});

  const buttonRef = useRef(null);
  const rafRef = useRef(null);
  const [bottomOffset, setBottomOffset] = useState(24);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const map = {};
    (cart.items || []).forEach((it) => {
      map[it.id] = String(it.quantity || 1);
    });
    setQtyInput((prev) => ({ ...map, ...prev }));
  }, [cart.items]);

  useEffect(() => {
    const body = document.body;
    if (open) {
      body.classList.add("cart-open");
      if (window.innerWidth < 640) body.style.overflow = "hidden";
      else body.style.overflow = "";
    } else {
      body.classList.remove("cart-open");
      body.style.overflow = "";
    }
    return () => {
      body.classList.remove("cart-open");
      body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function update() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const spacing = 24;
        const footer = document.querySelector("footer");
        if (!footer || !buttonRef.current) {
          setBottomOffset(spacing);
          return;
        }
        const footerRect = footer.getBoundingClientRect();
        const overlap = Math.max(0, window.innerHeight - footerRect.top);
        const newBottom = overlap > 0 ? overlap + spacing : spacing;
        setBottomOffset((current) =>
          Math.abs(current - newBottom) > 1 ? newBottom : current,
        );
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let io = null;
    const footer = document.querySelector("footer");
    if (footer && "ResizeObserver" in window) {
      io = new ResizeObserver(update);
      io.observe(footer);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (io) io.disconnect();
    };
  }, []);

  const website = process.env.NEXT_PUBLIC_WEBSITE_URL || "";
  function buildWhatsappText() {
    const lines = [];
    lines.push("Nuevo pedido desde la web:");
    if (customer.name) lines.push(`Cliente: ${customer.name}`);
    if (customer.email) lines.push(`Email: ${customer.email}`);
    lines.push("");
    lines.push("Productos:");
    cart.items.forEach((it) => {
      // Título y cantidad
      const itemLine = `- ${it.title} x${it.quantity}`;

      // Agregar descripción si existe (limpiando HTML)
      const desc = it.description ? stripHTML(it.description) : "";

      // Precio
      const price = `$${((Number(it.price) || 0) * Number(it.quantity)).toFixed(2)}`;

      // Armar la línea completa
      if (desc) {
        lines.push(`${itemLine}`);
        lines.push(`  (${desc})`);
        lines.push(`  Subtotal: ${price}`);
      } else {
        lines.push(`${itemLine} — ${price}`);
      }
    });
    lines.push("");
    lines.push(`Total: $${getTotal().toFixed(2)}`);
    if (website) {
      lines.push("");
      lines.push(`Pedido generado desde: ${website}`);
    }
    return lines.join("\n");
  }

  function openWhatsappWithCart() {
    if (!cart.items || !cart.items.length) {
      alert("El carrito está vacío.");
      return;
    }

    // Disclaimer antes de enviar
    const confirmacion = window.confirm(
      "Al enviar tu pedido por WhatsApp, el carrito se vaciará automáticamente.\n\n¿Deseas continuar?",
    );

    if (!confirmacion) {
      return; // El usuario canceló
    }

    // Construir mensaje y abrir WhatsApp
    const text = buildWhatsappText();
    const url = waLink(null, text);
    window.open(url, "_blank");

    // Vaciar carrito automáticamente
    clearCart();

    // Resetear campos del formulario
    setCustomer({ name: "", email: "" });

    // Cerrar el drawer (opcional, puedes comentar esta línea si prefieres dejarlo abierto)
    setOpen(false);
  }

  function handleQtyInputChange(id, value) {
    const cleaned = value.replace(/[^\d]/g, "");
    setQtyInput((s) => ({ ...s, [id]: cleaned }));
  }
  function applyQtyFromInput(id) {
    const raw = qtyInput[id];
    const n = parseInt(raw, 10);

    // Buscar el item para obtener su stock
    const item = cart.items.find((i) => i.id === id);
    const itemStock = item ? Number(item.stock) || Infinity : Infinity;

    if (Number.isNaN(n) || n < 1) {
      updateQty(id, 1);
      setQtyInput((s) => ({ ...s, [id]: "1" }));
    } else {
      // Limitar al stock disponible
      const clamped = Math.min(n, itemStock);
      updateQty(id, clamped);
      setQtyInput((s) => ({ ...s, [id]: String(clamped) }));
    }
  }
  function handleQtyKeyDown(e, id) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      applyQtyFromInput(id);
    }
  }
  function decreaseQty(it) {
    const next = Math.max(1, (Number(it.quantity) || 1) - 1);
    updateQty(it.id, next);
    setQtyInput((s) => ({ ...s, [it.id]: String(next) }));
  }
  function increaseQty(it) {
    const currentQty = Number(it.quantity) || 1;
    const itemStock = Number(it.stock) || Infinity; // Si no hay stock definido, sin límite

    // Solo incrementar si no supera el stock
    if (currentQty < itemStock) {
      const next = currentQty + 1;
      updateQty(it.id, next);
      setQtyInput((s) => ({ ...s, [it.id]: String(next) }));
    }
  }

  // Helper para obtener la imagen del producto
  function getProductImage(item) {
    // Si tiene array de images, tomar la primera
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
    // Si tiene image directo
    if (item.image) {
      return item.image;
    }
    // Fallback a una imagen por defecto
    return "/placeholder.jpg";
  }

  // Helper para limpiar HTML de la descripción
  function stripHTML(html) {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const FloatingButton = (
    <div
      ref={buttonRef}
      style={{ bottom: `${bottomOffset}px`, right: "1.5rem" }}
      className="fixed z-50"
    >
      {isProducts ? (
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
          aria-expanded={open}
          aria-controls="cart-drawer"
          aria-label="Abrir carrito"
        >
          <span className="text-sm font-medium">Carrito</span>
          <span
            className="inline-flex items-center justify-center w-6 h-6 text-xs bg-white text-green-700 rounded-full ml-1"
            aria-hidden={!mounted}
          >
            {mounted ? getCount() : ""}
          </span>
        </button>
      ) : (
        <a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
          aria-label="Contactar por WhatsApp"
        >
          <img
            src="/icons/NUEVOS ICONOS BENCOM-12.svg"
            alt="WhatsApp"
            width={22}
            height={22}
            className="mr-2"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          WhatsApp
        </a>
      )}
    </div>
  );

  return (
    <>
      {FloatingButton}

      {isProducts && (
        <div
          id="cart-drawer"
          className={`fixed top-0 right-0 h-full z-50 transform bg-white shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          } w-full sm:w-96`}
          aria-hidden={!open}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between flex-none">
              <h3 className="text-lg font-semibold">Tu carrito</h3>
              <div className="flex items-center gap-2">
                {cart.items.length > 0 && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro que deseas vaciar el carrito?",
                        )
                      ) {
                        clearCart();
                      }
                    }}
                    className="text-sm text-red-600"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Items */}
            <div
              className="p-4 overflow-y-auto"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {cart.items.length === 0 ? (
                <div className="text-sm text-gray-600">
                  El carrito está vacío.
                </div>
              ) : (
                cart.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-start gap-3 py-3 border-b"
                  >
                    {/* Imagen del producto */}
                    <img
                      src={getProductImage(it)}
                      alt={it.title}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {/* Título */}
                          <div className="font-medium text-sm leading-tight">
                            {it.title}
                          </div>
                          {/* Descripción en gris */}
                          {it.description && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {stripHTML(it.description)}
                            </div>
                          )}
                        </div>
                        {/* Precio */}
                        <div className="text-sm text-gray-700 font-medium flex-shrink-0">
                          ${it.price}
                        </div>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => decreaseQty(it)}
                          className="px-2 py-1 bg-gray-100 rounded text-sm"
                          aria-label={`Disminuir cantidad de ${it.title}`}
                        >
                          -
                        </button>

                        <input
                          aria-label={`Cantidad de ${it.title}`}
                          className="w-12 text-center px-1 py-1 border rounded text-sm"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={qtyInput[it.id] ?? String(it.quantity || 1)}
                          onChange={(e) =>
                            handleQtyInputChange(it.id, e.target.value)
                          }
                          onBlur={() => applyQtyFromInput(it.id)}
                          onKeyDown={(e) => handleQtyKeyDown(e, it.id)}
                        />

                        <button
                          onClick={() => increaseQty(it)}
                          className="px-2 py-1 bg-gray-100 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Aumentar cantidad de ${it.title}`}
                          disabled={
                            it.stock !== undefined &&
                            it.stock !== null &&
                            it.quantity >= it.stock
                          }
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="ml-auto text-xs text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="h-4" />
            </div>

            {/* Footer form */}
            <div className="p-4 border-t flex-none">
              <div className="mb-3">
                <label className="text-xs text-gray-600">Tu nombre</label>
                <input
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, name: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded text-sm"
                  placeholder="Nombre"
                />
              </div>
              <div className="mb-3">
                <label className="text-xs text-gray-600">Tu email</label>
                <input
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, email: e.target.value }))
                  }
                  className="w-full mt-1 p-2 border rounded text-sm"
                  placeholder="email@ejemplo.com"
                  type="email"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="font-semibold text-lg">
                    ${getTotal().toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={openWhatsappWithCart}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Enviar por WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      clearCart();
                      setOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-100 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
