import { useEffect, useState } from "react"
import { Users, User, Crown, Shield, UserCheck, UserX, Mail, AlertCircle } from "lucide-react"
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
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null)
  const [targetRole, setTargetRole] = useState<Role | null>(null)

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
    setUpdatingEmail(email)
    setTargetRole(newRole)
    try {
      await callApi("/admin/update-role", {
        method: "POST",
        body: JSON.stringify({ email, role: newRole }),
      })
      setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error("Failed to update role", err)
      setError("Failed to update role.")
    } finally {
      setUpdatingEmail(null)
      setTargetRole(null)
    }
  }

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-red-500" />
      case "manager":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-green-500" />
    }
  }

  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getRoleDescription = (role: Role) => {
    switch (role) {
      case "admin":
        return "Full system access"
      case "manager":
        return "Team management access"
      default:
        return "Basic user access"
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="text-gray-600">Loading users...</span>
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

  const memberCount = users.filter(u => u.role === "member").length
  const managerCount = users.filter(u => u.role === "manager").length
  const adminCount = users.filter(u => u.role === "admin").length

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-900 rounded-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500">Manage user roles and permissions across your organization</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Members</p>
              <p className="text-3xl font-bold text-green-600">{memberCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Managers</p>
              <p className="text-3xl font-bold text-blue-600">{managerCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Crown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-3xl font-bold text-red-600">{adminCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage roles and permissions for {users.length} users
          </p>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-sm text-gray-500">
              There are no users to manage at the moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {u.name || "Unknown User"}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(u.role)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(u.role)}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getRoleDescription(u.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {u.role === "member" && (
                          <button
                            onClick={() => updateRole(u.email, "manager")}
                            disabled={updatingEmail === u.email}
                            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {updatingEmail === u.email && targetRole === "manager" ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700 mr-1"></div>
                                Making...
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Make Manager
                              </>
                            )}
                          </button>
                        )}
                        {u.role === "manager" && (
                          <button
                            onClick={() => updateRole(u.email, "member")}
                            disabled={updatingEmail === u.email}
                            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {updatingEmail === u.email && targetRole === "member" ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-700 mr-1"></div>
                                Removing...
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                Remove Manager
                              </>
                            )}
                          </button>
                        )}
                        {u.role === "admin" && (
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <Crown className="w-3 h-3" />
                            <span>Protected</span>
                          </div>
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