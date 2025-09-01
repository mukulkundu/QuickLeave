import { useEffect, useState } from "react"
import { useApi } from "../../ProtectedLayout"

interface LeaveType {
  id: string
  name: string
}

export default function ApplyLeave() {
  const { callApi } = useApi()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]) // ✅ fetched options
  const [leaveTypeId, setLeaveTypeId] = useState<string>("") // ✅ selected option
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ✅ Fetch leave types on mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const data = await callApi("/leave/types")
        if (Array.isArray(data)) {
          setLeaveTypes(data)
          if (data.length > 0) {
            setLeaveTypeId(data[0].id) // default first option
          }
        }
      } catch (err) {
        console.error("Failed to load leave types", err)
        setError("Could not load leave types.")
      }
    }
    fetchLeaveTypes()
  }, [callApi])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    try {
      await callApi("/leave", {
        method: "POST",
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          reason,
          leave_type_id: leaveTypeId, // ✅ store id
        }),
      })
      setMessage("Leave request submitted successfully!")
      setStartDate("")
      setEndDate("")
      setReason("")
      if (leaveTypes.length > 0) setLeaveTypeId(leaveTypes[0].id) // reset to first
    } catch (err) {
      console.error("Failed to apply leave", err)
      setError("Failed to apply for leave.")
    }
  }

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Apply for Leave</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded-lg"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* ✅ Dynamic Leave Types Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Type of Leave</label>
          <select
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            {leaveTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}
