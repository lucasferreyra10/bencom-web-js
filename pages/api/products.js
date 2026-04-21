// pages/api/products.js

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const RANGE = "Sheet1!A1:Z1000";

function parseLocalizedNumber(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  let s = value.trim();
  if (s === "") return 0;

  s = s.replace(/\s/g, "");

  if (s.indexOf(".") > -1 && s.indexOf(",") > -1) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.indexOf(",") > -1 && s.indexOf(".") === -1) {
    s = s.replace(",", ".");
  }

  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

// ⭐ Nueva función para convertir links de Google Drive
function convertDriveLink(url) {
  if (!url || typeof url !== "string") return url;
  
  const trimmed = url.trim();
  
  // Si es una ruta local, dejarla tal cual
  if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }
  
  // Si es un link de Google Drive, convertirlo
  if (trimmed.includes("drive.google.com")) {
    // Extraer el FILE_ID de diferentes formatos posibles
    let fileId = null;
    
    // Formato: https://drive.google.com/file/d/FILE_ID/view?usp=...
    const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
      fileId = match1[1];
    }
    
    // Formato: https://drive.google.com/open?id=FILE_ID
    const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) {
      fileId = match2[1];
    }
    
    // Si encontramos el ID, convertir al formato directo
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  
  // Si no es Drive ni ruta local, devolverlo tal cual
  return trimmed;
}

export default async function handler(req, res) {
  if (!SPREADSHEET_ID || !API_KEY) {
    return res.status(500).json({ error: "Faltan variables de entorno" });
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
    RANGE,
  )}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const rows = data.values || [];
    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    const headers = rows[0];

    const products = rows.slice(1).map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] ?? "";
      });

      const itemLower = {};
      Object.keys(item).forEach((k) => {
        itemLower[String(k).toLowerCase()] = item[k];
      });

      // 🔄 NORMALIZACIÓN: imágenes con conversión de links de Drive
      const imagesRaw = itemLower["imagenes"] || itemLower["images"] || "";
      const imagesArray = imagesRaw
        ? String(imagesRaw)
            .split(";")
            .map((i) => convertDriveLink(i.trim())) // ⭐ Convertir cada link
            .filter(Boolean)
        : [];

      // Variantes: ids, labels, stocks (separador ';')
      const variantIdsRaw = itemLower["variantes_ids"] ?? itemLower["variants_ids"] ?? itemLower["variantes"] ?? "";
      const variantLabelsRaw = itemLower["variantes_labels"] ?? itemLower["variants_labels"] ?? itemLower["variantes_labels"] ?? "";
      const variantStocksRaw = itemLower["variantes_stock"] ?? itemLower["variants_stock"] ?? itemLower["variantes_stock"] ?? "";

      const variantIds = variantIdsRaw
        ? String(variantIdsRaw).split(";").map((v) => v.trim()).filter(Boolean)
        : [];

      const variantLabels = variantLabelsRaw
        ? String(variantLabelsRaw).split(";").map((v) => v.trim())
        : [];

      const variantStocks = variantStocksRaw
        ? String(variantStocksRaw).split(";").map((v) => parseLocalizedNumber(v))
        : [];

      const variants = variantIds.map((id, i) => ({
        id,
        label: variantLabels[i] || id,
        stock: Number.isFinite(variantStocks[i]) ? variantStocks[i] : 0,
      }));

      // Stock general
      const stockKeys = [
        "stock",
        "cantidad",
        "stock_unidades",
        "stock_qty",
        "qty",
        "existencias",
      ];
      let generalStock = 0;
      for (const k of stockKeys) {
        if (Object.prototype.hasOwnProperty.call(itemLower, k) && String(itemLower[k]).trim() !== "") {
          generalStock = parseLocalizedNumber(String(itemLower[k]));
          break;
        }
      }

      // Price parsing
      const precioRaw = itemLower["precio"] ?? itemLower["price"] ?? itemLower["precio_venta"] ?? "";
      const price = parseLocalizedNumber(String(precioRaw));

      return {
        id: item.id ?? itemLower["id"] ?? "",
        title: item.titulo ?? itemLower["titulo"] ?? itemLower["title"] ?? "",
        price,
        description: item.descripcion ?? itemLower["descripcion"] ?? "",
        longDescription: item.descripcion_larga ?? itemLower["descripcion_larga"] ?? "",
        image: imagesArray[0] || "",
        images: imagesArray,
        variants,
        stock: variants.length ? null : (Number.isFinite(generalStock) ? generalStock : 0),
        disclaimer: item.disclaimer ?? itemLower["disclaimer"] ?? "",
      };
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error Google Sheets:", error);
    return res.status(500).json({ error: "Error al leer Google Sheets" });
  }
}