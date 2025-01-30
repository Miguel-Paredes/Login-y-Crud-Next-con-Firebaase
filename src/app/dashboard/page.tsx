import { NavBar } from "@/components/ui"
import type { Metadata } from "next"
import Items from "./components/Items"

export const metadata: Metadata ={
    title: "Dashboard",
    description: "Gestiona tus productos",
}

export default function Page (){
    return(
        <>
            <NavBar/>
            <div className="md:border border-solid border-gray-300 rounded-3xl p-3 pl-2 md:m-6 lg:mx-36 ">
                <Items/>
            </div>
        </>
    )
}