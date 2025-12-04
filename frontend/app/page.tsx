export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trae Nutrition Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete nutrition and health tracking platform
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Backend API:</span>
                <span className="text-green-600">✓ Online</span>
              </div>
              <div className="flex justify-between">
                <span>Frontend:</span>
                <span className="text-green-600">✓ Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
