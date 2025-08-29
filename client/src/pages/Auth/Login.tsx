export default function Login() {
    return (
      <div className="bg-white shadow p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="border p-2 w-full" />
          <input type="password" placeholder="Password" className="border p-2 w-full" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Login
          </button>
        </form>
      </div>
    )
  }
  