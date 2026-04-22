import { NextRequest, NextResponse } from "next/server";

// Extract name from resume text - IMPROVED VERSION
function extractNameFromResume(text: string): string {
  console.log("🔍 Extracting name from resume...");
  
  const lines = text.split('\n').slice(0, 20);
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    if (trimmed.includes('@')) continue;
    if (trimmed.includes('+92') || trimmed.includes('031') || trimmed.includes('030')) continue;
    if (trimmed.includes('http')) continue;
    if (trimmed.includes('GitHub')) continue;
    if (trimmed.includes('LinkedIn')) continue;
    if (trimmed.includes('Portfolio')) continue;
    
    const words = trimmed.split(' ');
    if (words.length >= 2 && words.length <= 4) {
      // Check if each word starts with capital letter
      const looksLikeName = words.every(w => /^[A-Z][a-z]/.test(w) && w.length > 1);
      if (looksLikeName && trimmed.length < 50 && !trimmed.includes('Developer') && !trimmed.includes('Engineer')) {
        console.log("✅ Found name:", trimmed);
        return trimmed;
      }
    }
  }
  
  // Try regex pattern for common name formats
  const nameMatch = text.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
  if (nameMatch) {
    console.log("✅ Found name via regex:", nameMatch[0]);
    return nameMatch[0];
  }
  
  console.log("⚠️ No name found in resume");
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    console.log("📄 Resume text length:", resumeText?.length || 0);

    // FIRST: Extract name from the resume text
    const extractedName = extractNameFromResume(resumeText);
    console.log("📛 Extracted name from PDF:", extractedName);

    if (!apiKey) {
      console.error("❌ GROQ_API_KEY not found");
      // Return with the extracted name even if no API key
      return NextResponse.json({
        userName: extractedName || "User",
        currentSkills: [],
        missingSkills: [],
        learningRoadmap: [],
        portfolioProjects: [],
        interviewTopics: [],
        recommendedRoles: [],
      });
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
      console.error("Groq API Error:", data.error);
      return NextResponse.json({
        userName: extractedName || "User",
        currentSkills: [],
        missingSkills: [],
        learningRoadmap: [],
        portfolioProjects: [],
        interviewTopics: [],
        recommendedRoles: [],
      });
    }

    const generatedText = data.choices[0]?.message?.content || "{}";
    let cleanJson = generatedText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleanJson = jsonMatch[0];
    
    const analysis = JSON.parse(cleanJson);
    
    // CRITICAL: Always include the extracted name
    const finalUserName = extractedName || analysis.userName || "User";
    console.log("📛 FINAL userName being saved:", finalUserName);
    
    return NextResponse.json({
      userName: finalUserName,
      currentSkills: analysis.currentSkills || [],
      missingSkills: analysis.missingSkills || [],
      learningRoadmap: analysis.learningRoadmap || [],
      portfolioProjects: analysis.portfolioProjects || [],
      interviewTopics: analysis.interviewTopics || [],
      recommendedRoles: analysis.recommendedRoles || [],
    });
    
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({
      userName: "",
      currentSkills: [],
      missingSkills: [],
      learningRoadmap: [],
      portfolioProjects: [],
      interviewTopics: [],
      recommendedRoles: [],
    });
  }
}