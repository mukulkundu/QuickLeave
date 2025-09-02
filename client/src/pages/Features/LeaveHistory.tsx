import { useEffect, useState } from "react"
import { History, Calendar, FileText, CheckCircle, Clock, XCircle, Ban, AlertCircle } from "lucide-react"
import { useApi } from "../../ProtectedLayout"

type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"

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
        body: JSON.stringify({ status: "cancelled" }),
      })
      setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: "cancelled" } : l))
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

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <Ban className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadgeClass = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="text-gray-600">Loading history...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pendingCount = leaves.filter(l => l.status === "pending").length
  const approvedCount = leaves.filter(l => l.status === "approved").length
  const rejectedCount = leaves.filter(l => l.status === "rejected").length
  const cancelledCount = leaves.filter(l => l.status === "cancelled").length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-900 rounded-lg">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Leave History</h1>
            <p className="text-sm text-gray-500">Track all your leave requests and their current status</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Ban className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-3xl font-bold text-gray-600">{cancelledCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leave History Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
          <p className="text-sm text-gray-500 mt-1">
            {leaves.length} total requests in your history
          </p>
        </div>

        {leaves.length === 0 ? (
          <div className="p-12 text-center">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No leave history</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't submitted any leave requests yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            {new Date(l.start_date).toLocaleDateString()} → {new Date(l.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(l.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} - {new Date(l.end_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {calculateDays(l.start_date, l.end_date)}
                        </div>
                        <div className="text-xs text-gray-500">days</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{l.leave_type_name || "General Leave"}</span>
                        </div>
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={l.reason}>
                          {l.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(l.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(l.status)}`}>
                          {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        {canCancel(l) && (
                          <button
                            onClick={() => cancelLeave(l.id)}
                            disabled={cancellingId === l.id}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {cancellingId === l.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700 mr-1"></div>
                                Cancelling...
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3 mr-1" />
                                Cancel Leave
                              </>
                            )}
                          </button>
                        )}
                        {!canCancel(l) && (
                          <span className="text-xs text-gray-400">
                            {l.status === "approved" ? "Cannot cancel" : "No actions"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}