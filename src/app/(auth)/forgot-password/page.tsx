import type { Metadata } from "next";
import ForgotPassword from "./component/forgotpassword";

export const metadata: Metadata = {
    title: "Recuperar Contraseña",
    description: "Reestablecer la contraseña de usuario por medio de un correo electrónico",
}

export default function Page() {
    return (
        <div>
            <ForgotPassword/>
        </div>
    )
}
