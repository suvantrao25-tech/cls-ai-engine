"use client";

import { useRouter } from "next/navigation";

export default function TemplatesPage() {

  const router = useRouter();

  const templates = [
  {
    title: "✍️ Blog Writer",
    value: "Blog Writer",
    desc: "Generate SEO optimized blog articles."
  },
  {
    title: "🔍 SEO Writer",
    value: "SEO Writer",
    desc: "Create SEO friendly content."
  },
  {
    title: "📧 Email Writer",
    value: "Email Writer",
    desc: "Write professional emails."
  },
  {
    title: "📱 Social Media Post",
    value: "Social Media Post",
    desc: "Create engaging social posts."
  },
  {
    title: "🛒 Product Description",
    value: "Product Description",
    desc: "Create high converting product copy."
  }
];


  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        📚 AI Templates
      </h1>


      <div className="grid md:grid-cols-3 gap-6">


      {templates.map((item,index)=>(

        <div
        key={index}
        className="bg-white p-6 rounded-xl shadow hover:shadow-lg"
        >

          <h2 className="text-xl font-bold">
            {item.title}
          </h2>


          <p className="text-gray-500 mt-3">
            {item.desc}
          </p>


          <button
          onClick={() =>
  router.push(
    `/ai-writer?template=${encodeURIComponent(item.value)}`
  )
}
          className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Use Template
          </button>


        </div>

      ))}


      </div>


    </main>

  );

}