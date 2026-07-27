"use client";

import Header from "../components/Header";
import UsageCounter from "../../components/UsageCounter";
import AIForm from "../../components/AIForm";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";


function AIWriterContent() {

  const [freeUses, setFreeUses] = useState(3);
  const [user, setUser] = useState<any>(null);

  const searchParams = useSearchParams();

  const selectedTemplate = searchParams.get("template");


  useEffect(() => {

  const loadUsage = async () => {

    console.log("AI WRITER PAGE RUNNING");

    const {
      data: { session }
    } = await supabase.auth.getSession();


    const currentUser = session?.user;


    console.log(
      "AI WRITER USER:",
      currentUser
    );


    setUser(currentUser);


    if (currentUser) {

      const { data: profile } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", currentUser.id)
        .single();


      console.log(
        "AI WRITER PROFILE:",
        profile
      );

      if (profile) {
        setFreeUses(profile.credits);
      }

      return;
    }

  };

  loadUsage();

}, []);


  return (

    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-6">


      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">


        <Header />


        <div className="mt-6">

          <h1 className="text-4xl font-bold">
            🚀 CLS AI Writer
          </h1>


          <p className="text-gray-600 mt-2">
            Generate blogs, SEO content, emails and more using AI.
          </p>

        </div>



        <AIForm
          freeUses={freeUses}
          setFreeUses={setFreeUses}
          selectedTemplate={selectedTemplate}
        />



                <div className="mt-6">

          {user ? (

            <p className="text-green-600">
              AI Credits: {freeUses}
            </p>

          ) : (

            <>
              <p className="text-red-600">
                Free Uses Remaining: {freeUses}
              </p>

              <UsageCounter
                freeUses={freeUses}
              />
            </>

          )}

        </div>


      </div>   {/* white card close */}


    </main>

  );

}



export default function Home() {


  return (

    <Suspense
      fallback={
        <div className="p-10 text-center">
          Loading AI Writer...
        </div>
      }
    >

      <AIWriterContent />

    </Suspense>

  );

}