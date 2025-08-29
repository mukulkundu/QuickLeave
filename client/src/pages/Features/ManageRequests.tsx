export default function ManageRequests() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Manage Leave Requests</h1>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between bg-white p-4 shadow rounded">
            <span>Employee A - Jan 15 to Jan 18</span>
            <div className="space-x-2">
              <button className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
              <button className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  