import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { session } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.email || 'User'}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Leaves</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved Leaves</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Leaves</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
}
  