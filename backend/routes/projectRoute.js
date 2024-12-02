const { Router, application } = require('express');
const router = Router();
const prisma = require('../config/prisma');
// Get all Projects
router.get('/', async (req, res) => {
  console.log("Get all projects");
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: true
      }
    });
    res.status(200).json({ projectData: projects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Projects for a specific user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  console.log("Get user projects" + userId);
  try {
    // Use Promise.all to wait for all project data to resolve
    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId
      },
      include: {
        owner: true
      }
    });
    res.status(200).json({ userProjects: projects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



// Create a new Project
router.post("/", async (req, res) => {
  const { project_name, project_desc, project_link, owner, status, stipend, benefits, members_needed } = req.body;
  console.log("Create new project");
  try {
    const newProject = {
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators: [],
      status,
      stipend,
      benefits,
      members_needed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const projectExists = await prisma.project.findFirst({
      where: {
        name: project_name
      }
    })

    if (projectExists) return res.status(409).json({ message: "Project already exists" });
    const user = await prisma.user.findUnique({
      where: {
        id: newProject.owner
      }
    })
    if (!user) return res.status(404).json({ message: "User not found" });
    const project = await prisma.project.create({
      data: {
        name: newProject.project_name,
        description: newProject.project_desc,
        ownerId: user.id,
        project_link: newProject.project_link,
        project_status: newProject.status,
        benefits: newProject.benefits,
        stipend: newProject.stipend,
        members_needed: parseInt(newProject.members_needed),
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
        collaborators_id: newProject.collaborators
      }
    })
    console.log(`Project: ${project.id} is created`);

    await prisma.user.update({
      where: {
        id: owner
      },
      data: {
        projects: {
          connect: {
            id: project.id
          }
        }
      }
    })

    res.status(201).json({ id: project.id, ...newProject });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Error creating project", error: error });
  }
});

// Get Project By ID
router.get('/:id', async (req, res) => {
  console.log("Get specific projects");
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        owner: true,
        collaborators: true
      }
    })
    if (!project) return res.status(404).send('Project not found');
    const applications = await prisma.applications.findMany({
      where: {
        projectId: project.id
      }
    })
    let currProject = { ...project }
    if (applications) {
      currProject = { ...project, application: applications }
    }
    res.status(200).json(currProject);
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }
});
router.get("/applications/:id", async (req, res) => {
  console.log("Get applications of user");
  try {
    const userId = req.params.id;
    // Find all applications made by the user
    const userApplications = await prisma.applications.findMany({
      where: {
        userId: userId
      }
    })
    // Fetch project data for each application using projectId
    const projectApplied = await Promise.all(
      userApplications.map(async (application) => {
        const project = await prisma.project.findFirst({
          where: {
            id: application.projectId
          }
        })
        return project ? project : null;
      })
    );
    // Return both user applications and project details
    // console.log({userApplications,projectApplied})
    res.status(200).json({
      userApplications,
      projectsAppliedTo: projectApplied.filter((project) => project !== null), // Filter out any null projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
//To get the applications of the project
router.get("/project-application/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Get project details
    const projectDetails = await prisma.project.findUnique({
      where: {
        id: id,
      }
    })
    // Get all applications for the project
    const projectApplications = await prisma.applications.findMany({
      where: {
        projectId: id
      }
    })
    // Use Promise.all to fetch user details for each application
    const applicationsWithUserDetails = await Promise.all(
      projectApplications.map(async (application) => {
        const userDetails = await prisma.user.findUnique({
          where: {
            id: application.userId
          }
        })
        return { ...application, userDetails };
      })
    );
    res.status(200).json({ projectDetails, projectApplications: applicationsWithUserDetails });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post('/apply', async (req, res) => {
  try {
    const application = req.body;
    const existingApplication = await prisma.applications.findFirst({
      where: {
        AND: [{ userId: application.applier },
        { projectId: application.projectId }]
      }
    })

    if (existingApplication) {
      console.log("Applied already")
      return res.json({ message: 'Already Applied' });
    }

    const newApplication = await prisma.applications.create({
      data: {
        userId: application.applier,
        projectId: application.projectId,
        resume_link: application.resume,
        message: application.message
      }
    })
    return res.status(201).json({ message: 'Successfully Applied' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }

})

// Update Project By ID
router.put('/:id', async (req, res) => {
  const { name, description, project_link, ownerId, collaborators, project_status, stipend, benefits, members_needed, createdAt } = req.body;
  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: req.params.id
      },
      data: {
        name,
        description,
        project_link,
        ownerId,
        project_status,
        stipend,
        members_needed,
        benefits,
      }
    })

    if (!updatedProject) return res.status(404).send('Project not found');
    res.status(200).json({ ...updatedProject });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// Delete Project By ID
router.delete('/:id', async (req, res) => {
  try {
    const deleteProject = await prisma.project.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        owner: true,
        collaborators: true
      }
    })
    await prisma.project.delete({
      where: {
        id: req.params.id
      }
    })
    await prisma.user.update({
      where: {
        id: deleteProject.owner.id
      },
      data: {
        projects: {
          disconnect: {
            id: req.params.id
          }
        }
      }
    });
    await prisma.applications.deleteMany({
      where: {
        projectId: req.params.id
      }
    })

    await deleteProject.collaborators.map(async collab => {
      await prisma.user.update({
        where: {
          id: collab.id
        },
        data: {
          projects: {
            disconnect: {
              id: req.params.id
            }
          }
        }
      })
    })
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.put("/project-application/accept/:id", async (req, res) => {
  const { applierId } = req.body;
  const projectId = req.params.id;

  try {
    // Fetch project document
    const projectDoc = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!projectDoc) return res.status(404).send("Project not found");

    // Fetch application document
    const applicationDoc = await prisma.applications.findFirst({
      where: { AND: [{ userId: applierId }, { projectId: projectId }] },
    });
    if (!applicationDoc) return res.status(404).send("Application not found");

    // Check if there are enough slots available
    if (projectDoc.members_needed > 0) {
      // Update project
      console.log(applierId)
      await prisma.project.update({
        where: { id: projectId },
        data: {
          members_needed: projectDoc.members_needed - 1,
          collaborators: { connect: { id: applierId } },
        },
      });

      // Update application status
      await prisma.applications.update({
        where: { id: applicationDoc.id },
        data: { status: "ACCEPTED" },
      });

      return res.status(200).send("Application accepted");
    } else {
      await prisma.applications.update({
        where: { id: applicationDoc.id },
        data: { status: 'FILLED' },
      })
      return res.status(400).send("No slots available");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.put("/project-application/reject/:id", async (req, res) => {
  const { applierId } = req.body;
  const projectId = req.params.id;

  try {
    // Fetch application document
    const applicationDoc = await prisma.applications.findUnique({
      where: { userId_projectId: { userId: applierId, projectId } },
    });
    if (!applicationDoc) return res.status(404).send("Application not found");

    // Update application status to "REJECTED"
    await prisma.applications.update({
      where: { id: applicationDoc.id },
      data: { status: "REJECTED" },
    });

    return res.status(200).send("Application rejected");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.delete("/collaborators/:id", async (req, res) => {
  const { ownerId, collaboratorId } = req.body;
  const projectId = req.params.id;

  try {
    const projectDoc = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    })
    if (!projectDoc) {
      return res.status(404).send("Project not found");
    }
    await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        collaborators: {
          disconnect: {
            id: collaboratorId
          }
        },
        members_needed: projectDoc.members_needed + 1
      }
    })

    // Step 2: Update collaborator's document to remove projectId from their project list
    const collaboratorData = await prisma.user.findUnique({
      where: {
        id: collaboratorId
      }
    })

    if (collaboratorData) {
      await prisma.user.update({
        where: {
          id: collaboratorId
        },
        data: {
          projects: {
            disconnect: {
              id: projectId
            }
          }
        }
      })
    }

    return res.status(200).send("Collaborator removed successfully");
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;
