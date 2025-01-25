// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

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