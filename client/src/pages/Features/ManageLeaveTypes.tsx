import { useEffect, useState } from "react"
import { Settings, Plus, Trash2, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useApi } from "../../ProtectedLayout"

interface LeaveType {
  id: string
  name: string
}

export default function ManageLeaveTypes() {
  const { callApi } = useApi()
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [newType, setNewType] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // fetch all leave types
  const fetchLeaveTypes = async () => {
    setLoading(true)
    try {
      const res = await callApi("/leave/types")
      setLeaveTypes(res || [])
    } catch (err) {
      console.error("Failed to load leave types", err)
      setError("Could not load leave types")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  // add new leave type
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newType.trim()) return
    
    setIsAdding(true)
    setError(null)
    
    try {
      await callApi("/leave/types", {
        method: "POST",
        body: JSON.stringify({ name: newType }),
      })
      setNewType("")
      fetchLeaveTypes()
    } catch (err) {
      console.error("Failed to add leave type", err)
      setError("Could not add leave type")
    } finally {
      setIsAdding(false)
    }
  }

  // delete leave type
  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setError(null)
    
    try {
      await callApi(`/leave/types/${id}`, { method: "DELETE" })
      fetchLeaveTypes()
    } catch (err) {
      console.error("Failed to delete leave type", err)
      setError("Could not delete leave type beacuse it is in use")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="text-gray-600">Loading leave types...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-900 rounded-lg">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Leave Types</h1>
            <p className="text-sm text-gray-500">Configure the types of leave that employees can request</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Leave Types</p>
            <p className="text-3xl font-bold text-blue-600">{leaveTypes.length}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Available options for employee leave requests
        </p>
      </div>

      {/* Add New Type Form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New Leave Type</h3>
          <p className="text-sm text-gray-500 mt-1">Create a new category for leave requests</p>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sick Leave, Annual Leave, Personal Leave"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAdding}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                disabled={isAdding || !newType.trim()}
                className="cursor-pointer inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Type
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Types List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Leave Types</h3>
          <p className="text-sm text-gray-500 mt-1">
            {leaveTypes.length} leave types configured
          </p>
        </div>

        {leaveTypes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No leave types configured</h3>
            <p className="mt-2 text-sm text-gray-500">
              Add your first leave type to get started.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {leaveTypes.map((t) => (
              <div key={t.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{t.name}</h4>
                      <p className="text-xs text-gray-500">Available for employee requests</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {deletingId === t.id ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700 mr-1"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
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

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Pro Tips</p>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Common leave types include: Annual Leave, Sick Leave, Personal Leave, Maternity/Paternity Leave</p>
              <p>• Leave types cannot be deleted if they are currently being used in leave requests</p>
              <p>• Keep leave type names clear and descriptive for easy employee selection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}