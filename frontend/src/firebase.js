import { initializeApp } from 'firebase/app';
import { getFirestore, useFirestoreEmulator  } from 'firebase/firestore';

// import { initializeFunctions } from 'firebase/functions';

class FireBase {
  constructor() {
    const app = initializeApp({
      apiKey: import.meta.env.VITE_apiKey,
      authDomain: import.meta.env.VITE_authDomain,
      projectId: import.meta.env.VITE_projectId,
      storageBucket: import.meta.env.VITE_storageBucket,
      appId: import.meta.env.VITE_appId,
      messagingSenderId: import.meta.env.VITE_messagingSenderId,
    });
    this.db = getFirestore();
    // this.functions = initializeFunctions(app);
    if(import.meta.env.DEV) {
      // this.functions.useFunctionsEmulator('http://localhost:5001');
      useFirestoreEmulator(this.db, 'localhost', 8080);
    }
    this.instance = app;
  }
}

const firebaseInstance = new FireBase();
Object.freeze(firebaseInstance);

export default firebaseInstance;
