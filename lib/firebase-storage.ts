import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { initFirebase } from "./firebase";

// Initialize Firebase and get storage reference
let storage: ReturnType<typeof getStorage> | undefined;

// Initialize storage if not already initialized
export function initStorage() {
  const { app } = initFirebase();
  if (!storage && app) {
    storage = getStorage(app);
  }
  return storage;
}

// Get a download URL for a file in Firebase Storage
export async function getImageUrl(path: string): Promise<string> {
  try {
    const storage = initStorage();
    if (!storage) throw new Error("Storage not initialized");
    
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    throw error;
  }
}

// Specific function to get hero image
export async function getHeroImage(): Promise<string> {
  try {
    // For demonstration purposes, we'll use a placeholder URL
    // In a real scenario, you would fetch this from Firebase Storage
    // const heroImagePath = "hero/hero-image.jpg";
    // return await getImageUrl(heroImagePath);
    
    // For now, return the local SVG placeholder
    return "/images/hero-jewelry.jpg.svg";
  } catch (error) {
    console.error("Error getting hero image:", error);
    // Return a fallback image path if Firebase image fails
    return "/images/hero-jewelry.jpg.svg";
  }
}

// Check if an image exists in Firebase Storage
export async function checkImageExists(path: string): Promise<boolean> {
  try {
    await getImageUrl(path);
    return true;
  } catch (error) {
    return false;
  }
}