import { getFromLoacalStorage, setInLoacalStorage } from "@/actions"
import { User } from "@/interfaces"
import { auth, getDocument } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DocumentData } from "firebase/firestore"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useUser = () => {
    const [User, setUser] = useState<User | undefined | DocumentData>(undefined)
    const pathName = usePathname()
    const router = useRouter()
    // ? Rutas a las que no puede acceder si NO esta iniciado sesion
    const protectedRoutes = ["/dashboard"]
    // Validacion para que no acceda a esas rutas
    const isInProtectedRoutes = protectedRoutes.includes(pathName)
    
    
    // ! Funcion para obtener la informacion del usuario
    const getUserFromBD = async ( uid : string ) => {
        const path = `users/${uid}`
        try {
            const res = await getDocument(path)
            setUser(res)
            setInLoacalStorage('user', res)
        } catch (error) {
            console.log(error)
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
            // ? Si el usuario no esta logeado
            if(isInProtectedRoutes) return router.push('/')
        }
      })

    }, [])
    return User
}