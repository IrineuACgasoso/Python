/**
 * Generates a short unique ID based on timestamp + random suffix.
 * Suitable for client-side entity IDs (exercises, days, routines, logs).
 *
 * @returns {string} e.g. "lq3k2xab7f"
 */
export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 5);