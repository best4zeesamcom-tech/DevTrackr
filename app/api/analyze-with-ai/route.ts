import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    console.log("📄 Resume text length:", resumeText?.length || 0);

    if (!apiKey) {
      console.error("❌ GROQ_API_KEY not found. Get one from https://console.groq.com");
      return NextResponse.json(getFallbackAnalysis(resumeText));
    }

    const prompt = `You are a career advisor for software engineers. Analyze this resume and return ONLY valid JSON. No markdown, no explanations, no extra text.

RESUME:
${resumeText.substring(0, 3000)}

Return EXACTLY this JSON structure:
{
  "currentSkills": ["skill1", "skill2", "skill3"],
  "missingSkills": ["skill4", "skill5", "skill6"],
  "learningRoadmap": [
    {
      "skill": "skill name",
      "priority": "High",
      "why": "specific reason based on their resume",
      "timeEstimate": "X weeks",
      "resources": ["resource1", "resource2"]
    }
  ],
  "portfolioProjects": [
    {
      "name": "project name",
      "description": "what to build",
      "techStack": ["tech1", "tech2"]
    }
  ],
  "interviewTopics": ["topic1", "topic2", "topic3"],
  "recommendedRoles": ["role1", "role2"]
}`;

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
            content: "You are a career advisor. Return ONLY valid JSON. No markdown, no explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("❌ Groq API Error:", data.error);
      return NextResponse.json(getFallbackAnalysis(resumeText));
    }

    const generatedText = data.choices[0]?.message?.content || "{}";
    console.log("✅ Groq Response received, length:", generatedText.length);
    
    // Clean the response (remove markdown code blocks)
    let cleanJson = generatedText;
    cleanJson = cleanJson.replace(/```json\n?/g, "");
    cleanJson = cleanJson.replace(/```\n?/g, "");
    cleanJson = cleanJson.trim();
    
    // Find JSON object in the text if there's extra content
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    const analysis = JSON.parse(cleanJson);
    
    // Ensure all required fields exist
    return NextResponse.json({
      currentSkills: analysis.currentSkills || [],
      missingSkills: analysis.missingSkills || [],
      learningRoadmap: analysis.learningRoadmap || [],
      portfolioProjects: analysis.portfolioProjects || [],
      interviewTopics: analysis.interviewTopics || [],
      recommendedRoles: analysis.recommendedRoles || [],
    });
    
  } catch (error) {
    console.error("❌ Analysis Error:", error);
    return NextResponse.json(getFallbackAnalysis(""));
  }
}

// Fallback analysis when API fails
function getFallbackAnalysis(resumeText: string) {
  const lowerText = resumeText.toLowerCase();
  const detectedSkills = [];
  
  const skills = ["JavaScript", "React", "Node.js", "Python", "HTML", "CSS", "Git", "MongoDB", "TypeScript", "Next.js"];
  
  for (const skill of skills) {
    if (lowerText.includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  }
  
  const currentSkills = detectedSkills.length > 0 ? detectedSkills : ["Web Development"];
  const missingSkills = skills.filter(s => !detectedSkills.includes(s)).slice(0, 5);
  
  return {
    currentSkills: currentSkills,
    missingSkills: missingSkills,
    learningRoadmap: missingSkills.slice(0, 3).map((skill, i) => ({
      skill: skill,
      priority: i === 0 ? "High" : "Medium",
      why: `${skill} is in high demand and will complement your ${currentSkills[0]} experience.`,
      timeEstimate: i === 0 ? "3-4 weeks" : "2-3 weeks",
      resources: [`Official ${skill} Documentation`, `${skill} Crash Course on YouTube`, `Build a project with ${skill}`]
    })),
    portfolioProjects: missingSkills.slice(0, 2).map((skill, i) => ({
      name: i === 0 ? `${skill} Dashboard App` : `${skill} Portfolio Project`,
      description: `Build a production-ready application using ${skill} to showcase to employers.`,
      techStack: [skill, ...currentSkills.slice(0, 2)]
    })),
    interviewTopics: missingSkills.slice(0, 3).map(skill => `${skill} interview questions and answers`),
    recommendedRoles: currentSkills.includes("React") ? ["Frontend Developer", "Full Stack Developer"] : ["Web Developer", "Software Engineer"]
  };
}