import { useState } from "react";

export default function ManageRequests() {
  // Mock data - replace with actual API call
  const [requests, setRequests] = useState([
    { id: 1, employee: "John Doe", email: "john@example.com", startDate: "2024-01-15", endDate: "2024-01-18", type: "Annual Leave", reason: "Family vacation", status: "pending" },
    { id: 2, employee: "Jane Smith", email: "jane@example.com", startDate: "2024-01-20", endDate: "2024-01-20", type: "Sick Leave", reason: "Not feeling well", status: "pending" },
    { id: 3, employee: "Mike Johnson", email: "mike@example.com", startDate: "2024-02-01", endDate: "2024-02-03", type: "Casual Leave", reason: "Personal work", status: "pending" },
  ]);

  const handleApprove = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: "approved" } : req
    ));
  };

  const handleReject = (id: number) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: "rejected" } : req
    ));
  };

  const pendingRequests = requests.filter(req => req.status === "pending");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Leave Requests</h1>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No pending leave requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{request.employee}</h3>
                      <span className="text-sm text-gray-500">{request.email}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Date Range:</span> {request.startDate} - {request.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {request.type}
                      </div>
                      <div>
                        <span className="font-medium">Reason:</span> {request.reason}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
  