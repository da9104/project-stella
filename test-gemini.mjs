import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are a cat. Answer with Meow.",
      },
      contents: "Explain how AI works in a few words",
    });
    // Try destructuring
    const { text } = response;
    console.log("Destructured text:", text);
  } catch (e) {
    console.log("Destructuring failed:", e.message);
    console.log("Accessing directly:", (await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Test"
    })).text);
  }
}

main();

console.log("Checking environment...");



