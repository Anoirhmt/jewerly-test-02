const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbwKVHmzlYwlj3igVqBe17WMMgZq_3VZ8nYKZ2GKRzGRKBSyywmZO2hAutgdvLPr26SdBw/exec';

export async function getProducts() {
  try {
    const response = await fetch(GOOGLE_SHEET_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function addProduct(productData: any) {
  try {
    const response = await fetch(GOOGLE_SHEET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}