import { useEffect, useState } from "react"
import { Calendar, FileText, CheckCircle, Clock, AlertCircle, ExternalLink, Unlink } from "lucide-react"
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

  // Calendar integration states
  const [isConnected, setIsConnected] = useState(false)
  const [authUrl, setAuthUrl] = useState<string | null>(null)
  const [loadingCalendar, setLoadingCalendar] = useState(true)
  const [calendarMessage, setCalendarMessage] = useState("")

  // Get the display name
  const displayName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.user_metadata?.name ||
    session?.user?.email?.split("@")[0] ||
    "User"

  // Fetch leave stats
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await callApi("/leave/my")
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

  // Fetch calendar status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { isConnected } = await callApi("/calendar/status")
        setIsConnected(isConnected)
        setCalendarMessage(
          isConnected
            ? "Google Calendar is connected and syncing your leaves."
            : "Connect Google Calendar to automatically sync approved leaves."
        )

        if (!isConnected) {
          const { authUrl } = await callApi("/calendar/auth-url")
          setAuthUrl(authUrl)
        }
      } catch (err) {
        console.error("Error fetching calendar status:", err)
        setCalendarMessage("Could not fetch calendar status.")
      } finally {
        setLoadingCalendar(false)
      }
    }
    fetchStatus()
  }, [callApi])

  // Handle redirect query params (?calendar=connected or ?calendar=error)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const calendarStatus = params.get("calendar")

    if (calendarStatus === "connected") {
      setIsConnected(true)
      setCalendarMessage("Successfully connected to Google Calendar.")
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (calendarStatus === "error") {
      setIsConnected(false)
      setCalendarMessage("Failed to connect to Google Calendar.")
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleDisconnect = async () => {
    try {
      if (!session?.user?.id) {
        setCalendarMessage("Cannot disconnect: missing user ID.")
        return
      }

      await callApi(`/calendar/disconnect/${session.user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      setIsConnected(false)
      setCalendarMessage("Google Calendar has been disconnected.")

      // refresh authUrl for reconnect
      const { authUrl } = await callApi("/calendar/auth-url")
      setAuthUrl(authUrl)
    } catch (err) {
      console.error("Error disconnecting:", err)
      setCalendarMessage("Failed to disconnect calendar.")
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, <span className="font-medium">{displayName}</span>! Here's your leave overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Leaves */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Leaves
              </p>
              <p className="text-3xl font-bold text-orange-600">{pending}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Awaiting manager approval
          </p>
        </div>

        {/* Approved Leaves */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Approved Leaves
              </p>
              <p className="text-3xl font-bold text-green-600">{approved}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Ready for time off
          </p>
        </div>

        {/* Total Leaves */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Leaves
              </p>
              <p className="text-3xl font-bold text-blue-600">{total}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            This year so far
          </p>
        </div>
      </div>

      {/* Calendar Integration Card */}
      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Google Calendar Integration
            </h3>
          </div>

          {loadingCalendar ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <span>Loading calendar status...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-start space-x-3 p-4 rounded-lg ${
                isConnected 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                {isConnected ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isConnected ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </p>
                  <p className={`text-sm ${
                    isConnected ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {calendarMessage}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {isConnected ? (
                  <button
                    onClick={handleDisconnect}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    Disconnect Calendar
                  </button>
                ) : (
                  <button
                    onClick={() => authUrl && (window.location.href = authUrl)}
                    disabled={!authUrl}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Google Calendar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
            <FileText className="w-4 h-4 mr-2" />
            Apply for Leave
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Clock className="w-4 h-4 mr-2" />
            View Leave History
          </button>
        </div>
      </div>
    </div>
  )
}