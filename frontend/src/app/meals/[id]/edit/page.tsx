"use client"
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

import { useEffect, useState } from 'react'

export default function MealEditPage({ params }: { params: { id: string } }) {
  const [initial, setInitial] = useState<any>(null)
  const [result, setResult] = useState<any>(null)
  useEffect(() => {
    fetch(`${apiUrl}/v1/meals/${params.id}`).then(r => r.json()).then(setInitial).catch(() => setInitial({ error: 'Load failed' }))
  }, [params.id])
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = {
      name: String(fd.get('name') || ''),
      calories: Number(fd.get('calories') || 0),
      protein: Number(fd.get('protein') || 0),
      carbs: Number(fd.get('carbs') || 0),
      fat: Number(fd.get('fat') || 0),
    }
    const res = await fetch(`${apiUrl}/v1/meals/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json().catch(() => ({ error: 'Invalid JSON' }))
    setResult({ status: res.status, data })
  }
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Meal</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input name="name" defaultValue={initial?.name || ''} placeholder="Name" className="border p-2 rounded" />
        <input name="calories" defaultValue={initial?.calories ?? ''} placeholder="Calories" type="number" className="border p-2 rounded" />
        <input name="protein" defaultValue={initial?.protein ?? ''} placeholder="Protein" type="number" className="border p-2 rounded" />
        <input name="carbs" defaultValue={initial?.carbs ?? ''} placeholder="Carbs" type="number" className="border p-2 rounded" />
        <input name="fat" defaultValue={initial?.fat ?? ''} placeholder="Fat" type="number" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white rounded p-2">Save</button>
      </form>
      <h3 className="text-xl font-semibold mb-2">Current</h3>
      <pre className="bg-gray-100 p-4 rounded mb-4">{JSON.stringify(initial, null, 2)}</pre>
      <h3 className="text-xl font-semibold mb-2">Result</h3>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
    </main>
  )
}
