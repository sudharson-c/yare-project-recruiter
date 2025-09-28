// src/components/projects/geminiProjectAssist.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure GEMINI_API_KEY in env (server or client as per your setup)
const MODEL_ID = "gemini-2.5-flash";

const sanitize = (s, n = 400) => (s || "").replace(/\s+/g, " ").trim().slice(0, n);

const projectSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        benefits: { type: "string" },
        tags: {
            type: "array",
            items: { type: "string" }
        },
        members_needed: { type: "integer" }
    },
    required: ["name", "description"]
};
const recommendSchema = {
    type: "object",
    properties: {
        recommendations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    projectId: { type: "string" },
                    score: { type: "number" }
                },
                required: ["projectId", "score"]
            }
        }
    },
    required: ["recommendations"]
};

export async function recommendProjectsGemini(userRole, minimalProjects, topK = 6) {
    const model = getModel();
    const prompt = `
Given a user role and a list of projects (each with id, name, desc), recommend the top ${topK}
most relevant projects for this user's role. Consider responsibilities and fit (skills, scope, ownership).
Return only JSON per the response schema, with higher scores for better matches.
`.trim();

    const body = {
        role: userRole,
        projects: minimalProjects
    };

    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${JSON.stringify(body, null, 2)}` }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: recommendSchema,
            // Stable output
            temperature: 0.2
        }
    });

    const data = JSON.parse(resp.response.text());
    const recs = Array.isArray(data?.recommendations) ? data.recommendations : [];
    // Deduplicate and take topK
    const seen = new Set();
    return recs
        .filter(r => r?.projectId && !seen.has(r.projectId) && seen.add(r.projectId))
        .slice(0, topK);
}

function getModel() {
    const apiKey = process.env.GEMINI_API || import.meta?.env?.VITE_GEMINI_API;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: MODEL_ID });
}

export async function aiDraftProject({ idea, existing }) {
    const model = getModel();
    const prompt = `
You are assisting with drafting a project form for a student recruiter tool.
Return a JSON object matching the schema with:
- name: concise, specific title
- description: 3-6 sentences, action-oriented
- benefits: short bullet-like text (single string with bullets or lines)
- tags: 3-6 keywords lowercase
- members_needed: integer 1-6
Keep it professional and concrete.
`.trim();

    const context = JSON.stringify({
        idea,
        existing // may include current form fields if user started typing
    }, null, 2);

    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${context}` }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: projectSchema
        }
    });

    const data = JSON.parse(resp.response.text());
    return {
        project_name: sanitize(data.name, 80),
        project_desc: sanitize(data.description, 1200),
        benefits: sanitize(data.benefits, 800),
        tags: Array.isArray(data.tags) ? data.tags.slice(0, 8) : [],
        members_needed: Number.isFinite(data.members_needed) ? data.members_needed : ""
    };
}

export async function aiEnhanceFields({ name, description, benefits }) {
    const model = getModel();
    const schema = {
        type: "object",
        properties: {
            name: { type: "string" },
            description: { type: "string" },
            benefits: { type: "string" }
        },
        required: ["name", "description", "benefits"]
    };
    const prompt = `
Rewrite the provided fields to be clearer and more compelling for a project listing.
Keep name short, description ~3-6 sentences, benefits concise.
`.trim();

    const resp = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${prompt}\n\n${JSON.stringify({ name, description, benefits }, null, 2)}` }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });
    const out = JSON.parse(resp.response.text());
    return {
        project_name: sanitize(out.name, 80),
        project_desc: sanitize(out.description, 1200),
        benefits: sanitize(out.benefits, 800)
    };
}
