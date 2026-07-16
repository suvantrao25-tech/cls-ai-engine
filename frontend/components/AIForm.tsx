"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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


<select

className="w-full border p-3 rounded-lg mb-4"

value={template}

onChange={(e)=>setTemplate(e.target.value)}

>

<option>Blog Writer</option>
<option>SEO Writer</option>
<option>Email Writer</option>
<option>Social Media Post</option>
<option>Product Description</option>

</select>



<textarea

className="w-full border rounded-lg p-4 h-32"

placeholder="Enter your prompt..."

value={prompt}

onChange={(e)=>setPrompt(e.target.value)}

 />



<button

onClick={generateAI}

disabled={loading}

className="mt-4 bg-blue-600 text-white w-full py-3 rounded-lg"

>

{loading 
?"Generating..."
:"Generate AI"}

</button>



<div className="mt-6 bg-gray-100 p-5 rounded-xl">

<h2 className="font-bold text-xl">

🤖 AI Response

</h2>


<p className="mt-3 whitespace-pre-wrap">

{response || 
"Your AI content will appear here..."}

</p>


</div>


</div>

);


}