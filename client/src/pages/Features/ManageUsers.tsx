import { useEffect, useState } from "react"
import { useApi } from "../../ProtectedLayout" 

type Role = "member" | "manager" | "admin"

interface User {
  name: string | null
  email: string
  role: Role
}

export default function ManageUsers() {
  const { callApi } = useApi()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await callApi("/admin/users")
        setUsers(Array.isArray(data?.users) ? data.users : [])
      } catch (err) {
        console.error("Failed to load users", err)
        setError("Could not load users.")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [callApi])

  const updateRole = async (email: string, newRole: Role) => {
    try {
      await callApi("/admin/update-role", {
        method: "POST",
        body: JSON.stringify({ email, role: newRole }),
      })
      setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error("Failed to update role", err)
      setError("Failed to update role.")
    }
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t">
                  <td className="p-3">{u.name || "—"}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    {u.role === "member" && (
                      <button
                        onClick={() => updateRole(u.email, "manager")}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Make Manager
                      </button>
                    )}
                    {u.role === "manager" && (
                      <button
                        onClick={() => updateRole(u.email, "member")}
                        className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        Remove Manager
                      </button>
                    )}
                    {u.role === "admin" && (
                      <span className="text-gray-500">—</span>
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
