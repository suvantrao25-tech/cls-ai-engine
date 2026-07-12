export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        🚀 CLS AI
      </h1>

      <nav className="flex flex-col gap-4">

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          🏠 Dashboard
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          ✍️ AI Writer
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          📄 History
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          📚 Templates
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          💾 Saved Content
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          💳 Billing
        </button>

        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800">
          ⚙️ Settings
        </button>

      </nav>

    </aside>
  );
}