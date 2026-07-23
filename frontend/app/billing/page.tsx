"use client";

import { useState } from "react";


export default function BillingPage() {


  const [plan, setPlan] = useState("FREE");


  const plans = [

    {
      name:"FREE",
      price:"₹0",
      words:"5,000 AI Words",
      features:[
        "AI Writer Access",
        "Basic Templates",
        "Save Content"
      ]
    },


    {
      name:"CREATOR PRO",
      price:"₹499",
      words:"50,000 AI Words",
      popular:true,
      features:[
        "All AI Templates",
        "Unlimited Saved Content",
        "Priority AI Generation",
        "SEO Writing Tools"
      ]
    },


    {
      name:"BUSINESS",
      price:"₹1499",
      words:"Unlimited AI Words",
      features:[
        "Everything in Pro",
        "Advanced AI Tools",
        "Team Access",
        "API Access"
      ]
    }


  ];



return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-6xl mx-auto">


<h1 className="text-4xl font-bold">
💳 Billing & Subscription
</h1>


<p className="text-gray-600 mt-3">
Manage your CLS AI subscription and upgrade your plan.
</p>



<div className="mt-8 bg-white rounded-xl shadow p-6">


<h2 className="text-2xl font-bold">
Current Plan
</h2>


<div className="mt-4 flex justify-between items-center">


<div>

<p className="text-3xl font-bold text-blue-600">
{plan}
</p>


<p className="text-gray-500 mt-2">
Your active CLS AI plan
</p>

</div>


<div>

<p>
🤖 AI Credits
</p>

<p className="font-bold">
5,000 Words
</p>


</div>


</div>


</div>





<h2 className="text-3xl font-bold mt-12">
Choose Your Plan
</h2>




<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">



{plans.map((item)=>(


<div
key={item.name}
className={`bg-white rounded-2xl shadow p-8 border-2 ${
item.popular
?"border-blue-600"
:"border-transparent"
}`}
>


{item.popular && (

<div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm inline-block">
Most Popular
</div>

)}



<h3 className="text-2xl font-bold mt-4">
{item.name}
</h3>



<p className="text-4xl font-bold mt-4">
{item.price}
<span className="text-lg text-gray-500">
 /month
</span>
</p>



<p className="mt-4 font-semibold">
{item.words}
</p>



<div className="mt-6 space-y-3">

{item.features.map((feature)=>(

<p key={feature}>
✓ {feature}
</p>

))}


</div>




<button

onClick={()=>setPlan(item.name)}

className={`mt-8 w-full py-3 rounded-xl font-bold ${
item.name==="FREE"
?"bg-gray-200"
:"bg-blue-600 text-white"
}`}

>

{item.name==="FREE"
?"Current Plan"
:"Upgrade Now"}

</button>



</div>


))}


</div>




</div>


</main>

);


}