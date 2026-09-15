// pages/api/products.js

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
// Usar el nombre exacto de la pestaña de tu Sheet (ej. "Productos" o "Sheet1")
const SHEET_TAB_NAME = process.env.SHEET_TAB_NAME || "Productos";
const RANGE = `${SHEET_TAB_NAME}!A1:N1000`;

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

function convertDriveLink(url) {
  if (!url || typeof url !== "string") return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("/") || trimmed.startsWith("./")) {
    return trimmed;
  }

  if (trimmed.includes("drive.google.com")) {
    let fileId = null;
    const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) fileId = match1[1];

    const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) fileId = match2[1];

    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  return trimmed;
}

function splitImageList(imagesValue, singleImageValue) {
  let list = [];
  if (imagesValue) {
    list = String(imagesValue)
      .split(/;|\n/)
      .map((i) => convertDriveLink(i.trim()))
      .filter(Boolean);
  }

  if (list.length === 0 && singleImageValue) {
    const single = convertDriveLink(String(singleImageValue).trim());
    if (single) list.push(single);
  }

  return list;
}

export default async function handler(req, res) {
  if (!SPREADSHEET_ID || !API_KEY) {
    return res.status(500).json({ error: "Faltan variables de entorno en el servidor" });
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
    RANGE
  )}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const rows = data.values || [];
    if (rows.length <= 1) {
      return res.status(200).json([]);
    }

    // Encabezados normalizados a minúsculas
    const headers = rows[0].map((h) => String(h).trim().toLowerCase());

    const products = rows
      .slice(1)
      .map((row) => {
        const item = {};
        headers.forEach((header, index) => {
          item[header] = row[index] ? String(row[index]).trim() : "";
        });

        // Filtrar filas completamente vacías o sin ID
        if (!item["id"]) return null;

        // 1. Imágenes
        const imagesArray = splitImageList(item["images"] || item["imagenes"], item["image"] || item["imagen"]);
        const mainImage = item["image"] ? convertDriveLink(item["image"]) : imagesArray[0] || "";

        // 2. Variantes
        const variantIdsRaw = item["variantes_ids"] || item["variants_ids"] || item["variantes"] || "";
        const variantLabelsRaw = item["variantes_labels"] || item["variants_labels"] || "";
        const variantStocksRaw = item["variantes_stock"] || item["variants_stock"] || "";

        const variantIds = variantIdsRaw
          ? variantIdsRaw.split(";").map((v) => v.trim()).filter(Boolean)
          : [];

        const variantLabels = variantLabelsRaw
          ? variantLabelsRaw.split(";").map((v) => v.trim())
          : [];

        const variantStocks = variantStocksRaw
          ? variantStocksRaw.split(";").map((v) => parseLocalizedNumber(v))
          : [];

        const variants = variantIds.map((id, i) => ({
          id,
          label: variantLabels[i] || id,
          stock: Number.isFinite(variantStocks[i]) ? variantStocks[i] : 0,
        }));

        // 3. Stock General
        const stockKeys = ["stock", "cantidad", "stock_unidades", "qty", "existencias"];
        let generalStock = 0;
        for (const k of stockKeys) {
          if (item[k] !== undefined && item[k] !== "") {
            generalStock = parseLocalizedNumber(item[k]);
            break;
          }
        }

        // 4. Precios
        const precioRaw = item["price"] || item["precio"] || item["precio_venta"] || "";
        const price = parseLocalizedNumber(precioRaw);

        return {
          id: item["id"],
          title: item["title"] || item["titulo"] || "",
          category: item["category"] || item["categoria"] || "",
          collection: item["collection"] || item["coleccion"] || null,
          price,
          description: item["description"] || item["descripcion"] || "",
          longDescription: item["longdescription"] || item["descripcion_larga"] || null,
          image: mainImage,
          images: imagesArray,
          variants,
          stock: variants.length > 0 ? null : generalStock,
          disclaimer: item["disclaimer"] || null,
        };
      })
      .filter(Boolean);

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error al consultar Google Sheets API:", error);
    return res.status(500).json({ error: "Error al leer datos de Google Sheets" });
  }
}