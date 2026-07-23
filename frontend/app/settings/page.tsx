"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function SettingsPage() {


  const router = useRouter();


  const [profile,setProfile] = useState<any>(null);



  useEffect(()=>{

    loadProfile();

  },[]);



  const loadProfile = async()=>{


    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(!user){

      router.push("/login");
      return;

    }



    const {data,error}= await supabase
    .from("profiles")
    .select("*")
    .eq("id",user.id)
    .single();



    if(error){

      console.log(error);
      return;

    }



    setProfile(data);


  };





  const logout = async()=>{


    await supabase.auth.signOut();


    router.push("/login");


  };






  if(!profile){


    return(

      <main className="min-h-screen bg-gray-100 p-8">

        <p>
          Loading settings...
        </p>

      </main>

    );


  }







return(


<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-4xl mx-auto">


<h1 className="text-4xl font-bold">
⚙️ Settings
</h1>


<p className="text-gray-600 mt-2">
Manage your CLS AI account settings.
</p>





<div className="bg-white rounded-2xl shadow p-8 mt-8">


<h2 className="text-2xl font-bold">
Profile Information
</h2>




<div className="mt-6 space-y-4">



<div className="border rounded-xl p-4">

<p className="text-gray-500">
Name
</p>

<p className="font-bold text-lg">
{profile.full_name || "Creator"}
</p>

</div>





<div className="border rounded-xl p-4">

<p className="text-gray-500">
Email
</p>

<p className="font-bold text-lg">
{profile.email}
</p>

</div>





<div className="border rounded-xl p-4">

<p className="text-gray-500">
Current Plan
</p>

<p className="font-bold text-lg">
{profile.plan}
</p>

</div>





<div className="border rounded-xl p-4">

<p className="text-gray-500">
AI Credits
</p>

<p className="font-bold text-lg">
{profile.credits} Words
</p>

</div>




</div>


</div>







<div className="bg-white rounded-2xl shadow p-8 mt-8">


<h2 className="text-2xl font-bold">
Account Actions
</h2>




<button

onClick={logout}

className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl"

>

🚪 Logout

</button>



</div>





</div>


</main>


);


}