/* eslint-disable */
import Firebase from 'firebase';
import { firebaseConfig } from '../config';

export const firebaseApp = Firebase.initializeApp(firebaseConfig);
