"use client";

import Header from "../components/Header";
import UsageCounter from "../components/UsageCounter";
import AIForm from "../components/AIForm";
import { useState } from "react";


export default function Home() {

  const [freeUses, setFreeUses] = useState(3);


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

        <AIForm />



        {/* Free Usage Counter */}

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