import { useEffect, useState } from "react";
import { SEED_CATALOG, type PublicCatalog } from "./index";
let current: PublicCatalog = SEED_CATALOG;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();
export async function refreshCatalog() {
  if (pending) return pending;
  pending = fetch("/api/catalog", { credentials: "same-origin" })
    .then(async (r) => {
      if (!r.ok) throw new Error("Catalog unavailable");
      const v = await r.json();
      if (
        !Array.isArray(v.templates) ||
        !Array.isArray(v.resources) ||
        !Array.isArray(v.examples)
      )
        throw new Error("Invalid catalog");
      current = v;
      listeners.forEach((fn) => fn());
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}
export function useCatalog() {
  const [value, setValue] = useState(current),
    [error, setError] = useState("");
  useEffect(() => {
    const update = () => {
      setValue(current);
      setError("");
    };
    listeners.add(update);
    refreshCatalog().catch(() =>
      setError("The live library could not be reached."),
    );
    const focus = () => refreshCatalog().catch(() => {});
    window.addEventListener("focus", focus);
    return () => {
      listeners.delete(update);
      window.removeEventListener("focus", focus);
    };
  }, []);
  return { ...value, error, refresh: refreshCatalog };
}
