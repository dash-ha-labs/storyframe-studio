import type { Project } from "./model";
export type SavedVersion = {
  id: string;
  creationId: string;
  label: string;
  createdAt: string;
  project: Project;
};
let temporary = false;
const memory: SavedVersion[] = [];
export function useSessionVersions() {
  temporary = true;
}
function database(): Promise<IDBDatabase> {
  return new Promise((ok, no) => {
    const request = indexedDB.open("storyframe-versions-v1", 1);
    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore("versions", {
        keyPath: "id",
      });
      store.createIndex("creationId", "creationId");
    };
    request.onsuccess = () => ok(request.result);
    request.onerror = () => no(request.error);
  });
}
export async function saveVersion(
  creationId: string,
  project: Project,
  label: string,
) {
  const version = {
    id: crypto.randomUUID(),
    creationId,
    label,
    createdAt: new Date().toISOString(),
    project: structuredClone(project),
  };
  if (temporary) {
    memory.push(version);
    return version;
  }
  const db = await database();
  await new Promise<void>((ok, no) => {
    const tx = db.transaction("versions", "readwrite");
    tx.objectStore("versions").add(version);
    tx.oncomplete = () => ok();
    tx.onerror = () => no(tx.error);
  });
  db.close();
  return version;
}
export async function listVersions(creationId: string) {
  if (temporary)
    return memory.filter((v) => v.creationId === creationId).reverse();
  const db = await database();
  const records = await new Promise<SavedVersion[]>((ok, no) => {
    const req = db
      .transaction("versions")
      .objectStore("versions")
      .index("creationId")
      .getAll(creationId);
    req.onsuccess = () => ok(req.result);
    req.onerror = () => no(req.error);
  });
  db.close();
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
