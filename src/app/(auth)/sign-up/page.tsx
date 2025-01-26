import type { Metadata } from 'next'
import SignUp from './component/signup'

export const metadata : Metadata = {
    title: "Crear Cuenta",
    description: "Creación de cuenta de un usuario",
}

export default function Page(){

    return(
        <div>
            <SignUp/>
        </div>
    )
}