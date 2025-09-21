// components/CartDrawer.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "./CartProvider";

/**
 * CartDrawer: floating shopping cart drawer with editable quantity inputs
 */
export default function CartDrawer() {
  const { cart, updateQty, removeItem, clearCart, getTotal, getCount } = useCart();
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "" });

  // Evita mismatch SSR/CSR para el contador del badge
  const [mounted, setMounted] = useState(false);

  // local map of itemId -> string (the input value) so user can type freely
  const [qtyInput, setQtyInput] = useState({});

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const website = process.env.NEXT_PUBLIC_WEBSITE_URL || "";

  // marcar como montado en cliente (para evitar hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // sync qtyInput when cart changes (initial load and when items added/removed)
  useEffect(() => {
    const map = {};
    (cart.items || []).forEach((it) => {
      map[it.id] = String(it.quantity || 1);
    });
    setQtyInput((prev) => ({ ...map, ...prev })); // set baseline but keep any in-progress inputs
  }, [cart.items]);

  // When drawer opens/closes, toggle body class for other behaviors
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

  function buildWhatsappText() {
    const lines = [];
    lines.push("Nuevo pedido desde la web:");
    if (customer.name) lines.push(`Cliente: ${customer.name}`);
    if (customer.email) lines.push(`Email: ${customer.email}`);
    lines.push("");
    lines.push("Productos:");
    cart.items.forEach((it) => {
      lines.push(
        `- ${it.title} x${it.quantity} — $${(
          (Number(it.price) || 0) * Number(it.quantity)
        ).toFixed(2)}`
      );
    });
    lines.push("");
    lines.push(`Total: $${getTotal().toFixed(2)}`);
    if (website) {
      lines.push("");
      lines.push(`Pedido generado desde: ${website}`);
    }
    return lines.join("\n");
  }

  function openWhatsapp() {
    if (!whatsappNumber) {
      alert("Número de WhatsApp no configurado. Añadí NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local");
      return;
    }
    if (!cart.items.length) {
      alert("El carrito está vacío.");
      return;
    }
    const text = buildWhatsappText();
    const url = `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  // Handlers for direct input editing
  function handleQtyInputChange(id, value) {
    // Accept only digits and empty string; allow user to type freely
    const cleaned = value.replace(/[^\d]/g, "");
    setQtyInput((s) => ({ ...s, [id]: cleaned }));
  }

  function applyQtyFromInput(id) {
    const raw = qtyInput[id];
    const n = parseInt(raw, 10);
    if (Number.isNaN(n) || n < 1) {
      // normalize to 1 if invalid or empty
      updateQty(id, 1);
      setQtyInput((s) => ({ ...s, [id]: "1" }));
    } else {
      updateQty(id, n);
      setQtyInput((s) => ({ ...s, [id]: String(n) }));
    }
  }

  function handleQtyKeyDown(e, id) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      applyQtyFromInput(id);
    }
  }

  // Helpers for +/- buttons
  function decreaseQty(it) {
    const next = Math.max(1, (Number(it.quantity) || 1) - 1);
    updateQty(it.id, next);
    setQtyInput((s) => ({ ...s, [it.id]: String(next) }));
  }
  function increaseQty(it) {
    const next = (Number(it.quantity) || 1) + 1;
    updateQty(it.id, next);
    setQtyInput((s) => ({ ...s, [it.id]: String(next) }));
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
          aria-expanded={open}
          aria-controls="cart-drawer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="20" r="1" fill="currentColor"/>
            <circle cx="18" cy="20" r="1" fill="currentColor"/>
          </svg>
          <span className="text-sm font-medium">Carrito</span>

          {/* Render count only on client to avoid hydration mismatch */}
          <span
            className="inline-flex items-center justify-center w-6 h-6 text-xs bg-white text-green-700 rounded-full"
            aria-hidden={!mounted}
          >
            {mounted ? getCount() : ""}
          </span>
        </button>
      </div>

      {/* Drawer */}
      <div
        id="cart-drawer"
        className={`fixed top-0 right-0 h-full z-50 transform bg-white shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"} w-full sm:w-96`}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between flex-none">
            <h3 className="text-lg font-semibold">Tu carrito</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => clearCart()} className="text-sm text-red-600 hover:underline">Vaciar</button>
              <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-gray-600">✕</button>
            </div>
          </div>

          {/* Scrollable items */}
          <div className="p-4 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            {cart.items.length === 0 ? (
              <div className="text-sm text-gray-600">El carrito está vacío.</div>
            ) : (
              cart.items.map((it) => (
                <div key={it.id} className="flex items-start gap-3 py-3 border-b">
                  <img src={it.image} alt={it.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-sm text-gray-700">${it.price}</div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => decreaseQty(it)}
                        className="px-2 py-1 bg-gray-100 rounded"
                        aria-label={`Disminuir cantidad de ${it.title}`}
                      >
                        -
                      </button>

                      {/* Editable quantity input */}
                      <input
                        aria-label={`Cantidad de ${it.title}`}
                        className="w-16 text-center px-2 py-1 border rounded"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={qtyInput[it.id] ?? String(it.quantity || 1)}
                        onChange={(e) => handleQtyInputChange(it.id, e.target.value)}
                        onBlur={() => applyQtyFromInput(it.id)}
                        onKeyDown={(e) => handleQtyKeyDown(e, it.id)}
                      />

                      <button
                        onClick={() => increaseQty(it)}
                        className="px-2 py-1 bg-gray-100 rounded"
                        aria-label={`Aumentar cantidad de ${it.title}`}
                      >
                        +
                      </button>

                      <button onClick={() => removeItem(it.id)} className="ml-auto text-sm text-red-600">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="h-4" />
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex-none">
            <div className="mb-3">
              <label className="text-xs text-gray-600">Tu nombre</label>
              <input value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm" placeholder="Nombre" />
            </div>
            <div className="mb-3">
              <label className="text-xs text-gray-600">Tu email</label>
              <input value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))} className="w-full mt-1 p-2 border rounded text-sm" placeholder="email@ejemplo.com" type="email" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="font-semibold text-lg">${getTotal().toFixed(2)}</div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={openWhatsapp} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Enviar por WhatsApp</button>
                <button onClick={() => { clearCart(); setOpen(false); }} className="px-4 py-2 bg-gray-100 rounded">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
