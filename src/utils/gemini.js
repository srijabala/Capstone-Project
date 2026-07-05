import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const isGeminiConfigured = () => {
  return typeof apiKey === "string" && apiKey.trim().length > 0;
};

const genAI = isGeminiConfigured() ? new GoogleGenerativeAI(apiKey) : null;

export async function analyzeResume(resumeBase64Url, targetRole = "Frontend Developer") {
  if (!genAI) {
    throw new Error(
      "Gemini API key is not configured. Please define VITE_GEMINI_API_KEY in your .env file."
    );
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const systemInstruction = `
You are an expert Technical Recruiter and Senior Market Analyst specializing in the tech industry.
Analyze the user's resume image and compare it against the latest industry demand for their target role: "${targetRole}".

You MUST return a JSON object with the following structure:
{
  "roleAnalyzed": "string (the target role)",
  "marketAlignmentScore": "number (percentage match between 0 and 100)",
  "detectedSkills": ["string (skills found in their resume)"],
  "criticalSkillGaps": [
    {
      "skill": "string (missing skill)",
      "importance": "string (High | Medium)",
      "reason": "string (why it is critical in the current market)"
    }
  ],
  "marketComparison": [
    {
      "skill": "string",
      "yourLevel": "number (0 to 100 rating based on resume)",
      "marketDemand": "number (0 to 100 rating based on market trends)"
    }
  ],
  "recruiterFeedback": "string (overall feedback and recommendations)",
  "suggestedInterviewQuestions": [
    "string (technical question tailored to their gaps and profile)"
  ]
}

Ensure the response is valid JSON and strictly matches the keys above. Do not wrap the JSON in markdown code blocks or add extra text outside the JSON.
`;

  try {
    const match = resumeBase64Url.match(/^data:(image\/[a-zA-Z]+);base64,(.*)$/);
    if (!match) {
        throw new Error("Invalid image format. Please upload a valid PNG or JPG image.");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const prompt = `Here is an image of my resume. Analyze this resume against the role: ${targetRole}.`;
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      systemInstruction: systemInstruction,
    });

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}

// ─── Job Description Matcher ───────────────────────────────────────────────
export async function matchJobDescription(resumeAnalysis, jobDescriptionText) {
  if (!genAI) throw new Error("Gemini API key is not configured.");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
You are an expert ATS (Applicant Tracking System) specialist and technical recruiter.
Given the candidate's resume analysis summary and a job description, evaluate the match.

Resume Analysis Summary:
- Role Analyzed: ${resumeAnalysis.roleAnalyzed}
- Detected Skills: ${resumeAnalysis.detectedSkills?.join(", ")}
- Market Alignment Score: ${resumeAnalysis.marketAlignmentScore}%
- Critical Gaps: ${resumeAnalysis.criticalSkillGaps?.map(g => g.skill).join(", ")}

Job Description:
${jobDescriptionText}

Return ONLY a JSON object with this exact structure, no markdown:
{
  "atsScore": <number 0-100, ATS keyword match score>,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengthHighlights": ["specific strength from resume that matches JD requirement"],
  "resumeTweaks": ["specific actionable tweak to improve ATS score for this JD"],
  "overallVerdict": "a 2-3 sentence honest assessment of the application strength"
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
}

// ─── 30-60-90 Day Skill Sprint Generator ──────────────────────────────────
export async function generateSkillSprint(resumeAnalysis) {
  if (!genAI) throw new Error("Gemini API key is not configured.");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
You are a senior career coach and learning strategist.
Based on this candidate's skill gaps and target role, create a realistic, specific 30-60-90 day skill sprint plan.

Target Role: ${resumeAnalysis.roleAnalyzed}
Current Skills: ${resumeAnalysis.detectedSkills?.join(", ")}
Critical Gaps to Bridge: ${resumeAnalysis.criticalSkillGaps?.map(g => g.skill + ' (' + g.importance + ')').join(", ")}

Return ONLY a JSON object with this exact structure, no markdown:
{
  "targetRole": "${resumeAnalysis.roleAnalyzed}",
  "days30": {
    "theme": "Foundation Sprint",
    "goal": "one sentence goal for days 1-30",
    "weeks": [
      {
        "week": 1,
        "focus": "Skill or concept to learn",
        "tasks": ["specific daily task 1", "specific daily task 2", "specific daily task 3"],
        "milestone": "what you can do by end of week",
        "resource": "best free resource (e.g. official docs, specific course)"
      }
    ]
  },
  "days60": {
    "theme": "Build & Apply Sprint",
    "goal": "one sentence goal for days 31-60",
    "weeks": [
      {
        "week": 5,
        "focus": "Project or application focus",
        "tasks": ["task 1", "task 2", "task 3"],
        "milestone": "what you can demonstrate by end of week",
        "resource": "relevant resource"
      }
    ]
  },
  "days90": {
    "theme": "Ship & Interview Sprint",
    "goal": "one sentence goal for days 61-90",
    "weeks": [
      {
        "week": 9,
        "focus": "Interview prep and portfolio polishing",
        "tasks": ["task 1", "task 2", "task 3"],
        "milestone": "interview-ready achievement",
        "resource": "resource"
      }
    ]
  }
}
Generate exactly 4 weeks per phase (weeks 1-4, 5-8, 9-12). Be very specific and actionable.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text);
}
