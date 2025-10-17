import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Replace with YOUR config from Firebase Console
// const firebaseConfig = {
//   apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
//   authDomain: "your-project.firebaseapp.com",
//   databaseURL: "https://your-project-default-rtdb.firebaseio.com",
//   projectId: "your-project",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789012",
//   appId: "1:123456789012:web:abcdef1234567890"
// };

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA26JwurATLYg7BduunhYRQuNqGiTJ4JVg",
  authDomain: "lumon-industries.firebaseapp.com",
  databaseURL: "https://lumon-industries-default-rtdb.firebaseio.com",
  projectId: "lumon-industries",
  storageBucket: "lumon-industries.firebasestorage.app",
  messagingSenderId: "824565415903",
  appId: "1:824565415903:web:b11fff2f5ca30950850e6a"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);