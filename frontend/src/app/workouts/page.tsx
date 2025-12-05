const apiBase = 'http://46.62.228.173:8080/api'
export const dynamic = "force-dynamic"

import { WorkoutsSchema } from '@/lib/schemas'
import WorkoutsClient from './WorkoutsClient'

async function getWorkouts(params: Record<string, string | undefined>) {
  const limit = params.limit ?? '20'
  const offset = params.offset ?? '0'
  const type = params.type ?? ''
  const usp = new URLSearchParams({ limit, offset })
  if (type) usp.set('type', type)
  const res = await fetch(`${apiBase}/v1/workouts?${usp.toString()}`, { next: { revalidate: 0 } })
  if (!res.ok) return { error: `Status ${res.status}` }
  const data = await res.json()
  const parsed = WorkoutsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid schema', issues: parsed.error.issues }
  return parsed.data
}

export default async function WorkoutsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const data = await getWorkouts(searchParams)
  const limit = Number(searchParams?.limit || '20')
  const offset = Number(searchParams?.offset || '0')
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Workouts</h2>
      <WorkoutsClient initial={{ limit, offset, type: searchParams?.type, data }} />
    </main>
  )
}
