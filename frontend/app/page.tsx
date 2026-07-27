"use client";

import Header from "../components/Header";
import UsageCounter from "../components/UsageCounter";
import AIForm from "../components/AIForm";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function Home() {
  console.log("===== PAGE.TSX RUNNING =====");

  const [freeUses, setFreeUses] = useState(3);

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);


  useEffect(() => {

  const loadUsage = async () => {

    console.log("LOAD USAGE START");

    const {
      data: { session }
    } = await supabase.auth.getSession();


    const currentUser = session?.user;


    console.log("AI WRITER USER:", currentUser);


    setUser(currentUser);


    if (currentUser) {

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", currentUser.id)
        .single();


      console.log("AI WRITER PROFILE:", profile);
      console.log("PROFILE ERROR:", error);


      if (profile) {
        setFreeUses(profile.credits);
      }


      setLoadingUser(false);
      return;
    }


    // Guest logic
    const today = new Date().toDateString();

    const savedDate = localStorage.getItem("cls_ai_date");
    const savedUses = localStorage.getItem("cls_ai_free_uses");


    if (savedDate !== today) {

      localStorage.setItem("cls_ai_date", today);
      localStorage.setItem("cls_ai_free_uses", "3");

      setFreeUses(3);

    } else {

      setFreeUses(Number(savedUses || 3));

    }


    setLoadingUser(false);

  };


  loadUsage();


  const {
    data: authListener
  } = supabase.auth.onAuthStateChange(
    (_event, session) => {

      const currentUser = session?.user || null;

      console.log(
        "AUTH CHANGE USER:",
        currentUser
      );

      setUser(currentUser);

    }
  );


  return () => {
    authListener.subscription.unsubscribe();
  };


}, []);



  useEffect(() => {

  console.log("Home freeUses:", freeUses);

}, [freeUses]);


// YAHAN ADD KARO 👇
if (loadingUser) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading CLS AI...
    </div>
  );
}


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



        {/* AI Generator */}

        <AIForm
  freeUses={freeUses}
  setFreeUses={setFreeUses}
/>



        {/* Free Usage Counter */}

        <div className="mt-6">

          {user ? (
  <p className="text-green-600 font-semibold">
    AI Credits: {freeUses}
  </p>
) : (
  <p className="text-red-600 font-semibold">
    Free Uses Remaining: {freeUses}
  </p>
)}
          <p className="text-blue-600">
  Debug Value: {freeUses}
</p>


          {!user && (
  <UsageCounter 
    freeUses={freeUses}
  />
)}


        </div>



      </div>


    </main>

  );

}