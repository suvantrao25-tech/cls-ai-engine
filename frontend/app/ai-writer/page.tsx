"use client";

import Header from "../components/Header";
import UsageCounter from "../../components/UsageCounter";
import AIForm from "../../components/AIForm";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";


function AIWriterContent() {

  const [freeUses, setFreeUses] = useState(3);

  const searchParams = useSearchParams();

  const selectedTemplate = searchParams.get("template");


  useEffect(() => {

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

          <p className="text-red-600">
            Free Uses Remaining: {freeUses}
          </p>


          <UsageCounter
            freeUses={freeUses}
          />

        </div>


      </div>


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