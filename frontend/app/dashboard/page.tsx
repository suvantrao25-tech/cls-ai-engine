"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {

  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);

  useEffect(() => {

    const loadProfile = async () => {

      const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  router.replace("/login");
  return;
}

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error.message);
        return;
      }

      setProfile(data);
      const { data: historyData, error: historyError } = await supabase
  .from("history")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(3);


if (historyError) {
  console.log(historyError);
  return;
}


setRecentHistory(historyData || []);

    };

    loadProfile();

    }, [router]);

  return (
    <main className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <section className="flex-1 p-8">

        <Header />

        <div className="mt-8">
          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-gray-600 mt-2">
            Start creating amazing AI content with CLS AI.
          </p>
        </div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      📝 Blogs Generated
    </h3>

    <p className="text-3xl font-bold mt-3">
  {profile?.blogs_generated ?? 0}
</p>
  </div>


  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      📄 Words Generated
    </h3>

    <p className="text-3xl font-bold mt-3">
  {profile?.words_generated ?? 0}
</p>
  </div>


  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      💾 Saved Content
    </h3>

    <p className="text-3xl font-bold mt-3">
  0
</p>
  </div>


  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-500">
      💳 Current Plan
    </h3>

    <p className="text-3xl font-bold mt-3">
  {profile?.plan ?? "FREE"}
</p>
  </div>

</div>{/* AI Credits Section */}

<div className="bg-white p-6 rounded-xl shadow mt-8">

  <div className="flex justify-between items-center">

    <h2 className="text-xl font-bold">
      🤖 AI Credits
    </h2>

    <span className="text-gray-500">
  {profile?.credits ?? 5000} / 5000 Words
</span>

  </div>


  <div className="w-full bg-gray-200 rounded-full h-4 mt-5">

    <div
      className="bg-blue-600 h-4 rounded-full"
      style={{ width: "90%" }}
    >
    </div>

  </div>


  <p className="text-gray-500 mt-3">
  {profile
    ? `${Math.round((profile.credits / 5000) * 100)}% credits remaining`
    : "100% credits remaining"}
</p>


</div>{/* Quick AI Tools */}

<div className="mt-8">

  <h2 className="text-2xl font-bold mb-5">
    ⚡ Quick AI Tools
  </h2>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">

      <h3 className="text-xl font-bold">
        ✍️ Blog Writer
      </h3>

      <p className="text-gray-500 mt-2">
        Generate SEO optimized blog articles.
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Open
      </button>

    </div>



    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">

      <h3 className="text-xl font-bold">
        🔍 SEO Writer
      </h3>

      <p className="text-gray-500 mt-2">
        Create SEO content with keywords.
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Open
      </button>

    </div>



    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">

      <h3 className="text-xl font-bold">
        📧 Email Writer
      </h3>

      <p className="text-gray-500 mt-2">
        Write professional emails instantly.
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Open
      </button>

    </div>



    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">

      <h3 className="text-xl font-bold">
        📱 Social Media
      </h3>

      <p className="text-gray-500 mt-2">
        Create engaging social posts.
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Open
      </button>

    </div>



    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">

      <h3 className="text-xl font-bold">
        🛒 Product Description
      </h3>

      <p className="text-gray-500 mt-2">
        Generate high converting product copy.
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Open
      </button>

    </div>


  </div>

</div>{/* Recent AI Generations */}

<div className="mt-10">

  <h2 className="text-2xl font-bold mb-5">
    📜 Recent Content
  </h2>


  <div className="bg-white rounded-xl shadow p-6 space-y-5">

{recentHistory.map((item) => (

<div
key={item.id}
className="flex justify-between items-center border-b pb-4"
>

<div>

<h3 className="font-bold">
{item.prompt}
</h3>

<p className="text-gray-500">
✍️ {item.template}
</p>

</div>


<span className="text-gray-400 text-sm">
{new Date(item.created_at).toLocaleDateString()}
</span>


</div>

))}


{recentHistory.length === 0 && (

<p className="text-gray-500">
No recent content found.
</p>

)}

</div>

</div>{/* Subscription Card */}

<div className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">

  <h2 className="text-2xl font-bold">
    💳 Current Plan
  </h2>

  <h3 className="text-4xl font-bold mt-3">
  {profile?.plan ?? "FREE"}
</h3>

  <div className="mt-5 space-y-2">

    <p>
      ✓ 5,000 AI Words
    </p>

    <p>
      ✓ AI Writer Access
    </p>

    <p>
      ✓ Basic Templates
    </p>

  </div>


  <button
  className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-50 hover:scale-105 transition"
>
  Upgrade to Pro →
</button>


</div>
      </section>

    </main>
  );
}