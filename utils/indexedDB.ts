import { openDB, DBSchema, IDBPDatabase } from "idb";
import { mockEmployees } from "../data/mockEmployees";
import { mockDepartments } from "../data/mockDepartments";
import { mockLocations } from "../data/mockLocations";
import { mockPositions } from "../data/mockPositions";

interface MyDB extends DBSchema {
  employees: {
    key: string;
    value: any;
  };
  departments: {
    key: string;
    value: any;
  };
  locations: {
    key: string;
    value: any;
  };
  positions: {
    key: string;
    value: any;
  };
}

const DB_NAME = "EmployeeDirectoryDB";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<MyDB> | null = null;

async function getDB(): Promise<IDBPDatabase<MyDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("employees")) {
        db.createObjectStore("employees", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("departments")) {
        db.createObjectStore("departments", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("locations")) {
        db.createObjectStore("locations", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("positions")) {
        db.createObjectStore("positions", { keyPath: "id" });
      }
    },
  });
  return dbInstance;
}

export async function getAllItems<T>(storeName: keyof MyDB): Promise<T[]> {
  const db = await getDB();
  return db.getAll(storeName);
}

export async function getItem<T>(
  storeName: keyof MyDB,
  id: string
): Promise<T | undefined> {
  const db = await getDB();
  return db.get(storeName, id);
}

export async function addItem<T>(
  storeName: keyof MyDB,
  item: T
): Promise<string> {
  const db = await getDB();
  return db.add(storeName, item);
}

export async function updateItem<T>(
  storeName: keyof MyDB,
  item: T
): Promise<string> {
  const db = await getDB();
  return db.put(storeName, item);
}

export async function deleteItem(
  storeName: keyof MyDB,
  id: string
): Promise<void> {
  const db = await getDB();
  return db.delete(storeName, id);
}

export async function clearStore(storeName: keyof MyDB): Promise<void> {
  const db = await getDB();
  return db.clear(storeName);
}

async function initializeStore<T extends { id: string; order: number }>(
  storeName: keyof MyDB,
  initialData: T[],
  transaction: IDBTransaction
): Promise<void> {
  const store = transaction.objectStore(storeName);
  const count = await store.count();

  if (count === 0) {
    for (const item of initialData) {
      const itemWithOrder = { ...item, order: item.order || 0 };
      await store.add(itemWithOrder);
    }
  }
}

export async function initializeAllStores(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(
    ["employees", "departments", "locations", "positions"],
    "readwrite"
  );

  try {
    await Promise.all([
      initializeStore("employees", mockEmployees, tx),
      initializeStore("departments", mockDepartments, tx),
      initializeStore("locations", mockLocations, tx),
      initializeStore("positions", mockPositions, tx),
    ]);

    await tx.done;
  } catch (error) {
    console.error("Error initializing stores:", error);
    throw error;
  }
}
