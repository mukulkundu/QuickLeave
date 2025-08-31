import { useState } from "react";

export default function ApplyLeave() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement leave application logic
    console.log("Leave application:", { startDate, endDate, reason });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for Leave</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Leave
            </label>
            <textarea
              id="reason"
              placeholder="Please provide a reason for your leave request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
}
