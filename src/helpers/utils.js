export const formatPrice = (value) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

export const normalizeText = (text = "") =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const AUTH_ERRORS = {
  "auth/invalid-email": "El correo no es válido",
  "auth/missing-password": "Escribe tu contraseña",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo",
  "auth/invalid-credential": "Correo o contraseña incorrectos",
  "auth/too-many-requests": "Demasiados intentos, espera un momento",
  "auth/network-request-failed": "Sin conexión, revisa tu internet",
};

export const authErrorMessage = (error) => AUTH_ERRORS[error?.code] ?? "Ocurrió un error, intenta de nuevo";