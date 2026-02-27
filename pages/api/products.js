// pages/api/products.js

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const RANGE = "Sheet1!A1:Z1000";

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
        item[header] = row[index] || "";
      });

      // 🔄 NORMALIZACIÓN
      const imagesArray = item.imagenes
        ? item.imagenes
            .split(";")
            .map((i) => i.trim())
            .filter(Boolean)
        : [];

      const variantIds = item.variantes_ids
        ? item.variantes_ids.split(";").map((v) => v.trim())
        : [];

      const variantLabels = item.variantes_labels
        ? item.variantes_labels.split(";").map((v) => v.trim())
        : [];

      const variants = variantIds.map((id, i) => ({
        id,
        label: variantLabels[i] || id,
      }));

      return {
        id: item.id,
        title: item.titulo,
        price: Number(item.precio) || 0,
        description: item.descripcion,
        longDescription: item.descripcion_larga,
        image: imagesArray[0] || "",
        images: imagesArray,
        variants,
        disclaimer: item.disclaimer || "",
      };
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error Google Sheets:", error);
    return res.status(500).json({ error: "Error al leer Google Sheets" });
  }
}
