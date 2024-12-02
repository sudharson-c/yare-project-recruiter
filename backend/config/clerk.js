const { createClerkClient } = require("@clerk/backend");

// Initialize Clerk with your API keys
const clerkClient = new createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
})


module.exports = clerkClient;
