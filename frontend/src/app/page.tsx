import { HealthSchema } from '@/lib/schemas'

async function fetchHealth() {
  const apiUrl = process.env.INTERNAL_API_URL || 'http://46.62.228.173:8080/api'
  try {
    const res = await fetch(`${apiUrl}/v1/health`, { next: { revalidate: 0 } })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    const parsed = HealthSchema.safeParse(data)
    if (!parsed.success) throw new Error('Invalid health schema')
    return parsed.data
  } catch (e) {
    return { status: 'error', service: 'backend', timestamp: new Date().toISOString(), error: (e as Error).message } as any
  }
}

export default async function Page() {
  const health = await fetchHealth()
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Trae Nutrition Frontend</h1>
      <p>This Next.js app connects to the Go backend.</p>
      <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(health, null, 2)}
      </pre>
      <p>Backend API URL: {process.env.INTERNAL_API_URL || 'http://46.62.228.173:8080/api'}</p>
    </main>
  )
}
