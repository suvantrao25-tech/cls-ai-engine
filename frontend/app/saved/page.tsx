"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SavedPage() {

  const [savedContent, setSavedContent] = useState<any[]>([]);


  useEffect(() => {

    loadSavedContent();

  }, []);


  const loadSavedContent = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser();


    if (!user) return;


    const { data, error } = await supabase
      .from("saved_content")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending:false
      });


    if(error){
      console.log(error);
      return;
    }


    setSavedContent(data || []);

  };



  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <h1 className="text-4xl font-bold mb-8">
        💾 Saved Content
      </h1>



      <div className="space-y-6">


      {savedContent.map((item)=>(

        <div
        key={item.id}
        className="bg-white p-6 rounded-xl shadow"
        >


          <h2 className="text-xl font-bold">
            {item.template}
          </h2>


          <p className="text-gray-500 mt-2">
            {item.prompt}
          </p>


          <div className="mt-4 border-t pt-4 text-gray-700">
            {item.response.substring(0,300)}...
          </div>
          <button
onClick={() =>
  window.location.href = `/saved/${item.id}`
}
className="mt-4 mr-3 bg-green-600 text-white px-4 py-2 rounded-lg"
>
  👁 View Full
</button>


          <button
          onClick={() =>
            navigator.clipboard.writeText(item.response)
          }
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            📋 Copy
          </button>
          <button
onClick={async () => {

  const confirmDelete = confirm(
    "Delete this saved content?"
  );

  if (!confirmDelete) return;


  const { error } = await supabase
    .from("saved_content")
    .delete()
    .eq("id", item.id);


  if(error){

    console.log(error);
    alert("Delete failed");

  } else {

    setSavedContent(
      savedContent.filter(
        (content) => content.id !== item.id
      )
    );

    alert("Content deleted successfully ✅");

}

}}
className="mt-4 ml-3 bg-red-600 text-white px-4 py-2 rounded-lg"
>
  🗑 Delete
</button>


        </div>

      ))}



      {savedContent.length === 0 && (

        <div className="bg-white p-8 rounded-xl shadow">

          <p className="text-gray-500">
            You haven't saved any AI content yet.
          </p>

        </div>

      )}



      </div>


    </main>

  );

}