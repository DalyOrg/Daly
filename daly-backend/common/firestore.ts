import { initializeApp, cert } from "firebase-admin/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase-admin/firestore';

console.log(__dirname)

// in /dist/common when compiled
const serviceAccount = require(`../../${process.env.SERVICE_KEY_PATH}`);

const firebaseConfig = {
  credential: cert(serviceAccount),
  databaseURL: process.env.FIRESTORE_URL
}

initializeApp(firebaseConfig);
export const db = getFirestore();