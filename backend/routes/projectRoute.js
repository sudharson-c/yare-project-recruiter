const { Router } = require('express');
const router = Router();
const dbx  = require("../config/dropbox")
const fileUpload = require("express-fileupload");
const { projectDb, userDb } = require('../config/firebase'); // Ensure correct imports
const { firestore } = require('firebase-admin');

const Application = require("../models/Application")

// Get all Projects
router.get('/', async (req, res) => {
  try {
    const projects = (await projectDb.get()).docs.map((doc)=>({id:doc.id,...doc.data()}))
    res.status(200).json({ projectData: projects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Projects for a specific user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const userDoc = await userDb.doc(userId).get();
    if (!userDoc.exists) return res.status(404).send("User not found");
    const userProjectsSnapshot = await projectDb.where('owner.clerkId', '==', userId).get();
    const userProjects = userProjectsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const userData = userDoc.data();
    res.status(200).json({ userProjects: userProjects });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/file", fileUpload(), async (req, res) => {
  const file = req.files.file;
  const userId = req.body.username;
  const projectId = req.body.project_id;
  const folderPath = `/users`;

  try {
    // Create a directory for the user if it doesn't exist
    await dbx.filesCreateFolderV2({ path: folderPath });

    // Upload the file to the user's directory
    const dropboxPath = `${folderPath}/${projectId}/${file.name}`;
    const uploadResponse = await dbx.filesUpload({
      path: dropboxPath,
      contents: file.data,
      mode: "add",
      autorename: true,
      mute: true,
    });
    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/file/:fileId",async (req,res)=>{
  const fileId = req.params.fileId;
  const folderPath = `/users`;
  const dropboxPath = `${folderPath}/${fileId}`;
  try{
    const linkResponse = (await dbx.filesListFolder({path:dropboxPath})).result.entries[0]
    const finalLink = (await dbx.filesGetTemporaryLink({path:linkResponse.path_display})).result.link
    res.json({ link: finalLink });
  }catch(err){
    console.log(err)
    res.status(500).json({error: err})
  }

})

// Create a new Project
router.post("/", async (req, res) => {
  const { project_name, project_desc, project_link, owner, status, stipend, benefits, members_needed } = req.body;
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

    const projectSnapshot = await projectDb.where('project_name', '==', project_name).get();
    if (!projectSnapshot.empty) return res.status(409).json({ message: "Project already exists" });
    const userRef = userDb.doc(owner);
    newProject.owner = (await userRef.get()).data()
    const projectRef = await projectDb.add(newProject);
    console.log(`Project: ${projectRef.id} is created`);

    await userRef.update({
      projectIds: firestore.FieldValue.arrayUnion(projectRef.id)
    });

    res.status(201).json({ id: projectRef.id, ...newProject });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error });
  }
});

// Get Project By ID
router.get('/:id', async (req, res) => {
  try {
    const projectDoc = await projectDb.doc(req.params.id).get();

    if (!projectDoc.exists) return res.status(404).send('Project not found');

    const currProject = { id: projectDoc.id, ...projectDoc.data() };
    const userRef = userDb.doc(currProject.owner.clerkId);
    const userDoc = await userRef.get();
    currProject.owner = userDoc.exists ? userDoc.data() : null;

    res.status(200).json(currProject);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update Project By ID
router.put('/:id', async (req, res) => {
  const { project_name, project_desc, project_link, owner, collaborators, status, stipend, benefits, members_needed, createdAt } = req.body;
  try {
    const projectRef = projectDb.doc(req.params.id);
    await projectRef.update({
      project_name,
      project_desc,
      project_link,
      owner,
      collaborators,
      status,
      stipend,
      members_needed,
      benefits,
      createdAt,
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
    const ownerRef = userDb.doc(projectData.owner.clerkId);
    await ownerRef.update({
      projectIds: firestore.FieldValue.arrayRemove(req.params.id)
    });

    await projectRef.delete();
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
