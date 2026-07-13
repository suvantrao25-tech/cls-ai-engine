"use client";

import { useState } from "react";
import Header from "../components/Header";
import Templates from "../components/Templates";
import UsageCounter from "../components/UsageCounter";
import AIForm from "../components/AIForm";

export default function Home() {

  const [prompt, setPrompt] = useState("");
  const [freeUses, setFreeUses] = useState(3);
  const handleGenerate = () => {

  if (freeUses <= 0) {
    alert("Your free AI limit is over. Please create an account to continue.");
    return false;
  }

  const remaining = freeUses - 1;

  setFreeUses(remaining);

  return true;

};


  return (

    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">


        <Header />


        <Templates 
          setPrompt={setPrompt}
        />


        <AIForm 
  prompt={prompt}
  setPrompt={setPrompt}
  onGenerate={handleGenerate}
/>

<p className="text-red-600">
  Test Count: {freeUses}
</p>
        <UsageCounter 
          freeUses={freeUses}
        />


      </div>

    </main>

  );

}