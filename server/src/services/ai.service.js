import { GoogleGenerativeAI } from '@google/generative-ai';
import fs     from 'fs';
import path   from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const fileToBase64Part = (filePath, mimeType) => {
  const fileData = fs.readFileSync(filePath);
  return {
    inlineData: {
      data:     fileData.toString('base64'),
      mimeType: mimeType,
    },
  };
};

export const extractTextFromImage = async (filePath, mimeType = 'image/jpeg') => {
  try {
    const model     = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const imagePart = fileToBase64Part(filePath, mimeType);

    const prompt = `You are an OCR assistant helping to digitise a SIWES internship logbook.

Please extract and transcribe all handwritten or printed text from this logbook page image.

Structure your response exactly as follows:
- Date: [extracted date if visible]
- Tasks Completed: [extracted tasks/activities]
- Hours Worked: [extracted hours if visible]
- Additional Notes: [any other relevant text]

If any field is not clearly visible or legible, write "Not found" for that field.
Be accurate and preserve the original meaning of the text.`;

    const result   = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text     = response.text();

    return { success: true, extractedText: text, rawText: text };
  } catch (error) {
    console.error('Gemini OCR error:', error.message);
    return { success: false, extractedText: null, error: error.message };
  }
};

export const generateWeeklySummary = async (logs) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const logSummary = logs.map((log) =>
      `${log.dayOfWeek} (${new Date(log.date).toDateString()}): ${log.tasksCompleted} — ${log.hoursWorked} hours`
    ).join('\n');

    const prompt = `You are helping an intern write a professional SIWES weekly report summary.

Based on these daily log entries for week ${logs[0]?.weekNumber}:
${logSummary}

Write a concise, professional 2-3 paragraph summary of the intern's activities this week.
Highlight key skills developed, tasks accomplished, and overall productivity.
Write in third person as if it is a formal report.`;

    const result   = await model.generateContent(prompt);
    const response = await result.response;

    return { success: true, summary: response.text() };
  } catch (error) {
    console.error('Gemini summary error:', error.message);
    return { success: false, summary: null, error: error.message };
  }
};