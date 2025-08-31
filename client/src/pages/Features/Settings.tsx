import { useAuth } from "../../hooks/useAuth";

export default function Settings() {
  const { session } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={session?.user?.id || ""}
                  disabled
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                  Email notifications for leave updates
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="calendarSync"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="calendarSync" className="ml-2 block text-sm text-gray-900">
                  Sync approved leaves with Google Calendar
                </label>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account</h3>
            <div className="space-y-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Change Password
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  