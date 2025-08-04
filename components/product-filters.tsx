import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function ProductFilters() {
  return (
    <div className="space-y-8">
      <Card className="border-0 premium-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-xl font-medium text-black">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card className="border-0 premium-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-xl font-medium text-black">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Slider defaultValue={[0, 3000]} max={5000} step={100} className="w-full" />
            <div className="flex items-center justify-between text-sm text-gray-500 font-light">
              <span>$0</span>
              <span>$5000+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 premium-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-xl font-medium text-black">Material</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card className="border-0 premium-shadow bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-xl font-medium text-black">Gemstone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 rounded-none py-3 font-light tracking-wide"
      >
        Clear All Filters
      </Button>
    </div>
  )
}
