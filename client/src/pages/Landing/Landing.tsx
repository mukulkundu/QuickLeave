import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Leave Management</h1>
      <p className="text-gray-600">Apply, manage, and track your leaves easily.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </Link>
        <Link to="/signup" className="bg-gray-300 px-4 py-2 rounded">
          Signup
        </Link>
      </div>
    </div>
  )
}
