'use client';

import "./globals.css";
import { inter } from "@/config/Fonts";
import { Toaster } from "react-hot-toast";
import { useUser } from "@/hooks/us-user";
import { redirect, usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ! Proteccion de rutas
  const user = useUser()
  const pathName = usePathname()
  // ? Rutas a las que no puede acceder si esta iniciado sesion
  const authRoutes = ["/", "/sign-up", "/forgot-password"]
  // Validacion para que no acceda a esas rutas
  const isInAuthRoutes = authRoutes.includes(pathName)
  // Redireccionamos a dashboard si esta logeado
  if(user && isInAuthRoutes) return redirect('/dashboard')
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased p-0 m-0`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
