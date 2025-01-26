import type { Metadata } from 'next'
import Login from './components/login'

export const metadata : Metadata = {
    title: "Iniciar Sesión",
    description: "Inicia sesión en tu cuenta de usuario",
}

export default function Page (){
    
    return(
        <div>
            <Login/>
        </div>
    )
}