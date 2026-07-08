export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          🚀 CLS AI Writer
        </h1>

        <p className="text-center text-gray-600 mt-3">
          Generate blogs, SEO content, emails and more using AI.
        </p>

        <div className="mt-8">
          <textarea
            className="w-full border rounded-lg p-4 h-40 outline-none"
            placeholder="Enter your prompt here..."
          ></textarea>

          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
            Generate AI
          </button>
        </div>

        <div className="mt-8 border rounded-lg p-5 bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">AI Response</h2>

          <p className="text-gray-600">
            Your AI-generated content will appear here...
          </p>
        </div>
      </div>
    </main>
  );
}