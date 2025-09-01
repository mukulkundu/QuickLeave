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
            ? "✅ Google Calendar is connected."
            : "⚠️ Google Calendar is not connected."
        )

        if (!isConnected) {
          const { authUrl } = await callApi("/calendar/auth-url")
          setAuthUrl(authUrl)
        }
      } catch (err) {
        console.error("❌ Error fetching calendar status:", err)
        setCalendarMessage("❌ Could not fetch calendar status.")
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
      setCalendarMessage("✅ Successfully connected to Google Calendar.")
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (calendarStatus === "error") {
      setIsConnected(false)
      setCalendarMessage("❌ Failed to connect to Google Calendar.")
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleDisconnect = async () => {
    try {
      if (!session?.user?.id) {
        setCalendarMessage("❌ Cannot disconnect: missing user ID.")
        return
      }

      await callApi(`/calendar/disconnect/${session.user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      setIsConnected(false)
      setCalendarMessage("⚠️ Google Calendar has been disconnected.")

      // refresh authUrl for reconnect
      const { authUrl } = await callApi("/calendar/auth-url")
      setAuthUrl(authUrl)
    } catch (err) {
      console.error("❌ Error disconnecting:", err)
      setCalendarMessage("❌ Failed to disconnect calendar.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {displayName}!</p>
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

      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Google Calendar Integration
        </h3>

        {loadingCalendar ? (
          <p>Loading calendar status...</p>
        ) : (
          <>
            <p className="mb-4 text-gray-700">{calendarMessage}</p>

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => authUrl && (window.location.href = authUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={!authUrl}
              >
                Connect Google Calendar
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
