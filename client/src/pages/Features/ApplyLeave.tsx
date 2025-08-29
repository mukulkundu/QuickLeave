export default function ApplyLeave() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Apply for Leave</h1>
      <form className="space-y-4">
        <input type="date" className="border p-2 w-full" />
        <input type="date" className="border p-2 w-full" />
        <textarea placeholder="Reason" className="border p-2 w-full" rows={3}></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  )
}
