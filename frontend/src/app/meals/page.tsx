const apiBase = 'http://46.62.228.173:8080/api'
export const dynamic = "force-dynamic"

import { MealsSchema } from '@/lib/schemas'
import MealsClient from './MealsClient'

async function getMeals(params: Record<string, string | undefined>) {
  const limit = params.limit ?? '20'
  const offset = params.offset ?? '0'
  const q = params.q ?? ''
  const min = params.min_calories ?? ''
  const max = params.max_calories ?? ''
  const usp = new URLSearchParams({ limit, offset })
  if (q) usp.set('q', q)
  if (min) usp.set('min_calories', min)
  if (max) usp.set('max_calories', max)
  const res = await fetch(`${apiBase}/v1/meals?${usp.toString()}`, { next: { revalidate: 0 } })
  if (!res.ok) return { error: `Status ${res.status}` }
  const data = await res.json()
  const parsed = MealsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid schema', issues: parsed.error.issues }
  return parsed.data
}

export default async function MealsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const data = await getMeals(searchParams)
  const limit = Number(searchParams?.limit || '20')
  const offset = Number(searchParams?.offset || '0')
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Meals</h2>
      <MealsClient initial={{ limit, offset, q: searchParams?.q, min_calories: searchParams?.min_calories, max_calories: searchParams?.max_calories, data }} />
    </main>
  )
}
