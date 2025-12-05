const apiBase = 'http://46.62.228.173:8080/api'
export const dynamic = "force-dynamic"

import { WorkoutItemSchema } from '@/lib/schemas'

export default async function WorkoutDetailPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${apiBase}/v1/workouts/${params.id}`, { next: { revalidate: 0 } })
  if (!res.ok) return <main className="p-6"><pre className="bg-red-100 p-4 rounded">Status {res.status}</pre></main>
  const data = await res.json()
  const parsed = WorkoutItemSchema.safeParse(data)
  if (!parsed.success) return <main className="p-6"><pre className="bg-yellow-100 p-4 rounded">Invalid schema</pre></main>
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Workout Detail</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(parsed.data, null, 2)}</pre>
    </main>
  )
}
