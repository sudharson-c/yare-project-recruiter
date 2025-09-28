// geminiGenerateTasks.js (updated)
import { GoogleGenerativeAI } from "@google/generative-ai";
import { taskResponseSchema } from "./taskSchema";

const MODEL_ID = "gemini-2.5-flash"; // reliable with responseSchema; upgrade later if needed
const keyAt = (i) => String.fromCharCode("a".charCodeAt(0) + i);
const sanitize = (s, n = 240) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);

export async function generateTasksGemini(project, maxTasks = 6) {
    const apiKey = process.env.GEMINI_API || import.meta?.env?.VITE_GEMINI_API;
    // if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const name = project?.name ?? project?.project_name ?? "Project";
    const desc = project?.description ?? project?.project_desc ?? "";
    const extras = project?.benefits ?? "";

    const prompt = `
Generate ${maxTasks} concise, atomic software tasks (1–2 days each), action-verb led, non-overlapping.
Return only JSON that matches the response schema.
`.trim();

    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${prompt}\nName: ${name}\nDescription: ${desc}\nExtras: ${extras}` }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: taskResponseSchema
        }
    });

    const data = JSON.parse(resp.response.text());
    const items = Array.isArray(data?.tasks) ? data.tasks.slice(0, maxTasks) : [];

    return items.map((t, idx) => ({
        id: "t" + Math.random().toString(36).slice(2, 10),
        title: sanitize(t.title, 80),
        description: sanitize(t.description || t.title, 240),
        columnId: "col_backlog",
        orderKey: keyAt(idx),
        assigneeId: "",
        labels: []
    }));
}
