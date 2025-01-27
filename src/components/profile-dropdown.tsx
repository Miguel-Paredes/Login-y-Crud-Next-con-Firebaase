"use client";
import {
  CircleUserRound,
  FileText,
  LifeBuoy,
  LogOut,
  User,
  ImagePlus,
} from "lucide-react";
import { Button } from "./ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/us-user";
import { useState, useEffect } from "react"; // Importa useEffect
import { singOut, UpdateDocument } from "@/lib/firebase";
import { FileToBase64 } from "@/actions";
import Image from "next/image";

export function ProfileDropdown() {
  const user = useUser();
  const [image, setImage] = useState<string>("");

  // Efecto para cargar la imagen del localStorage al montar el componente
  useEffect(() => {
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) {
      setImage(storedImage);
    } else if (user?.image) {
      setImage(user.image);
    }
  }, [user]);

  // Función para subir la imagen a Cloudinary usando la API
  const uploadImageToCloudinary = async (base64: string) => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: base64 }),
      });

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error en uploadImageToCloudinary:", error);
      throw error;
    }
  };

  // Función para eliminar la imagen de Cloudinary usando la API
  const deleteImage = async () => {
    if (!image) return;

    try {
      const publicId = image.split("/").pop()?.split(".")[0] || "";

      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la imagen");
      }

      const data = await response.json();
      console.log("Imagen eliminada:", data);

      setImage("");
      await UpdateDocument(`users/${user?.uid}`, { image: "" });
      localStorage.removeItem("userImage"); // Eliminar la imagen del localStorage
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  // Función para elegir una imagen
  const chooseImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await FileToBase64(file);
      const imageUrl = await uploadImageToCloudinary(base64);

      setImage(imageUrl);
      await UpdateDocument(`users/${user?.uid}`, { image: imageUrl });
      localStorage.setItem("userImage", imageUrl); // Guardar la imagen en el localStorage
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  // Función para eliminar la imagen
  const handleDeleteImage = async () => {
    if (!image) return;

    try {
      await deleteImage();
      setImage("");
      await UpdateDocument(`users/${user?.uid}`, { image: "" });
      localStorage.removeItem("userImage"); // Eliminar la imagen del localStorage
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="mr-2">Cuenta</span>
          <CircleUserRound className="m-auto w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">
          <div className="flex justify-center">
            <div>
              <input
                id="files"
                type="file"
                className="hidden"
                onChange={chooseImage}
              />
              <label htmlFor="files">
                <div className="w-[40px] h-[28px] cursor-pointer rounded-lg text-white bg-slate-950 hover:bg-slate-600 flex justify-center items-center">
                  <ImagePlus className="w-[18px] h-[18px]" />
                </div>
              </label>
            </div>
          </div>
          {image && (
            <Image
              src={image}
              width={20}
              height={20}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto mt-2"
            />
          )}
          {user?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            Terminos y Condiciones
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {image && (
          <DropdownMenuItem onClick={handleDeleteImage}>
            <LogOut className="mr-2 h-4 w-4" />
            Eliminar imagen
          </DropdownMenuItem>
        )}
        <button onClick={() => singOut()}>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
