import { PacksGrid } from "@/components/packs-grid"
import { getPacks } from "@/lib/packs"

export default async function PacksPage({ searchParams }: { searchParams: { page?: string } }) {
  const packs = (await getPacks()).filter((pack) => pack.inStock && pack.name)
  return <PacksGrid packs={packs} searchParams={searchParams} />
}
