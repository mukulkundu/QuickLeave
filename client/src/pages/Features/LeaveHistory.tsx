export default function LeaveHistory() {
  // Mock data - replace with actual API call
  const leaveHistory = [
    { id: 1, startDate: "2024-01-10", endDate: "2024-01-12", type: "Sick Leave", status: "approved", reason: "Not feeling well" },
    { id: 2, startDate: "2024-02-05", endDate: "2024-02-05", type: "Casual Leave", status: "rejected", reason: "Personal work" },
    { id: 3, startDate: "2024-03-15", endDate: "2024-03-17", type: "Annual Leave", status: "pending", reason: "Family vacation" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return "✅";
      case "rejected": return "❌";
      case "pending": return "⏳";
      default: return "❓";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Leave History</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveHistory.map((leave) => (
                <tr key={leave.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.startDate} - {leave.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                      {getStatusIcon(leave.status)} {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {leave.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  