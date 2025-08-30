import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
export async function getProductsFromFirestore() {
  const snap = await getDocs(collection(db!, "collection"));
  return snap.docs
    .filter((d) => d.id !== "collection") // guard against meta/doc placeholder
    .map((d) => {
      const data = d.data() as any;
      // if inStock is missing, default to true
      return { id: d.id, inStock: data.inStock ?? true, ...data };
    });
}

// Fetch "promo" documents for the Promo of the Week section
export async function getPromoFromFirestore() {
  const snap = await getDocs(collection(db!, "promo"));
  return snap.docs
    .filter((d) => d.id !== "collection")
    .map((d) => {
      const data = d.data() as any;
      return { id: d.id, inStock: data.inStock ?? true, ...data };
    });
}

// Fetch "packs" documents for the Packs page
export async function getPacksFromFirestore() {
  const snap = await getDocs(collection(db!, "packs"));
  return snap.docs
    .filter((d) => d.id !== "collection")
    .map((d) => {
      const data = d.data() as any;
      return { id: d.id, inStock: data.inStock ?? true, ...data };
    });
}