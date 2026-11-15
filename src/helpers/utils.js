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

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "ahora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
};