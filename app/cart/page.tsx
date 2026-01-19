import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"

export default function CartPage() {
  return (
    <section className="w-full px-6 pt-48 pb-32 bg-white">
      <header className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-serif font-medium uppercase tracking-luxury-lg mb-8 text-black">Mon Panier</h1>
        <div className="w-16 h-[1px] bg-black/10 mx-auto mb-8" />

      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <section className="lg:col-span-2">
          <CartItems />
        </section>
        <aside className="lg:sticky lg:top-24 h-fit">
          <CartSummary />
        </aside>
      </main>
    </section>
  )
}
