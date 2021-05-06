import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import getConfig from 'next/config';
import { Template } from './templates';
const { publicRuntimeConfig } = getConfig();

const initializeFirebase = async () => {
  try {
    firebase.initializeApp(publicRuntimeConfig.firebase);
    await firebase.auth().signInAnonymously();
  } catch (err) {
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }
  return firebase.firestore();
};

export const useFirebaseFeaturedTemplates = (): Template[] => {
  const [featuredTemplates, setFeaturedTemplates] = useState<Template[]>([]);

  useEffect(() => {
    (async () => {
      const db = await initializeFirebase();
      db.collection('featuredTemplates')
        .orderBy('order', 'asc')
        .onSnapshot((snapshot) => {
          if (snapshot.size) {
            const firebaseTemplates: Template[] = [];
            snapshot.forEach((doc) => {
              firebaseTemplates.push(doc.data() as Template);
            });
            setFeaturedTemplates(firebaseTemplates);
          }
        });
    })();
  }, []);

  return featuredTemplates;
};
