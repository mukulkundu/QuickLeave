import { Link } from "react-router-dom"

type Role = "member" | "manager" | "admin"

export default function Sidebar({ role }: { role: Role }) {
  const linkBase =
    "px-3 py-2 rounded-lg transition-all flex items-center gap-2"

  const activeStyle =
    "text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer"

  const disabledStyle =
    "text-gray-500 bg-gray-800/30 cursor-not-allowed pointer-events-none"

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 space-y-4 border-r border-gray-700">
      <h1 className="font-bold text-lg text-white">Leave Management</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className={`${linkBase} ${activeStyle}`}>
          🏠 Dashboard
        </Link>

        <Link to="/apply" className={`${linkBase} ${activeStyle}`}>
          📝 Apply Leave
        </Link>

        <Link to="/history" className={`${linkBase} ${activeStyle}`}>
          📜 Leave History
        </Link>

        {/* Manager + Admin */}
        <Link
          to={role === "manager" || role === "admin" ? "/requests" : "#"}
          className={`${linkBase} ${
            role === "manager" || role === "admin"
              ? activeStyle
              : disabledStyle
          }`}
        >
          ✅ Manage Requests
        </Link>

        {/* Admin-only */}
        <Link
          to={role === "admin" ? "/users" : "#"}
          className={`${linkBase} ${
            role === "admin" ? activeStyle : disabledStyle
          }`}
        >
          👥 Manage Users
        </Link>

        <Link
          to={role === "admin" ? "/leave-types" : "#"}
          className={`${linkBase} ${
            role === "admin" ? activeStyle : disabledStyle
          }`}
        >
          Manage Leave Types
        </Link>

      </nav>
    </aside>
  )
}
