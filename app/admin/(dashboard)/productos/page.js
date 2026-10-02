"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/supabase/storage";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [["bold", "italic", "underline"], ["clean"]],
};

export default function ProductosAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("todos"); // 'todos', 'visibles', 'ocultos'

  // null = list view, {} = new product, {...product} = edit product
  const [editingProduct, setEditingProduct] = useState(null);

  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("order_index", { ascending: true });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      fetchProducts();
    } else {
      alert("Error eliminando: " + error.message);
    }
  };

  const handleToggleVisibility = async (id, currentHidden) => {
    const newHidden = !currentHidden;
    // Optimistic update
    setProducts(
      products.map((p) => (p.id === id ? { ...p, is_hidden: newHidden } : p)),
    );
    const { error } = await supabase
      .from("products")
      .update({ is_hidden: newHidden })
      .eq("id", id);
    if (error) {
      // revert on error
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, is_hidden: currentHidden } : p,
        ),
      );
      alert("Error actualizando visibilidad: " + error.message);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      const newProducts = arrayMove(products, oldIndex, newIndex);

      const updatedProducts = newProducts.map((p, index) => ({
        ...p,
        order_index: index + 1,
      }));
      setProducts(updatedProducts);

      for (const prod of updatedProducts) {
        await supabase
          .from("products")
          .update({ order_index: prod.order_index })
          .eq("id", prod.id);
      }
    }
  };

  if (loading && !editingProduct)
    return (
      <div className="p-8 text-center text-gray-500">Cargando productos...</div>
    );

  if (editingProduct !== null) {
    return (
      <ProductForm
        product={editingProduct}
        onCancel={() => setEditingProduct(null)}
        onSave={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
      />
    );
  }

  const filteredProducts = products.filter((p) => {
    if (filterTab === "visibles") return !p.is_hidden;
    if (filterTab === "ocultos") return p.is_hidden;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-title text-primary tracking-wide uppercase">
            Productos
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Gestiona el catálogo de productos de la tienda.
          </p>
        </div>
        <button
          onClick={() => setEditingProduct({})}
          className="bg-secondary text-white px-5 py-2.5 rounded-lg hover:bg-secondary-light font-medium shadow-md transition-colors flex items-center gap-2"
        >
          <span className="font-bold text-lg leading-none">+</span> Agregar
          Producto
        </button>
      </div>

      <div className="mb-6 flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilterTab("todos")}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${filterTab === "todos" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterTab("visibles")}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${filterTab === "visibles" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          Visibles
        </button>
        <button
          onClick={() => setFilterTab("ocultos")}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${filterTab === "ocultos" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          Ocultos
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider w-24">
                    Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No hay productos en esta vista.
                    </td>
                  </tr>
                ) : (
                  <SortableContext
                    items={filteredProducts.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredProducts.map((p) => (
                      <SortableRow
                        key={p.id}
                        product={p}
                        onEdit={setEditingProduct}
                        onDelete={handleDelete}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </SortableContext>
                )}
              </tbody>
            </table>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

function SortableRow({ product, onEdit, onDelete, onToggleVisibility }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    position: isDragging ? "relative" : "static",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-gray-50 transition-colors bg-white ${isDragging ? "shadow-xl opacity-90" : ""} ${product.is_hidden ? "opacity-60" : ""}`}
    >
      <td
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 8h16M4 16h16"
            ></path>
          </svg>
          {product.order_index || 0}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex items-center gap-2">
          {product.titulo}
          {product.is_hidden && (
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
              Oculto
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {!product.precio || product.precio === "0" ? "-" : product.precio}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.stock !== undefined &&
        product.stock !== null &&
        product.stock !== ""
          ? product.stock
          : "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium z-10 relative flex items-center justify-end gap-3">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onToggleVisibility(product.id, product.is_hidden)}
          className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${product.is_hidden ? "bg-gray-200 text-gray-500 hover:bg-gray-300" : "bg-green-100 text-green-600 hover:bg-green-200"}`}
          title={product.is_hidden ? "Mostrar producto" : "Ocultar producto"}
        >
          {product.is_hidden ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(product)}
          className="text-secondary hover:text-secondary-light transition-colors font-semibold relative z-20 cursor-pointer"
        >
          Editar
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(product.id)}
          className="text-red-500 hover:text-red-700 transition-colors font-semibold relative z-20 cursor-pointer"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}

function ProductForm({ product, onCancel, onSave }) {
  const isNew = !product.id;
  const [formData, setFormData] = useState({
    id: product.id || "",
    titulo: product.titulo || "",
    precio: product.precio && product.precio !== "0" ? product.precio : "",
    stock: product.stock || "",
    descripcion: product.descripcion || "",
    descripcion_larga: product.descripcion_larga || "",
    disclaimer: product.disclaimer || "",
    variantes_ids: product.variantes_ids || "",
    variantes_labels: product.variantes_labels || "",
    imagenes: product.imagenes || "",
    cantidad_imagenes: product.cantidad_imagenes || 0,
    variantes_stock:
      product.variantes_stock && Array.isArray(product.variantes_stock)
        ? product.variantes_stock.join(",")
        : typeof product.variantes_stock === "string"
          ? product.variantes_stock
          : "",
    is_hidden: product.is_hidden || false,
    order_index: product.order_index || 0,
  });

  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState([]);
  const supabase = createClient();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveImage = (index) => {
    const currentImages = formData.imagenes
      ? formData.imagenes.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
      : [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setFormData({ ...formData, imagenes: newImages.join(",") });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo) {
      alert("El Título es obligatorio");
      return;
    }

    setSaving(true);

    // Subir imágenes si se seleccionaron
    let currentImages = formData.imagenes
      ? formData.imagenes
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    if (files.length > 0) {
      for (const file of files) {
        try {
          const url = await uploadFile(file, "media", "productos");
          currentImages.push(url);
        } catch (err) {
          console.error("Error subiendo imagen", err);
          alert("Error al subir imagen: " + err.message);
        }
      }
    }

    // Parse variantes_stock back into array of numbers
    let v_stock = null;
    if (formData.variantes_stock) {
      v_stock = formData.variantes_stock
        .split(/[,;]/)
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !isNaN(n));
    }

    const payload = {
      ...formData,
      imagenes: currentImages.join(","),
      cantidad_imagenes: currentImages.length,
      variantes_stock: v_stock,
      order_index: parseInt(formData.order_index, 10) || 0,
      is_hidden: formData.is_hidden,
    };

    let error;
    if (isNew) {
      payload.id = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("products")
        .insert([payload]);
      error = insertError;
    } else {
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id);
      error = updateError;
    }

    setSaving(false);

    if (error) {
      alert("Error guardando producto: " + error.message);
    } else {
      onSave();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-title text-primary tracking-wide">
          {isNew ? "NUEVO PRODUCTO" : "EDITAR PRODUCTO"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_hidden"
              checked={formData.is_hidden}
              onChange={(e) =>
                setFormData({ ...formData, is_hidden: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
          </label>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-700">
              Ocultar producto
            </span>
            <span className="text-xs text-gray-500">
              No se mostrará en el catálogo público si está activado
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio
            </label>
            <input
              type="text"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="text"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
              placeholder="No agregar stock aquí si el producto tiene variantes."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Variantes IDs
            </label>
            <input
              type="text"
              name="variantes_ids"
              value={formData.variantes_ids}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
              placeholder="Ej: v1,v2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Variantes Stock
            </label>
            <input
              type="text"
              name="variantes_stock"
              value={formData.variantes_stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
              placeholder="Ej: 10,5"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Variantes Labels
            </label>
            <input
              type="text"
              name="variantes_labels"
              value={formData.variantes_labels}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-30 shadow-sm transition-colors"
              placeholder="Ej: Rojo,Azul"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción Breve
          </label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-30 shadow-sm transition-colors">
            <ReactQuill
              theme="snow"
              value={formData.descripcion}
              onChange={(content) => handleQuillChange("descripcion", content)}
              modules={quillModules}
              className="border-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción Larga
          </label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-30 shadow-sm transition-colors">
            <ReactQuill
              theme="snow"
              value={formData.descripcion_larga}
              onChange={(content) => handleQuillChange("descripcion_larga", content)}
              modules={quillModules}
              className="border-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Disclaimer
          </label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-30 shadow-sm transition-colors">
            <ReactQuill
              theme="snow"
              value={formData.disclaimer}
              onChange={(content) => handleQuillChange("disclaimer", content)}
              modules={quillModules}
              className="border-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Imágenes Actuales
          </label>
          {!formData.imagenes || formData.imagenes.trim() === "" ? (
            <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg">
              No hay imágenes en la galería para este producto.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {formData.imagenes
                .split(/[,;]/)
                .map((s) => s.trim())
                .filter(Boolean)
                .map((img, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video bg-white flex items-center justify-center"
                  >
                    <img
                      src={img}
                      alt={`Img ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        title="Eliminar imagen"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subir Nuevas Imágenes
          </label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-secondary-light cursor-pointer text-gray-600"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary-light transition-colors disabled:opacity-70 flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Guardando...
              </>
            ) : (
              "Guardar Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
