import { useEffect, useState } from "react"
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
    }
  }

  // delete leave type
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leave type?")) return
    try {
      await callApi(`/leave/types/${id}`, { method: "DELETE" })
      fetchLeaveTypes()
    } catch (err) {
      console.error("Failed to delete leave type", err)
      setError("Could not delete leave type beacuse it is in use")
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-2xl font-bold mb-4">Manage Leave Types</h2>

      {/* Add new type form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="New leave type (e.g. Sick Leave)"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="flex-grow border p-2 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading leave types...</p>
      ) : leaveTypes.length === 0 ? (
        <p className="text-gray-500">No leave types found.</p>
      ) : (
        <ul className="space-y-2">
          {leaveTypes.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-white p-3 shadow rounded"
            >
              <span>{t.name}</span>
              <button
                onClick={() => handleDelete(t.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  )
}
