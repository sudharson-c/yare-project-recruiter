const { Router } = require('express');
const router = Router();
const Application = require("../models/Application");
const Projects = require('../models/Projects');
const User = require('../models/Users');

// Get all Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Projects.find();
    res.status(200).json({ projectData: projects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Projects for a specific user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const userProjects = await Projects.find({ _id: { $in: user.projectIds } });
    res.status(200).json({ userProjects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new Project
router.post("/", async (req, res) => {
  const { project_name, project_desc, project_link, owner, status, stipend, benefits, members_needed } = req.body;

  try {
    const existingProject = await Projects.findOne({ project_name });
    if (existingProject) return res.status(409).json({ message: "Project already exists" });

    const user = await User.findById(owner);
    if (!user) return res.status(404).json({ message: "Owner not found" });

    const newProject = new Projects({
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators: [],
      status,
      stipend,
      benefits,
      members_needed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedProject = await newProject.save();
    user.projectIds.push(savedProject._id);
    await user.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Error creating project", error });
  }
});

// Get Project By ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Projects.find({ _id: req.params.id }).populate('owner').populate('collaborators');
    if (!project) return res.status(404).send('Project not found');

    const applications = await Application.find({ projectId: project._id });
    res.status(200).json({ ...project, applications });
  } catch (error) {
    console.log(error.message)
    res.status(500).send(error.message);
  }
});

// Update Project By ID
router.put('/:id', async (req, res) => {
  try {
    const updatedData = { ...req.body, updatedAt: new Date() };
    const updatedProject = await Projects.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedProject) return res.status(404).send('Project not found');
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete Project By ID
router.delete('/:id', async (req, res) => {
  try {
    const project = await Projects.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send('Project not found');

    await User.updateMany(
      { _id: { $in: [project.owner, ...project.collaborators] } },
      { $pull: { projectIds: project._id } }
    );
    await Application.deleteMany({ projectId: project._id });

    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Accept an Application
router.put("/project-application/accept/:id", async (req, res) => {
  const { applierId } = req.body;
  try {
    const project = await Projects.findById(req.params.id);
    if (!project) return res.status(404).send("Project not found");

    const application = await Application.findOne({ projectId: project._id, applier: applierId });
    if (!application) return res.status(404).send("Application not found");

    if (project.members_needed > 0) {
      project.members_needed -= 1;
      project.collaborators.push(applierId);
      await project.save();

      await User.findByIdAndUpdate(applierId, { $addToSet: { projectIds: project._id } });
      application.status = "ACCEPTED";
      await application.save();

      res.status(200).send("Application accepted");
    } else {
      application.status = "PROJECT ALREADY RECRUITMENT FILLED";
      await application.save();
      res.status(400).send("Project is full");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Reject an Application
router.put("/project-application/reject/:id", async (req, res) => {
  const { applierId } = req.body;
  try {
    const application = await Application.findOne({ projectId: req.params.id, applier: applierId });
    if (!application) return res.status(404).send("Application not found");

    application.status = "REJECTED";
    await application.save();
    res.status(200).send("Application Rejected");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
