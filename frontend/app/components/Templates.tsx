"use client";

export default function Templates({
  setPrompt,
}: {
  setPrompt: (text: string) => void;
}) {

  const templates = [
    {
      name: "✍️ Blog Writer",
      prompt: "Write a detailed SEO optimized blog about: ",
    },
    {
      name: "🔍 SEO Writer",
      prompt: "Create SEO content with keywords for: ",
    },
    {
      name: "📧 Email Writer",
      prompt: "Write a professional email about: ",
    },
    {
      name: "📱 Social Media Post",
      prompt: "Create an engaging social media post about: ",
    },
    {
      name: "🛒 Product Description",
      prompt: "Create a high converting product description for: ",
    },
  ];


  return (
    <div>

      <h2 className="text-xl font-semibold mt-8">
        Choose AI Template
      </h2>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

        {templates.map((item) => (

          <button
            key={item.name}
            onClick={() => setPrompt(item.prompt)}
            className="border p-3 rounded-lg hover:bg-blue-50"
          >
            {item.name}
          </button>

        ))}

      </div>

    </div>
  );
}