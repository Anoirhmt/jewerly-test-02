'use client';

import { ProductGrid } from "@/components/product-grid"
import { ProductCard } from "@/components/product-card"
import { Hero } from "@/components/hero"
import { FeaturedCategories } from "@/components/featured-categories"
import { getProductsFromFirestore } from "@/lib/firestore-products";
import { initFirebase } from "@/lib/firebase";
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    initFirebase();
    async function loadProducts() {
      const fetchedProducts = await getProductsFromFirestore();
      setProducts(fetchedProducts);
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCategories />
       
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductGrid products={products} showNavCards />
        </div>
      </section>
    </div>
  )
}
