console.log("🔑 ENV CHECK - GROQ_API_KEY exists?", !!process.env.GROQ_API_KEY);
console.log("🔑 ENV CHECK - First 5 chars:", process.env.GROQ_API_KEY?.substring(0, 5));
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    const userName = context?.userName || "there";
    const fullResumeText = context?.fullResumeText || "";
    
    console.log("📨 Chat message:", message);
    console.log("👤 User name:", userName);
    console.log("📄 Resume text length being sent:", fullResumeText?.length || 0);

    if (!apiKey) {
      return NextResponse.json({ 
        reply: `Hey ${userName}, I'm having trouble connecting. Please check your API key.` 
      });
    }

    // NEW PROMPT that includes FULL resume text
    const prompt = `You are a career advisor. The user's name is ${userName}.

HERE IS THE USER'S ACTUAL RESUME CONTENT:
${fullResumeText.substring(0, 3000)}

USER'S QUESTION: "${message}"

INSTRUCTIONS:
1. Answer questions based DIRECTLY on the resume content above
2. If asked about education, look for schools, degrees, dates in the resume
3. If asked about experience, look for companies, roles, dates
4. If asked about name, use ${userName}
5. Be specific - quote from their resume when possible
6. If the information is not in the resume, say so honestly

Answer in a helpful, friendly tone.`;

    console.log("🤖 Sending to Groq API with full resume context...");

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
            content: `You are a career advisor. You have access to the user's full resume. Answer questions based on their actual resume content. Be specific and quote from their resume when possible.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Groq API Error:", data.error);
      return NextResponse.json({ 
        reply: `Hey ${userName}, I found this in your resume: ${fullResumeText.substring(0, 500)}... Based on that, what specific information are you looking for?`
      });
    }

    const reply = data.choices[0]?.message?.content || `I can see your resume shows experience with ${context?.currentSkills?.join(", ") || "various skills"}. What specific information would you like from it?`;
    console.log("✅ Groq reply sent");
    
    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting. Please try again." 
    });
  }
}