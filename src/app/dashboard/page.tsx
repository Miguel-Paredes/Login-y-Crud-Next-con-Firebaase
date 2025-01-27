import { NavBar } from "@/components/ui"
import type { Metadata } from "next"

export const metadata: Metadata ={
    title: "Dashboard",
    description: "Gestiona tus productos",
}

export default function Page (){
    return(
        <div>
            <NavBar/>
        </div>
    )
}