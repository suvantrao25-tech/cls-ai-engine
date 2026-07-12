"use client";

import { useState } from "react";

export default function Home() {

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);


  const templates = [
    {
      name: "✍️ Blog Writer",
      prompt: "Write a detailed SEO optimized blog about: ",
    },
    {
      name: "🔍 SEO Writer",
      prompt: "Create SEO content with keywords for: ",
    },
    {
      name: "📧 Email Writer",
      prompt: "Write a professional email about: ",
    },
    {
      name: "📱 Social Media Post",
      prompt: "Create an engaging social media post about: ",
    },
    {
      name: "🛒 Product Description",
      prompt: "Create a high converting product description for: ",
    },
  ];



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

      setResponse(
        "Something went wrong. Please try again."
      );

    }


    setLoading(false);

  };




  const copyText = () => {

    navigator.clipboard.writeText(response);

    setCopied(true);


    setTimeout(() => {

      setCopied(false);

    }, 2000);

  };





  const downloadText = () => {

    const file = new Blob(
      [response],
      {
        type: "text/plain",
      }
    );


    const link = document.createElement("a");


    link.href = URL.createObjectURL(file);


    link.download = "CLS-AI-Content.txt";


    link.click();

  };





  return (

    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">


      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">


        <h1 className="text-4xl font-bold text-center text-blue-600">
          🚀 CLS AI Writer
        </h1>


        <p className="text-center text-gray-600 mt-3">
          Generate blogs, SEO content, emails and more using AI.
        </p>




        <h2 className="text-xl font-semibold mt-8">
          Choose AI Template
        </h2>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">


          {templates.map((item) => (

            <button

              key={item.name}

              onClick={() => setPrompt(item.prompt)}

              className="border p-3 rounded-lg hover:bg-blue-50"

            >

              {item.name}

            </button>

          ))}


        </div>





        <textarea

          className="w-full border rounded-lg p-4 h-40 mt-6 outline-none"

          placeholder="Enter your prompt here..."

          value={prompt}

          onChange={(e) => setPrompt(e.target.value)}

        />





        <button

          onClick={generateAI}

          disabled={loading}

          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-gray-400"

        >

          {loading 
            ? "Generating AI Content..."
            : "Generate AI"
          }

        </button>

<div className="flex gap-4 mt-6">

<a
href="https://app.creatorlaunchspace.com/login"
className="bg-blue-600 text-white px-6 py-3 rounded-lg"
>
Login
</a>


<a
href="https://app.creatorlaunchspace.com/signup"
className="bg-gray-900 text-white px-6 py-3 rounded-lg"
>
Create Free Account
</a>

</div>



        {loading && (

          <div className="text-center mt-5 text-blue-600 font-semibold">

            🤖 AI is generating content...

          </div>

        )}






        <div className="mt-8 border rounded-lg p-5 bg-gray-50">


          <div className="flex justify-between items-center">


            <h2 className="text-xl font-semibold">

              AI Response

            </h2>




            {response && (

              <div className="flex gap-2">


                <button

                  onClick={copyText}

                  className="bg-green-600 text-white px-4 py-2 rounded-lg"

                >

                  {copied ? "✓ Copied" : "📋 Copy"}

                </button>




                <button

                  onClick={downloadText}

                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"

                >

                  ⬇ Download

                </button>


              </div>

            )}


          </div>






          <p className="text-gray-700 whitespace-pre-wrap mt-4">

            {response || "Your AI-generated content will appear here..."}

          </p>






          {response && (

            <div className="text-sm text-gray-500 mt-4">

              Words: {response.trim().split(/\s+/).length}

              {" | "}

              Characters: {response.length}

            </div>

          )}




        </div>




      </div>


    </main>

  );

}