const { Router } = require('express');
const router = Router(); 
const Project = require('../models/ProjectModel');
const User = require('../models/UserModel')

// Get all Projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('owner collaborators');
    // console.log(projects)
    res.status(200).json({projectData : projects});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new Project
router.post("/", async (req, res) => {
  const { project_name, project_desc, project_link, owner, collaborators, status, stipend, benefits, members_needed } = req.body;

  try {
    // Create a new project
    const newProject = new Project({
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators,
      status,
      stipend,
      benefits,
      members_needed
    });

    // Save the new project
    const savedProject = await newProject.save();

    // Update the owner's projectIds field
    await User.findByIdAndUpdate(owner, { $push: { projectIds: savedProject._id } });

    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});

// Get Project By ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner collaborators');
    if (!project) return res.status(404).send('Project not found');
    res.status(200).json(project);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update Project By ID
router.put('/:id', async (req, res) => {
  const { project_name, project_desc, project_link, owner, collaborators, status } = req.body;
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators,
      status
    }, { new: true }).populate('owner collaborators');
    if (!project) return res.status(404).send('Project not found');
    res.status(200).json(project);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete Project By ID
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    await User.findByIdAndUpdate
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
