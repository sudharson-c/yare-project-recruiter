// taskSchema.js (no additionalProperties)
export const taskResponseSchema = {
    type: "object",
    properties: {
        tasks: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    description: { type: "string" }
                },
                required: ["title", "description"]
            }
        }
    },
    required: ["tasks"]
};
