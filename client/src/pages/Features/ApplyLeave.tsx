import { useEffect, useState } from "react"
import { Calendar, FileText, Send, AlertCircle, CheckCircle, Clock } from "lucide-react"
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
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [leaveTypeId, setLeaveTypeId] = useState<string>("")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch leave types on mount
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
    setIsSubmitting(true)

    try {
      await callApi("/leave", {
        method: "POST",
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          reason,
          leave_type_id: leaveTypeId,
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-900 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Apply for Leave</h1>
            <p className="text-sm text-gray-500">Submit a new leave request for approval</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Leave Request Details</h3>
              <p className="text-sm text-gray-500 mt-1">Fill in the details for your leave request</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Leave Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type of Leave
                </label>
                <select
                  value={leaveTypeId}
                  onChange={(e) => setLeaveTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select leave type</option>
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Leave
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={4}
                  placeholder="Please provide a detailed reason for your leave request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500">{reason.length}/500 characters</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Duration Summary */}
          {startDate && endDate && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Duration Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Days:</span>
                  <span className="text-lg font-bold text-blue-600">{calculateDays()}</span>
                </div>
                <div className="text-xs text-gray-500">
                  From {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {/* Guidelines */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Leave Guidelines</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Submit requests at least 48 hours in advance</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Provide detailed reason for leave</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Check with team before submitting</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Manager approval required</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Leave Balance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Annual Leave:</span>
                <span className="font-medium text-gray-900">12 days left</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Sick Leave:</span>
                <span className="font-medium text-gray-900">8 days left</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Personal Leave:</span>
                <span className="font-medium text-gray-900">3 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Success!</p>
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}