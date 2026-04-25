import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    const userName = context?.userName || "there";
    const fullResumeText = context?.fullResumeText || "";
    
    console.log("📨 Chat message:", message);
    console.log("👤 User name:", userName);
    console.log("🔑 API Key exists?", !!apiKey);
    console.log("📄 Resume length:", fullResumeText?.length || 0);

    if (!apiKey) {
      console.error("❌ API Key missing");
      return NextResponse.json({ 
        reply: `Hey ${userName}, the API key is not configured. Please contact support.` 
      });
    }

    const prompt = `You are a career advisor. The user's name is ${userName}.

HERE IS THE USER'S ACTUAL RESUME CONTENT:
${fullResumeText.substring(0, 3000)}

USER'S QUESTION: "${message}"

Answer based DIRECTLY on their resume. Be specific and helpful.`;

    console.log("🤖 Sending to Groq API...");

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a career advisor. Answer based on the user's resume."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 500
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API Error:", response.status, errorText);
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
      console.log("✅ Groq reply sent");
      
      return NextResponse.json({ reply });
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error("⏰ Request timeout");
        return NextResponse.json({ 
          reply: `Hey ${userName}, the AI is taking too long to respond. Please try again in a moment.` 
        });
      }
      throw fetchError;
    }
    
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting. Please try again in a few seconds." 
    });
  }
}