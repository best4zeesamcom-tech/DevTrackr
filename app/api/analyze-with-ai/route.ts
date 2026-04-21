import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    console.log("📄 Resume text length:", resumeText?.length || 0);

    if (!apiKey) {
      console.error("❌ GROQ_API_KEY not found");
      return NextResponse.json(getFallbackAnalysis(resumeText));
    }

    const prompt = `You are a career advisor. Analyze this resume and return ONLY valid JSON.

RESUME:
${resumeText.substring(0, 3000)}

Return EXACTLY this JSON:
{
  "currentSkills": ["skill1", "skill2"],
  "missingSkills": ["skill3", "skill4"],
  "learningRoadmap": [
    {
      "skill": "skill name",
      "priority": "High",
      "why": "reason",
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
  "interviewTopics": ["topic1", "topic2"],
  "recommendedRoles": ["role1", "role2"]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(getFallbackAnalysis(resumeText));
    }

    const generatedText = data.choices[0]?.message?.content || "{}";
    let cleanJson = generatedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];
    
    const analysis = JSON.parse(cleanJson);
    
    return NextResponse.json({
      currentSkills: analysis.currentSkills || [],
      missingSkills: analysis.missingSkills || [],
      learningRoadmap: analysis.learningRoadmap || [],
      portfolioProjects: analysis.portfolioProjects || [],
      interviewTopics: analysis.interviewTopics || [],
      recommendedRoles: analysis.recommendedRoles || [],
    });
    
  } catch (error) {
    return NextResponse.json(getFallbackAnalysis(""));
  }
}

function getFallbackAnalysis(resumeText: string) {
  const lowerText = resumeText.toLowerCase();
  const detectedSkills: string[] = [];
  
  const allSkills = ["JavaScript", "React", "Node.js", "Python", "HTML", "CSS", "Git", "MongoDB", "TypeScript", "Next.js"];
  
  for (const skill of allSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  }
  
  const currentSkills = detectedSkills.length > 0 ? detectedSkills : ["Web Development"];
  const missingSkills = allSkills.filter(s => !detectedSkills.includes(s)).slice(0, 5);
  
  return {
    currentSkills: currentSkills,
    missingSkills: missingSkills,
    learningRoadmap: missingSkills.slice(0, 3).map((skill, i) => ({
      skill: skill,
      priority: i === 0 ? "High" : "Medium",
      why: `${skill} complements your ${currentSkills[0]} skills`,
      timeEstimate: i === 0 ? "3-4 weeks" : "2-3 weeks",
      resources: [`${skill} Docs`, `${skill} Course`]
    })),
    portfolioProjects: missingSkills.slice(0, 2).map((skill, i) => ({
      name: i === 0 ? `${skill} App` : `${skill} Project`,
      description: `Build an app with ${skill}`,
      techStack: [skill]
    })),
    interviewTopics: missingSkills.slice(0, 3).map(skill => `${skill} questions`),
    recommendedRoles: ["Web Developer", "Software Engineer"]
  };
}