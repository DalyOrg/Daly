import { initializeApp, cert } from "firebase-admin/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase-admin/firestore';

console.log(__dirname)

// in /dist/common when compiled
const serviceAccount = require(`../../dalyorg-afce8-firebase-adminsdk-aq9ci-d2272d8f98.json`);

const firebaseConfig = {
  credential: cert(serviceAccount),
  databaseURL: process.env.FIRESTORE_URL
}

initializeApp(firebaseConfig);
export const db = getFirestore();