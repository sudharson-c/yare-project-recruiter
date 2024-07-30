const { Router } = require('express');
const router = Router();
const { projectDb, userDb } = require('../config/firebase'); // Ensure correct imports
const { firestore } = require('firebase-admin');

// Get all Projects
router.get('/', async (req, res) => {
  try {
    const projectsSnapshot = await projectDb.get();
    const projects = await Promise.all(
      projectsSnapshot.docs.map(async (doc) => {
        let project = { ...doc.data(), id: doc.id };
        const userRef = userDb.doc(project.owner);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          project.owner = userDoc.data();
        } else {
          project.owner = null;
        }
        return project;
      })
    );
    res.status(200).json({ projectData: projects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Projects for a specific user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Retrieve the user document
    const userDoc = await userDb.doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }
    const userData = userDoc.data();
    
    // Find projects where the owner or collaborators include this user
    const userProjectsSnapshot = await projectDb
      .where('owner', '==', userId)
      .get();
    const userProjects = userProjectsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    userProjects.map((project)=>{
      project.owner =  userData;
    });
    res.status(200).json({ userProjects : userProjects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new Project
router.post("/", async (req, res) => {
  const { project_name, project_desc, project_link, owner, collaborators, status, stipend, benefits, members_needed } = req.body;
  try {
    // Create a new project document
    const newProject = {
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators,
      status,
      stipend,
      benefits,
      members_needed,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // Check for project
    const projectSnapshot = await projectDb.where('project_name', '==', project_name).get();
    if (!projectSnapshot.empty) {
      return res.status(409).json({ message: "Project already exists" });
    }

    // Add the new project to the Firestore
    const projectRef = await projectDb.add(newProject);
    console.log(`Project: ${projectRef.id} is created`);

    // Update the owner's projectIds field
    const userRef = userDb.doc(owner);
    await userRef.update({
      projectIds : firestore.FieldValue.arrayUnion(projectRef.id)
    });

    res.status(201).json({ id: projectRef.id, ...newProject });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error:error });
  }
});

// Get Project By ID
router.get('/:id', async (req, res) => {
  try {
    const projectDoc = await projectDb.doc(req.params.id).get();
    if (!projectDoc.exists) return res.status(404).send('Project not found');
    const currProject = { id: projectDoc.id, ...projectDoc.data() }
    const userRef = userDb.doc(currProject.owner);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          currProject.owner = userDoc.data();
        } else {
          currProject.owner = null;
        }
    res.status(200).json(currProject);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update Project By ID
router.put('/:id', async (req, res) => {
  const { project_name, project_desc, project_link, owner, collaborators, status } = req.body;
  try {
    const projectRef = projectDb.doc(req.params.id);
    await projectRef.update({
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators,
      status,
      updatedAt: new Date().toISOString()
    });
    const updatedProjectDoc = await projectRef.get();
    if (!updatedProjectDoc.exists) return res.status(404).send('Project not found');
    res.status(200).json({ id: updatedProjectDoc.id, ...updatedProjectDoc.data() });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete Project By ID
router.delete('/:id', async (req, res) => {
  try {
    const projectRef = projectDb.doc(req.params.id);
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) return res.status(404).send('Project not found');
    const projectData = projectDoc.data();
    const ownerRef = userDb.doc(projectData.owner);
    await ownerRef.update({
      projectIds: firestore.FieldValue.arrayRemove(req.params.id)
    });

    // Delete the project
    await projectRef.delete();
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
