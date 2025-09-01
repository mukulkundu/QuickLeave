import { useEffect, useState } from "react"
import { useApi } from "../../ProtectedLayout"

type LeaveStatus = "pending" | "approved" | "rejected"

interface LeaveRequest {
  id: string
  user_name: string | null
  user_email: string | null
  start_date: string
  end_date: string
  reason: string
  status: LeaveStatus
  leave_type_name: string | null
}

export default function ManageRequests() {
  const { callApi } = useApi()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await callApi("/leave/all")
        setRequests(Array.isArray(data.requests) ? data.requests : [])
      } catch (err) {
        console.error("Failed to load requests", err)
        setError("Could not load leave requests.")
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [callApi])

  const updateStatus = async (id: string, newStatus: LeaveStatus) => {
    try {
      await callApi(`/leave/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })

      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      )

      if (newStatus === "approved") {
        alert("✅ Leave approved. Added to Google Calendar if connected.")
      } else {
        alert("❌ Leave rejected.")
      }
    } catch (err) {
      console.error("Failed to update status", err)
      setError("Could not update request status.")
    }
  }

  if (loading) return <div className="p-6">Loading leave requests...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  const pendingRequests = requests.filter((r) => r.status === "pending")

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Leave Requests</h2>
      {pendingRequests.length === 0 ? (
        <div className="text-gray-500">No pending requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Employee Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Type of Leave</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.user_name ?? "—"}</td>
                  <td className="p-3">{r.user_email ?? "—"}</td>
                  <td className="p-3">
                    {r.start_date} → {r.end_date}
                  </td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">{r.leave_type_name ?? "—"}</td>
                  <td className="p-3 capitalize">
                    <span className="text-yellow-600">● Pending</span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => updateStatus(r.id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "rejected")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
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
