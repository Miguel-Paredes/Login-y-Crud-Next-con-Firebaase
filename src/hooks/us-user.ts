import { getFromLoacalStorage, setInLoacalStorage } from "@/actions"
import { User } from "@/interfaces"
import { auth, getDocument } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DocumentData } from "firebase/firestore"
import { useEffect, useState } from "react"

export const useUser = () => {
    const [User, setUser] = useState<User | undefined | DocumentData>(undefined)
    // ! Funcion para obtener la informacion del usuario
    const getUserFromBD = async ( uid : string ) => {
        const path = `users/${uid}`
        try {
            let res = await getDocument(path)
            setUser(res)
            setInLoacalStorage('user', res)
        } catch (error) {
            
        }
    }
    useEffect(() => {
      return onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
            // ? Revisamos si hay informacion en el local storage
            const UserLocal = getFromLoacalStorage('user')
            // Si hay informacion la usamos
            if (UserLocal) {
                setUser(UserLocal)
            } else {
                // Si no la hay la obtenemos de la base de datos
                getUserFromBD(authUser.uid)
            }
        } else {
            console.log('User is signed out')
        }
      })

    }, [])
    return User
}