export const formatPrice = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

export const normalizeText = (text = "") =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();