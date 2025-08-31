import { useEffect, useState } from "react"
import { useApi } from "../../ProtectedLayout"
import { useAuth } from "../../hooks/useAuth"

export default function Dashboard() {
  const { session } = useAuth()
  const { callApi } = useApi()
  const [backendResponse, setBackendResponse] = useState<any>(null)

  useEffect(() => {
    callApi("/users/me")
      .then(setBackendResponse)
      .catch(err => setBackendResponse({ error: err.message }))
  }, [callApi])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.email || "User"}!
        </p>
      </div>

      {/* Backend Test */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Backend Auth Test</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {backendResponse ? JSON.stringify(backendResponse, null, 2) : "Loading..."}
        </pre>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pending Leaves", value: 0, color: "text-blue-600" },
          { label: "Approved Leaves", value: 0, color: "text-green-600" },
          { label: "Total Leaves", value: 0, color: "text-purple-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
