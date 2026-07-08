"use client";

import { useState } from "react";

export default function Home() {
const [prompt, setPrompt] = useState("");
const [response, setResponse] = useState("");
const [loading, setLoading] = useState(false);
const generateAI = async () => {
  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  setLoading(true);
  setResponse("");

  try {
    const res = await fetch(
      "https://cls-ai-engine.onrender.com/api/ai/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: prompt,
        }),
      }
    );

    const data = await res.json();
    setResponse(data.result);
  } catch (error) {
    setResponse("Something went wrong. Please try again.");
  }

  setLoading(false);
};
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
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
></textarea>

          <button
  onClick={generateAI}
  disabled={loading}
  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400"
>
  {loading ? "Generating..." : "Generate AI"}
</button>
        </div>

        <div className="mt-8 border rounded-lg p-5 bg-gray-50">
          <h2 className="text-xl font-semibold mb-3">AI Response</h2>

          <p className="text-gray-700 whitespace-pre-wrap">
  {response || "Your AI-generated content will appear here..."}
</p>
        </div>
      </div>
    </main>
  );
}