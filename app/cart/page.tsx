import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"

export default function CartPage() {
  return (
    <section className="container mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-serif font-semibold uppercase tracking-wide mb-6 text-black">Shopping Cart</h1>
      
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2">
          <CartItems />
        </section>
        <aside>
          <CartSummary />
        </aside>
      </main>
    </section>
  )
}
