import { GoogleGenAI } from "@google/genai";

// initialize with your API key
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return "Something went wrong with Gemini API!";
  }
}
