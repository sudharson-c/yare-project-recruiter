const { Router } = require("express");
const prisma = require("../config/prisma.js");
const clerkClient = require("../config/clerk.js");
const router = Router();

// Get all users
router.get("/", async (req, res) => {
    console.log("Get all users");
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Create a new user
router.post("/", async (req, res) => {
    const { clerkId, ...userData } = req.body;
    console.log("Create new user");
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                id: clerkId,
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = await prisma.user.create({
            data: {
                id: clerkId,
                clerkId: clerkId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

// Get user by ID
router.get("/:id", async (req, res) => {
    console.log("Get specific user");
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.params.id,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Update user by ID
router.put("/:id", async (req, res) => {
    console.log("Update a user");
    console.log(req.body)
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: req.params.id,
            },
            data: req.body,
        });
        await clerkClient.users.updateUser(req.params.id, {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
        })
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.code === "P2025") {
            console.log(error.message);
            return res.status(404).json({ message: "User not found" });
        }
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
    console.log("Delete a user " + req.params.id);
    try {
        // Update projects: Remove user from collaborators and increment members_needed
        const projects = await prisma.project.findMany({
            where: {
                collaborators: {
                    some: {
                        id: req.params.id,
                    },
                },
            },
        });

        for (const project of projects) {
            await prisma.project.update({
                where: { id: project.id },
                data: {
                    collaborators: {
                        disconnect: { id: req.params.id }, // Disconnect user from project collaborators
                    },
                    members_needed: { increment: 1 }, // Increment members_needed
                },
            });
        }
        await prisma.applications.deleteMany({
            where: {
                userId: req.params.id,
            }
        })
        // Delete the user from the database
        const deletedUser = await prisma.user.delete({
            where: {
                id: req.params.id,
            },
        });

        // Delete the user from Clerk
        await clerkClient.users.deleteUser(req.params.id);
        res.status(200).json(deletedUser);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            code: error.code || "INTERNAL_SERVER_ERROR",
            message: error.message || "An error occurred while deleting the user.",
        });
    }
});

module.exports = router;
