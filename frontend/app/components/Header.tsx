export default function Header() {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">

      <div>
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back to CLS AI
        </p>
      </div>

      <div className="flex items-center gap-5">

        <button className="text-2xl">
          🔔
        </button>

        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          👤 Creator
        </div>

      </div>

    </div>
  );
}