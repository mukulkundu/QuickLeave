import { useEffect, useState } from "react"
import { useApi } from "../../ProtectedLayout"
import { useAuth } from "../../hooks/useAuth"

type LeaveStatus = "pending" | "approved" | "rejected"

interface Leave {
  id: string
  start_date: string
  end_date: string
  reason: string
  status: LeaveStatus
}

export default function Dashboard() {
  const { session } = useAuth()
  const { callApi } = useApi()

  const [pending, setPending] = useState(0)
  const [approved, setApproved] = useState(0)
  const [total, setTotal] = useState(0)

  // Get the display name
  const displayName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.user_metadata?.name ||
    session?.user?.email?.split("@")[0] || // fallback
    "User"

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await callApi("/leave/my")

        // Handle different response shapes
        const data: Leave[] = Array.isArray(res)
          ? res
          : res?.requests || res?.leaves || []

        if (Array.isArray(data)) {
          const pendingCount = data.filter((l: Leave) => l.status === "pending").length
          const approvedCount = data.filter((l: Leave) => l.status === "approved").length
          setPending(pendingCount)
          setApproved(approvedCount)
          setTotal(data.length)
        }
      } catch (err) {
        console.error("Failed to fetch leave stats", err)
      }
    }
    fetchLeaves()
  }, [callApi])

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {displayName}!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Leaves</h3>
          <p className="text-3xl font-bold text-blue-600">{pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved Leaves</h3>
          <p className="text-3xl font-bold text-green-600">{approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Leaves</h3>
          <p className="text-3xl font-bold text-purple-600">{total}</p>
        </div>
      </div>
    </div>
  )
}
