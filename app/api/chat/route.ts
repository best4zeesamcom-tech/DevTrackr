import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    console.log("📨 Chat message:", message);
    console.log("👤 User name from context:", context?.userName);

    const userName = context?.userName || "there";

    if (!apiKey) {
      console.error("❌ GROQ_API_KEY not found");
      return NextResponse.json({ 
        reply: `Hey ${userName}! I'm having trouble connecting to my AI. Please check your API key.` 
      });
    }

    const prompt = `You are a friendly career advisor. The user's name is ${userName}.

USER'S SKILLS:
- Current skills: ${context?.currentSkills?.join(", ") || "not specified"}
- Skills to learn: ${context?.missingSkills?.slice(0, 5).join(", ") || "not specified"}
- Target roles: ${context?.recommendedRoles?.join(", ") || "Developer"}

USER QUESTION: "${message}"

INSTRUCTIONS:
1. ALWAYS address the user as ${userName} (this is their real name)
2. Be specific to THEIR skills - mention their actual skills
3. Give actionable, personalized advice
4. Keep response under 150 words

Respond in a warm, helpful tone.`;

    console.log("🤖 Sending to Groq API...");

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
            content: `You are a career advisor. The user's name is ${userName}. Always address them by name.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("❌ Groq API Error:", data.error);
      return NextResponse.json({ 
        reply: `Hey ${userName}! I'm having trouble right now. Based on your resume, you have skills in ${context?.currentSkills?.slice(0, 3).join(", ") || "development"}. What specific help do you need?`
      });
    }

    const reply = data.choices[0]?.message?.content || `Hey ${userName}! How can I help you with your career today?`;
    console.log("✅ Groq reply sent");
    
    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error("❌ Chat error:", error);
    return NextResponse.json({ 
      reply: "I'm having trouble connecting. Please try again in a moment." 
    });
  }
}