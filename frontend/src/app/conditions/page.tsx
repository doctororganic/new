const apiBase = 'http://46.62.228.173:8080/api'
export const dynamic = "force-dynamic"

import { ConditionsSchema } from '@/lib/schemas'

async function getConditions() {
  const res = await fetch(`${apiBase}/v1/conditions`, { next: { revalidate: 0 } })
  if (!res.ok) return { error: `Status ${res.status}` }
  const data = await res.json()
  const parsed = ConditionsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid schema', issues: parsed.error.issues }
  return parsed.data
}

export default async function ConditionsPage() {
  const data = await getConditions()
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Conditions</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
