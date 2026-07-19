"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

export default function AIForm() {

  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState("Blog Writer");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);


  useEffect(() => {

    const getUser = async () => {

      const {
        data: { session }
      } = await supabase.auth.getSession();

      setUser(session?.user || null);

    };

    getUser();

  }, []);



  const generateAI = async () => {

    if (!prompt.trim()) {
      alert("Enter prompt");
      return;
    }


    setLoading(true);
    setResponse("");


    try {

      const res = await fetch(
        "https://cls-ai-engine.onrender.com/api/ai/generate",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            text:`${template}: ${prompt}`

          })

        }
      );


      const data = await res.json();


      const aiResponse =
      data.result || "No response";


      setResponse(aiResponse);



      if(user){

        await supabase
        .from("history")
        .insert({

          user_id:user.id,
          template:template,
          prompt:prompt,
          response:aiResponse

        });


        const words =
        aiResponse.trim()
        .split(/\s+/)
        .length;



        const {data:profile}=await supabase
        .from("profiles")
        .select("*")
        .eq("id",user.id)
        .single();



        if(profile){

          await supabase
          .from("profiles")
          .update({

            words_generated:
            profile.words_generated + words,

            blogs_generated:
            profile.blogs_generated + 1,

            credits:
            profile.credits - words

          })
          .eq("id",user.id);

        }


      }


    }
    catch(error){

      console.log(error);

      setResponse(
        "Something went wrong"
      );

    }


    setLoading(false);

  };



return (

<div className="mt-6">


<div className="mb-6">

  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Choose AI Template
  </label>

  <select
    value={template}
    onChange={(e) => setTemplate(e.target.value)}
    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
  >
    <option value="Blog Writer">✍️ Blog Writer</option>
    <option value="SEO Writer">🔍 SEO Writer</option>
    <option value="Email Writer">📧 Email Writer</option>
    <option value="Social Media Post">📱 Social Media Post</option>
    <option value="Product Description">🛒 Product Description</option>
  </select>

</div>



<div className="mb-6">

  <div className="flex justify-between items-center mb-2">

    <label className="text-sm font-semibold text-gray-700">
      Enter Your Prompt
    </label>

    <span className="text-xs text-gray-500">
      {prompt.length} Characters
    </span>

  </div>

  <textarea
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    rows={8}
    placeholder="Describe what you want AI to create..."
    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-gray-700 shadow-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
  />

</div>



<button
  onClick={generateAI}
  disabled={loading}
  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      Generating AI...
    </span>
  ) : (
    "✨ Generate AI Content"
  )}
</button>



<div className="mt-8 bg-white border rounded-2xl shadow-lg p-6">

  <div className="flex justify-between items-center mb-5">

    <h2 className="text-2xl font-bold">
      🤖 AI Response
    </h2>

    {response && (
      <span className="text-sm text-gray-500">
        📝 Words: {response.trim().split(/\s+/).length}
      </span>
    )}

  </div>

  <div className="min-h-[250px] text-gray-700 leading-8">

  {response ? (

    <div className="prose max-w-none">

  <ReactMarkdown>
    {response}
  </ReactMarkdown>

</div>

  ) : (

    <p className="text-gray-400">
      Your AI-generated content will appear here...
    </p>

  )}

</div>

  {response && (

    <div className="flex gap-3 mt-6">

      <button
        onClick={() => navigator.clipboard.writeText(response)}
        className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        📋 Copy
      </button>

      <button
        onClick={() => {
          const blob = new Blob([response], { type: "text/plain" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = "cls-ai-content.txt";
          a.click();

          URL.revokeObjectURL(url);
        }}
        className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        ⬇ Download
      </button>

      <button
        onClick={() => setResponse("")}
        className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
      >
        🗑 Clear
      </button>

    </div>

  )}

</div>


</div>

);


}