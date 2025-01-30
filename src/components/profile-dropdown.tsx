"use client";
import {
  CircleUserRound,
  FileText,
  LifeBuoy,
  LogOut,
  User,
  ImagePlus,
  LoaderCircle,
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
import { useState, useEffect } from "react"; // No necesitas useRef
import { singOut, UpdateDocument } from "@/lib/firebase";
import { FileToBase64 } from "@/actions";
import Image from "next/image";
import { RxUpdate } from "react-icons/rx";
import toast from "react-hot-toast";

export function ProfileDropdown() {
  const user = useUser();
  const [image, setImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);
    const file = event.target.files?.[0];
    let update = false
    if (!file) return;
    if (image) {
      await handleDeleteImage();
      update = true
    }
    try {
      const base64 = await FileToBase64(file);
      const imageUrl = await uploadImageToCloudinary(base64);

      setImage(imageUrl);
      await UpdateDocument(`users/${user?.uid}`, { image: imageUrl });
      localStorage.setItem("userImage", imageUrl); // Guardar la imagen en el localStorage
      update ? toast.success('Imagen Actualizada') :toast.success('Imagen agregada')
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
      console.error("Error al subir la imagen:", error);
    } finally {
      setIsLoading(false);
      event.target.value = "";
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
          {image ? (
            <Image
              src={image}
              width={1000}
              height={1000}
              alt="Profile"
              className="object-cover w-6 h-6 rounded-full m-auto"
            />
          ) : (
            <CircleUserRound className="m-auto w-6 h-6" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">
          {!image &&
            (isLoading ? (
              <LoaderCircle className="h-14 w-14 animate-spin m-auto mb-3" />
            ) : (
              <>
                <div className="flex justify-center">
                  <div>
                    <input
                      id="files"
                      type="file"
                      className="hidden"
                      onChange={chooseImage}
                      accept="image/png, image/webp, image/jpeg"
                    />
                    <label htmlFor="files">
                      <div className="w-[40px] h-[28px] cursor-pointer rounded-lg text-white bg-slate-950 hover:bg-slate-600 flex justify-center items-center">
                        <ImagePlus className="w-[18px] h-[18px]" />
                      </div>
                    </label>
                  </div>
                </div>
              </>
            ))}
          {image && (
            <Image
              src={image}
              width={1000}
              height={1000}
              alt="Profile"
              className="object-cover w-20 h-20 rounded-full m-auto"
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
        <DropdownMenuLabel className="text-center">
          {image && (
            <div className="flex justify-start">
              <div>
                <input
                  id="files"
                  type="file"
                  className="hidden"
                  onChange={chooseImage}
                  accept="image/png, image/webp, image/jpeg"
                />
                <label htmlFor="files">
                  <div className="flex justify-center">
                    <RxUpdate className="mr-2 h-4 w-4" />
                    <p className=" ml-2 font-normal">Actualizar Imagen</p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </DropdownMenuLabel>
        <button onClick={() => singOut()} className="w-full">
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
