const STORAGE_KEY = "gymflow_v2";

/**
 * Loads the full app state from localStorage.
 * Returns null if nothing is stored yet.
 */
export async function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persists the full app state to localStorage.
 * Logs a warning if the write fails (e.g., storage quota exceeded).
 */
export async function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[GymFlow] Erro ao salvar dados:", e);
  }
}