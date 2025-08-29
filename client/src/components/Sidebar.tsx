import { Link } from "react-router-dom"

export default function Sidebar({ role }: { role: "employee" | "manager" }) {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard">🏠 Dashboard</Link>
        <Link to="/apply">📝 Apply Leave</Link>
        <Link to="/history">📜 Leave History</Link>
        {role === "manager" && <Link to="/requests">✅ Manage Requests</Link>}
        <Link to="/settings">⚙️ Settings</Link>
      </nav>
    </aside>
  )
}
