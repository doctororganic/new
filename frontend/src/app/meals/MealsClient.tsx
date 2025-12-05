"use client"
import { useEffect, useMemo, useState } from 'react'
import { MealsSchema } from '@/lib/schemas'
import DataTable, { Column } from '@/components/DataTable'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api'

export default function MealsClient({ initial }: { initial: { limit: number; offset: number; q?: string; min_calories?: string; max_calories?: string; data: any } }) {
  const [q, setQ] = useState(initial.q || '')
  const [minCal, setMinCal] = useState(initial.min_calories || '')
  const [maxCal, setMaxCal] = useState(initial.max_calories || '')
  const [limit, setLimit] = useState(String(initial.limit || 20))
  const [offset, setOffset] = useState(String(initial.offset || 0))
  const [data, setData] = useState<any>(initial.data)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [issues, setIssues] = useState<any[]>([])

  const validation = useMemo(() => {
    const msgs: string[] = []
    const l = Number(limit)
    const o = Number(offset)
    const min = minCal ? Number(minCal) : undefined
    const max = maxCal ? Number(maxCal) : undefined
    if (!Number.isInteger(l) || l < 1 || l > 100) msgs.push('Limit must be 1-100')
    if (!Number.isInteger(o) || o < 0) msgs.push('Offset must be >=0')
    if (min !== undefined && (!Number.isFinite(min) || min < 0)) msgs.push('Min calories must be >=0')
    if (max !== undefined && (!Number.isFinite(max) || max < 0)) msgs.push('Max calories must be >=0')
    if (min !== undefined && max !== undefined && min > max) msgs.push('Min cannot exceed max')
    return msgs
  }, [limit, offset, minCal, maxCal])

  async function fetchPage(newOffset: number, join: boolean) {
    setLoading(true)
    setError(null)
    setIssues([])
    const usp = new URLSearchParams({ limit: String(Number(limit)), offset: String(newOffset) })
    if (q) usp.set('q', q)
    if (minCal) usp.set('min_calories', minCal)
    if (maxCal) usp.set('max_calories', maxCal)
    const res = await fetch(`${apiUrl}/v1/meals?${usp.toString()}`)
    if (!res.ok) {
      setLoading(false)
      setError(`Status ${res.status}`)
      return
    }
    const json = await res.json()
    const parsed = MealsSchema.safeParse(json)
    setLoading(false)
    if (!parsed.success) { setIssues(parsed.error.issues as any); return }
    if (join && data?.meals) {
      setData({ ...parsed.data, meals: [...data.meals, ...parsed.data.meals] })
    } else {
      setData(parsed.data)
    }
    setOffset(String(newOffset))
  }

  async function onApply(e: React.FormEvent) {
    e.preventDefault()
    if (validation.length) return
    await fetchPage(0, false)
  }

  async function onPrev() { const o = Math.max(0, Number(offset) - Number(limit)); await fetchPage(o, false) }
  async function onNext() { const o = Number(offset) + Number(limit); await fetchPage(o, false) }
  async function onLoadMore() { const o = Number(offset) + Number(limit); await fetchPage(o, true) }

  return (
    <div>
      <form onSubmit={onApply} className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} name="q" placeholder="Search" className="border p-2 rounded" />
        <input value={minCal} onChange={e=>setMinCal(e.target.value)} name="min_calories" placeholder="Min calories" className="border p-2 rounded" />
        <input value={maxCal} onChange={e=>setMaxCal(e.target.value)} name="max_calories" placeholder="Max calories" className="border p-2 rounded" />
        <input value={limit} onChange={e=>setLimit(e.target.value)} name="limit" placeholder="Limit" className="border p-2 rounded" />
        <input value={offset} onChange={e=>setOffset(e.target.value)} name="offset" placeholder="Offset" className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white rounded p-2">Apply</button>
      </form>
      {validation.length > 0 && <div className="text-red-700 mb-2">{validation.join(' • ')}</div>}
      {error && <div className="text-red-700 mb-2">{error}</div>}
      {issues.length > 0 && <div className="text-yellow-700 mb-2">Invalid schema</div>}
      <DataTable rows={data?.meals || []} columns={[
        { key: 'name', label: 'Name' },
        { key: 'calories', label: 'Calories', align: 'right' },
        { key: 'protein', label: 'Protein', align: 'right' },
        { key: 'carbs', label: 'Carbs', align: 'right' },
        { key: 'fat', label: 'Fat', align: 'right' },
      ] as Column<any>[]} linkKey={'meals'} />
      <div className="flex items-center gap-2 mt-4">
        <button onClick={onPrev} disabled={loading || Number(offset) <= 0} className="bg-gray-200 rounded px-3 py-2">Prev</button>
        <button onClick={onNext} disabled={loading} className="bg-gray-200 rounded px-3 py-2">Next</button>
        <button onClick={onLoadMore} disabled={loading} className="bg-gray-800 text-white rounded px-3 py-2">Load more</button>
        {loading && <span className="text-gray-500">Loading...</span>}
        <span className="ml-auto text-sm text-gray-600">Total: {data?.total ?? 0}</span>
      </div>
    </div>
  )
}
