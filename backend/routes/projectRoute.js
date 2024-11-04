const { Router, application } = require('express');
const router = Router();
const dbx  = require("../config/dropbox")
const { projectDb, userDb } = require('../config/firebase'); // Ensure correct imports
const {firestore} = require('firebase-admin');
const Application = require("../models/Application")

const connectDB = require("../config/db")
connectDB()
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

// router.post("/file", fileUpload(), async (req, res) => {
//   const file = req.files.file;
//   const userId = req.body.username;
//   const projectId = req.body.project_id;
//   const folderPath = `/users`;

//   try {
//     // Create a directory for the user if it doesn't exist
//     await dbx.filesCreateFolderV2({ path: folderPath });

//     // Upload the file to the user's directory
//     const dropboxPath = `${folderPath}/${projectId}/${file.name}`;
//     const uploadResponse = await dbx.filesUpload({
//       path: dropboxPath,
//       contents: file.data,
//       mode: "add",
//       autorename: true,
//       mute: true,
//     });
//     res.json({ message: "File uploaded successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });
// router.get("/file/:fileId",async (req,res)=>{
//   const fileId = req.params.fileId;
//   const folderPath = `/users`;
//   const dropboxPath = `${folderPath}/${fileId}`;
//   try{
//     const linkResponse = (await dbx.filesListFolder({path:dropboxPath})).result.entries[0]
//     const finalLink = (await dbx.filesGetTemporaryLink({path:linkResponse.path_display})).result.link
//     res.json({ link: finalLink });
//   }catch(err){
//     console.log(err)
//     res.status(500).json({error: err})
//   }
// })

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
    let currProject = { id: projectDoc.id, ...projectDoc.data() };
    const userRef = userDb.doc(currProject.owner.clerkId);
    const userDoc = await userRef.get();
    currProject.owner = userDoc.exists ? userDoc.data() : null;
    const applicationExist = await Application.find({projectId:currProject.id})
    if (applicationExist)
        currProject = {...currProject,application:applicationExist}
    res.status(200).json(currProject);
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  }
});
router.get("/applications/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // Find all applications made by the user
    const userApplications = await Application.find({ applier: userId });
    // Fetch project data for each application using projectId
    const projectApplied = await Promise.all(
      userApplications.map(async (application) => {
        const projectDoc = await projectDb.doc(application.projectId).get();
        return projectDoc.exists ? projectDoc.data() : null;
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
    const projectDetails = (await projectDb.doc(id).get()).data();
    // Get all applications for the project
    const projectApplications = await Application.find({ projectId: id });
    // Use Promise.all to fetch user details for each application
    const applicationsWithUserDetails = await Promise.all(
      projectApplications.map(async (application) => {
        const userDetails = (await userDb.doc(application.applier).get()).data();
        return { ...application.toObject(), userDetails };
      })
    );
    res.status(200).json({ projectDetails, projectApplications: applicationsWithUserDetails });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.post('/apply',async (req,res)=>{
  try {
    const application = req.body;
    const existingApplication = await Application.findOne({
      projectId: application.projectId,
      applier: application.applier,
    });

    if (existingApplication) {
      console.log("Applied already")
      return res.json({ message: 'Already Applied' });
    }

    const newApplication = new Application(application);
    await newApplication.save();

    return res.status(201).json({ message: 'Successfully Applied' });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
  
})

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

router.put('')
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
    await Application.deleteMany({projectId:req.params.id})
    await projectRef.delete();
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
    const projectSnapshot = await projectDb.doc(projectId).get();
    const projectDoc = projectSnapshot.exists ? projectSnapshot.data() : null;
    if (!projectDoc) {
      return res.status(404).send("Project not found");
    }
    // Fetch application document
    const applicationDoc = await Application.findOne({ projectId, applier: applierId });
    if (!applicationDoc) {
      return res.status(404).send("Application not found");
    }
    // Check if there are enough slots available
    if (projectDoc.members_needed > 0) {
      projectDoc.members_needed -= 1;
      projectDoc.collaborators.push(applierId);
      await projectDb.doc(projectId).update(projectDoc);
      // Update the user's project list
      const userSnapshot = await userDb.doc(applierId).get();
      const userDoc = userSnapshot.exists ? userSnapshot.data() : null;

      if (userDoc) {
        const updatedProjectIds = userDoc.projectIds || [];
        updatedProjectIds.push(projectId);
        await userDb.doc(applierId).update({ projectIds: updatedProjectIds });
      } else {
        return res.status(404).send("User not found");
      }
      // Update application status
      await applicationDoc.updateOne({ status: "ACCEPTED" });
      res.status(200).send("Application accepted");
    } else {
      // Update status if recruitment is full
      await applicationDoc.updateOne({ status: "PROJECT ALREADY RECRUITMENT FILLED" });
      return res.status(400).send("Project is full");
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
    // Fetch project document
    const projectSnapshot = await projectDb.doc(projectId).get();
    const projectDoc = projectSnapshot.exists ? projectSnapshot.data() : null;
    
    if (!projectDoc) {
      return res.status(404).send("Project not found");
    }

    // Fetch application document
    const applicationDoc = await Application.findOne({ projectId, applier: applierId });
    if (!applicationDoc) {
      return res.status(404).send("Application not found");
    }

    // Update application status to "REJECTED"
    await applicationDoc.updateOne({ status: "REJECTED" });
    return res.status(200).send("Application Rejected");

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


module.exports = router;
