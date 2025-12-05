"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function QAQuickLinks() {
  const r = useRouter()
  const [mealId, setMealId] = useState('1')
  const [workoutId, setWorkoutId] = useState('1')
  const [condId, setCondId] = useState('1')
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-600">Quick:</span>
      <input className="border p-1 rounded w-16" value={mealId} onChange={(e)=>setMealId(e.target.value)} />
      <button className="border px-2 py-1 rounded" onClick={()=>r.push(`/meals/${mealId}`)}>Meal</button>
      <button className="border px-2 py-1 rounded" onClick={()=>r.push(`/meals/${mealId}/edit`)}>Edit</button>
      <input className="border p-1 rounded w-16" value={workoutId} onChange={(e)=>setWorkoutId(e.target.value)} />
      <button className="border px-2 py-1 rounded" onClick={()=>r.push(`/workouts/${workoutId}`)}>Workout</button>
      <button className="border px-2 py-1 rounded" onClick={()=>r.push(`/workouts/${workoutId}/edit`)}>Edit</button>
      <input className="border p-1 rounded w-16" value={condId} onChange={(e)=>setCondId(e.target.value)} />
      <button className="border px-2 py-1 rounded" onClick={()=>r.push(`/conditions/${condId}`)}>Condition</button>
      <button className="border px-2 py-1 rounded" onClick={()=>r.push(`/conditions/${condId}/edit`)}>Edit</button>
    </div>
  )
}

