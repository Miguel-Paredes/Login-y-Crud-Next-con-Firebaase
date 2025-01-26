'use client'
import { singOut } from "@/lib/firebase";

export default function Page (){
    return(
        <div>
            <h1>Dashboard</h1>
            <button onClick={()=>singOut()}>Cerrar Sesión</button>
        </div>
    )
}