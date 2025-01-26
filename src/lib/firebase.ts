// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)

// ! Funciones del Auth
// todo: Inicio de sesion con el correo y la contraseña
export const singIn = async ( user : { email : string, password : string } ) => {
  return await signInWithEmailAndPassword(auth, user.email, user.password)
}

// todo: Cerrar sesion
export const singOut = async () => {
  return await auth.signOut()
}

// todo: Crear usuario nuevo
export const CreateUser = async ( user : { name: string, email: string, password: string } ) => {
  return createUserWithEmailAndPassword(auth, user.email, user.password)
}

// todo: Modificar informacion del usuario
export const UpdateUser = async ( user : { displayName?: string | null; photoURL?: string | null; } ) =>{
  if (auth.currentUser) return updateProfile(auth.currentUser, user )
}

// ! Funciones con la base de datos

// todo: Creacion de informacion y almacenamiento
export const setDocument = ( path: string, data : any ) => {
  data.createdAt = serverTimestamp()
  return setDoc(doc(db,path), data)
}

// todo: Busqueda de informacion
export const getDocument = async ( path: string ) => {
  return (await getDoc(doc(db,path),)).data()
}