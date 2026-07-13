"use client";

import { useState } from "react";

export default function AIForm({
  prompt,
  setPrompt,
  onGenerate,
}: {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  onGenerate: () => boolean;
}) {

  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);


  const generateAI = async () => {

  if (!onGenerate()) {
    return;
  }

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

      setResponse(data.result || "No response received");


    } catch (error) {

      setResponse(
        "Something went wrong. Please try again."
      );

    }


    setLoading(false);

  };


  return (

    <div className="mt-6">

      <textarea

        className="w-full border rounded-lg p-4 h-32"

        placeholder="Enter your prompt here..."

        value={prompt}

        onChange={(e)=>setPrompt(e.target.value)}

      />


      <button

        onClick={generateAI}

        disabled={loading}

        className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg"

      >

        {loading 
          ? "Generating AI Content..."
          : "Generate AI"
        }

      </button>



      <div className="mt-6 bg-gray-50 border rounded-lg p-4">

        <h2 className="font-semibold text-xl">
          AI Response
        </h2>


        <p className="mt-3 whitespace-pre-wrap">

          {response || "Your AI-generated content will appear here..."}

        </p>


      </div>


    </div>

  );

}