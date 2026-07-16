"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {

  const [history, setHistory] = useState<any[]>([]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };


   const deleteHistory = async (id: string) => {

    const confirmDelete = confirm("Delete this history?");

    if (!confirmDelete) return;


    const { error } = await supabase
      .from("history")
      .delete()
      .eq("id", id);


    if (error) {
      console.log(error);
      return;
    }


    setHistory(
      history.filter((item) => item.id !== id)
    );

  };


  useEffect(() => {

  
    const loadHistory = async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();


      if (!user) return;


      const { data, error } = await supabase
        .from("history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });


      if (error) {
        console.log(error);
        return;
      }


      setHistory(data || []);

    };


    loadHistory();

  }, []);



  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📜 AI History
      </h1>


      <div className="space-y-5">


        {history.map((item) => (

          <div
            key={item.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >

            <h2 className="text-xl font-bold">
              {item.template}
            </h2>


            <p className="text-gray-600 mt-2">
              {item.prompt}
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">

  <h3 className="font-semibold">
    🤖 AI Response
  </h3>

  <p className="mt-2 text-gray-700 whitespace-pre-wrap line-clamp-5">
    {item.response}
  </p>

</div>


            <p className="text-sm text-gray-400 mt-3">
              {new Date(item.created_at).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
  📝 Words: {item.response?.split(" ").length || 0}
</p>
            <div className="mt-4 flex gap-3">

  <button
    onClick={() => copyText(item.response)}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    📋 Copy
  </button>


  <button
    onClick={() => deleteHistory(item.id)}
    className="bg-red-600 text-white px-4 py-2 rounded-lg"
  >
    🗑 Delete
  </button>

</div>


          </div>

        ))}


      </div>


    </main>

  );

}