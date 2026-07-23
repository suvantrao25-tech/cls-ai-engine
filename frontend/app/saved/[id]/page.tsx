"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SavedDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const router = useRouter();

  const [content, setContent] = useState<any>(null);
  const [id, setId] = useState("");


  const loadContent = async () => {

    if(!id) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();


    if (!user) {
      router.push("/login");
      return;
    }


    const { data, error } = await supabase
      .from("saved_content")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();


    console.log("USER:", user);
    console.log("ID:", id);
    console.log("DATA:", data);
    console.log("ERROR:", error);


    if(error){
      console.log(error);
      return;
    }


    setContent(data);

  };



  useEffect(() => {

    const getParams = async () => {

      const data = await params;

      setId(data.id);

    };

    getParams();

  }, [params]);



  useEffect(() => {

    if(id){
      loadContent();
    }

  }, [id]);



  


    



  if (!content) {

    return (

      <main className="min-h-screen bg-gray-100 p-8">

        <p className="text-gray-600">
          Loading saved content...
        </p>

      </main>

    );

  }



  return (

    <main className="min-h-screen bg-gray-100 p-8">


      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">


        <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-200 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>



        <h1 className="text-3xl font-bold">
          {content.template}
        </h1>



        <p className="text-gray-500 mt-3">
          Prompt: {content.prompt}
        </p>



        <div className="border-t my-6"></div>



        <div className="whitespace-pre-wrap text-gray-700 leading-8">

          {content.response}

        </div>



        <button
        onClick={() =>
          navigator.clipboard.writeText(content.response)
        }
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          📋 Copy Content
        </button>


      </div>


    </main>

  );

}