const admin = require("firebase-admin");
const {getFirestore} = require('firebase-admin/firestore')
const serviceAccount = require("./creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-cc-lab-default-rtdb.firebaseio.com"
});

console.log('Firebase started')
const fireDb = admin.firestore()

const authFb = admin.auth()

const projectDb = fireDb.collection("projects")
const userDb = fireDb.collection("users")



module.exports = { fireDb,authFb,projectDb,userDb}