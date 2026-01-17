import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/utils/format-price"

export function ProductFilters() {
  return (
    <aside className="lg:w-80 space-y-12">
      <section>
        <h2 className="text-[10px] tracking-[0.4em] uppercase text-black mb-6 font-medium">Catégories</h2>
        <div className="space-y-4">
          {["Bagues", "Colliers", "Boucles d'oreilles", "Bracelets", "Broches", "Bijoux Homme"].map((category) => (
            <div key={category} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox
                id={category}
                className="border-gray-200 rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black transition-colors"
              />
              <label
                htmlFor={category}
                className="text-[11px] tracking-[0.1em] uppercase font-light text-gray-500 group-hover:text-black cursor-pointer transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] tracking-[0.4em] uppercase text-black mb-6 font-medium">Prix</h2>
        <Slider defaultValue={[0, 1000]} max={2000} step={50} className="w-full" />
        <div className="flex items-center justify-between text-[9px] tracking-widest text-gray-400 mt-4 uppercase">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(2000)}+</span>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] tracking-[0.4em] uppercase text-black mb-6 font-medium">Matériau</h2>
        <div className="space-y-4">
          {["Or Jaune", "Or Blanc", "Or Rose", "Platine", "Argent", "Métaux Mixtes"].map((material) => (
            <div key={material} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox
                id={material}
                className="border-gray-200 rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black transition-colors"
              />
              <label
                htmlFor={material}
                className="text-[11px] tracking-[0.1em] uppercase font-light text-gray-500 group-hover:text-black cursor-pointer transition-colors"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] tracking-[0.4em] uppercase text-black mb-6 font-medium">Pierres</h2>
        <div className="space-y-4">
          {["Diamant", "Saphir", "Rubis", "Émeraude", "Perle", "Améthyste"].map((gemstone) => (
            <div key={gemstone} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox
                id={gemstone}
                className="border-gray-200 rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black transition-colors"
              />
              <label
                htmlFor={gemstone}
                className="text-[11px] tracking-[0.1em] uppercase font-light text-gray-500 group-hover:text-black cursor-pointer transition-colors"
              >
                {gemstone}
              </label>
            </div>
          ))}
        </div>
      </section>

      <Button
        variant="outline"
        className="w-full bg-transparent border-black text-black hover:bg-black hover:text-white rounded-none py-6 text-[10px] tracking-[0.3em] uppercase transition-all duration-500"
      >
        Réinitialiser
      </Button>
    </aside>
  )
}
