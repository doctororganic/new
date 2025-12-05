import './globals.css'
import QAQuickLinks from '@/components/QAQuickLinks'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b bg-gray-50">
          <nav className="container mx-auto px-4 py-3 flex gap-4">
            <Link href="/" className="font-semibold">DoctorHealthy</Link>
            <Link href="/meals" className="hover:underline">Meals</Link>
            <Link href="/meals/new" className="hover:underline">New Meal</Link>
            <Link href="/workouts" className="hover:underline">Workouts</Link>
            <Link href="/workouts/new" className="hover:underline">New Workout</Link>
            <Link href="/conditions" className="hover:underline">Conditions</Link>
            <div className="ml-auto"><QAQuickLinks /></div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
import Link from 'next/link'
