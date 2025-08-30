import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function ProductFilters() {
  return (
    <aside className="lg:w-80 space-y-6">
      <section>
        <h2 className="tracking-tight font-serif text-xl font-medium text-black mb-4">Categories</h2>
        <div className="space-y-3">
          {["Rings", "Necklaces", "Earrings", "Bracelets", "Brooches", "Men's Jewelry"].map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <Checkbox
                id={category}
                className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label
                htmlFor={category}
                className="text-sm font-light text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-wide"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="tracking-tight font-serif text-xl font-medium text-black mb-4">Price Range</h2>
        <Slider defaultValue={[0, 3000]} max={5000} step={100} className="w-full" />
        <div className="flex items-center justify-between text-sm text-gray-500 font-light mt-2">
          <span>$0</span>
          <span>$5000+</span>
        </div>
      </section>

      <section>
        <h2 className="tracking-tight font-serif text-xl font-medium text-black mb-4">Material</h2>
        <div className="space-y-3">
          {["Gold", "White Gold", "Rose Gold", "Platinum", "Silver", "Mixed Metals"].map((material) => (
            <div key={material} className="flex items-center space-x-3">
              <Checkbox
                id={material}
                className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label
                htmlFor={material}
                className="text-sm font-light text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-wide"
              >
                {material}
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="tracking-tight font-serif text-xl font-medium text-black mb-4">Gemstone</h2>
        <div className="space-y-3">
          {["Diamond", "Sapphire", "Ruby", "Emerald", "Pearl", "Amethyst"].map((gemstone) => (
            <div key={gemstone} className="flex items-center space-x-3">
              <Checkbox
                id={gemstone}
                className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label
                htmlFor={gemstone}
                className="text-sm font-light text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 tracking-wide"
              >
                {gemstone}
              </label>
            </div>
          ))}
        </div>
      </section>

      <Button
        variant="outline"
        className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none py-3 font-light tracking-wide"
      >
        Clear All Filters
      </Button>
    </aside>
  )
}
