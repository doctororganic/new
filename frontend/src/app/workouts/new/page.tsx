"use client"
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

import { useState } from 'react'

export default function WorkoutCreatePage() {
  const [result, setResult] = useState<any>(null)
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = {
      name: String(fd.get('name') || ''),
      duration: Number(fd.get('duration') || 0),
      calories_burned: Number(fd.get('calories_burned') || 0),
      type: String(fd.get('type') || ''),
    }
    const res = await fetch(`${apiUrl}/v1/workouts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json().catch(() => ({ error: 'Invalid JSON' }))
    setResult({ status: res.status, data })
  }
  return (
    <main className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Workout</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input name="name" placeholder="Name" className="border p-2 rounded" />
        <input name="duration" placeholder="Duration" type="number" className="border p-2 rounded" />
        <input name="calories_burned" placeholder="Calories burned" type="number" className="border p-2 rounded" />
        <input name="type" placeholder="Type" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white rounded p-2">Create</button>
      </form>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
    </main>
  )
}
