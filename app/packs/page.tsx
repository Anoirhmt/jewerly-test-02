import { PackCard } from "@/components/pack-card"
import { products } from "@/data/products"
import { Package, Heart } from "lucide-react" // Importing Package and Heart icons

export default function PacksPage() {
  const packs = products.filter((product) => product.isPack)

  return (
    <main className="container mx-auto px-6 py-16">
      <header className="mb-16 text-center">
        <h1 className="text-5xl font-serif font-light mb-6 text-black">Jewelry Packs</h1>
        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
          Curated collections of luxury bracelets inspired by the world's most prestigious jewelry houses. Complete your
          stack with these exclusive pack deals.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <PackCard key={pack.id} product={pack} />
        ))}
      </section>

      <section className="mt-16 bg-gray-50 p-8 border border-gray-200 rounded-none">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-medium mb-4 text-black">Why Choose Our Packs?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6" />
              </div>
              <h4 className="font-medium mb-2">Curated Selection</h4>
              <p className="text-gray-600 text-sm">Expertly chosen combinations that complement each other perfectly</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold">%</span>
              </div>
              <h4 className="font-medium mb-2">Better Value</h4>
              <p className="text-gray-600 text-sm">Save up to 40% compared to buying individual pieces</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h4 className="font-medium mb-2">Perfect Stack</h4>
              <p className="text-gray-600 text-sm">Ready-to-wear combinations for the perfect layered look</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
