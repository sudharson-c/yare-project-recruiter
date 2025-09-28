// src/components/kanban/geminiActions.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Choose a model that supports responseSchema reliably
const MODEL_ID = "gemini-2.5-flash"; // good balance of cost/latency
const apiKey = process.env.GEMINI_API || import.meta?.env?.VITE_GEMINI_API;

function getModel() {
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: MODEL_ID });
}

const sanitize = (s, n = 240) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);

// Summarize -> { summary }
export async function geminiSummarize(text) {
    const model = getModel();
    const schema = {
        type: "object",
        properties: { summary: { type: "string" } },
        required: ["summary"]
    };
    const prompt = "Summarize the following into a concise, actionable description.";
    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${text}` }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    });
    const data = JSON.parse(resp.response.text());
    return sanitize(data.summary);
}

// Rewrite title -> { title }
export async function geminiRewriteTitle(text) {
    const model = getModel();
    const schema = {
        type: "object",
        properties: { title: { type: "string" } },
        required: ["title"]
    };
    const prompt = "Rewrite into a short, verb-led task title (max ~8 words).";
    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${text}` }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    });
    const data = JSON.parse(resp.response.text());
    return sanitize(data.title, 80);
}

// Suggest labels + assignee with enums -> { labels: string[], assigneeId: string }
export async function geminiSuggestLabelsAndAssignee(task, labelCandidates, collaborators) {
    const model = getModel();

    // Build enums (keep lists modest to avoid long schemas)
    const labelEnum = labelCandidates;
    const assigneeEnum = (collaborators ?? []).map(c => c.id);
    // Allow empty/no assignment as "" if desired
    if (!assigneeEnum.includes("")) assigneeEnum.push("");

    const schema = {
        type: "object",
        properties: {
            labels: {
                type: "array",
                items: { type: "string", enum: labelEnum }
            },
            assigneeId: { type: "string", enum: assigneeEnum }
        },
        required: ["labels", "assigneeId"]
    };

    const guidance = `
From the task text, pick up to 3 labels from the allowed list and the best single assignee from the allowed IDs.
Choose labels that reflect the primary work area (e.g., frontend/backend/infra/docs/testing/research/design).
`.trim();

    const context = JSON.stringify({
        task: {
            title: task.title,
            description: task.description
        },
        allowedLabels: labelEnum,
        allowedAssigneeIds: assigneeEnum
    }, null, 2);

    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${guidance}\n\n${context}` }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    });

    const data = JSON.parse(resp.response.text());
    // Clamp outputs just in case
    const labels = Array.isArray(data.labels) ? data.labels.slice(0, 3) : [];
    const assigneeId = assigneeEnum.includes(data.assigneeId) ? data.assigneeId : "";
    return { labels, assigneeId };
}
