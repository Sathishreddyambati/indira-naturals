
import "server-only";

import {
  FieldValue,
  type DocumentData,
} from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase-admin";

const COLLECTIONS = {
  products: "indira_products",
  orders: "indira_orders",
  customers: "indira_customers",
  coupons: "indira_coupons",
  settings: "indira_settings",
  admins: "indira_admins",
} as const;

export { COLLECTIONS };

export async function getIndiraProducts() {
  const db = getAdminDb();

  const snapshot = await db
    .collection(COLLECTIONS.products)
    .get();

  return snapshot.docs
    .filter((doc) => doc.id !== "setup")
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
}

export async function getIndiraProductById(id: string) {
  const db = getAdminDb();

  const doc = await db
    .collection(COLLECTIONS.products)
    .doc(id)
    .get();

  if (!doc.exists || doc.id === "setup") {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}

export async function getIndiraSettings() {
  const db = getAdminDb();

  const doc = await db
    .collection(COLLECTIONS.settings)
    .doc("store")
    .get();

  if (!doc.exists) {
    return null;
  }

  return doc.data();
}

export async function createIndiraOrder(
  orderId: string,
  orderData: DocumentData
) {
  const db = getAdminDb();

  await db
    .collection(COLLECTIONS.orders)
    .doc(orderId)
    .create({
      ...orderData,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

  return orderId;
}
