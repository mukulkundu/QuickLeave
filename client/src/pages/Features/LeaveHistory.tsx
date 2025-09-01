import { useEffect, useState } from "react"
import { useApi } from "../../ProtectedLayout"

type LeaveStatus = "pending" | "approved" | "rejected"

interface Leave {
  id: string
  start_date: string
  end_date: string
  reason: string
  status: LeaveStatus
  leave_type_name: string | null
}

export default function LeaveHistory() {
  const { callApi } = useApi()
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await callApi("/leave/my")
        setLeaves(Array.isArray(data.leaves) ? data.leaves : [])
      } catch (err) {
        console.error("Failed to load history", err)
        setError("Could not load leave history.")
      } finally {
        setLoading(false)
      }
    }
    fetchLeaves()
  }, [callApi])

  const cancelLeave = async (id: string) => {
    setCancellingId(id)
    try {
      await callApi(`/leave/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "rejected" }),
      })
      setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "rejected" } : l))
      )
    } catch (err) {
      console.error("Failed to cancel leave", err)
      setError("Could not cancel leave.")
    } finally {
      setCancellingId(null)
    }
  }

  const canCancel = (leave: Leave) => {
    if (leave.status !== "approved") return false
    const start = new Date(leave.start_date)
    const today = new Date()
    const diffDays = (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays >= 1
  }

  if (loading) {
    return <div className="p-6">Loading history...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Leave History</h2>
      {leaves.length === 0 ? (
        <div className="text-gray-500">No leave history found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Dates</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Type of Leave</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="p-3">{l.start_date} → {l.end_date}</td>
                  <td className="p-3">{l.reason}</td>
                  <td className="p-3">{l.leave_type_name ?? "—"}</td>
                  <td className="p-3 capitalize">
                    {l.status === "approved" && <span className="text-green-600">● Approved</span>}
                    {l.status === "pending" && <span className="text-yellow-600">● Pending</span>}
                    {l.status === "rejected" && <span className="text-red-600">● Rejected</span>}
                  </td>
                  <td className="p-3">
                    {canCancel(l) && (
                      <button
                        onClick={() => cancelLeave(l.id)}
                        disabled={cancellingId === l.id}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {cancellingId === l.id ? (
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : (
                          "Cancel Leave"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
