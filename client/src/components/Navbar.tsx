import { signOut } from "../lib/auth";

export default function Navbar() {
  const handleLogout = async () => {
    await signOut();
  };
    return (
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Leave Management</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </header>
    )
  }
  