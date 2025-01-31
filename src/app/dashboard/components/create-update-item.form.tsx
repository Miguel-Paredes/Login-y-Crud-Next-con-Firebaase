"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDocument, UpdateDocument } from "@/lib/firebase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ItemImage, Products } from "@/interfaces/product.interfaces";
import DrapAndDropImage from "@/components/ui/drag-and-drop-images";
import { useUser } from "@/hooks/us-user";
import Image from "next/image";

interface CreateUpdateItemProps {
  children: React.ReactNode;
  itemToUpdate?: Products;
  getItems: () => Promise<void>;
}

export function CreateUpdateItem({
  children,
  itemToUpdate,
  getItems
}: CreateUpdateItemProps) {
  const user = useUser();
  const [isLoading, setisLoading] = useState<boolean>(false);
  // Para que se cierre el formulario una vez subido un producto
  const [open, setOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>('')

  // ! Información necesaria para la creacion del producto
  const formSchema = z.object({
    image: z.object({
      path: z.string(),
      url: z.string(),
    }),
    name: z.string().min(4, {
      message: "El nombre debe tener al menos 4 caracteres",
    }),
    // ? el metodo gt significa que debe de ser mayor
    price: z.coerce.number().gt(0, "El valor debe de ser mayor a 0"),
    // ? el metodo gte significa que puede ser igual o mayor
    units: z.coerce.number().gte(0, "El valor debe de ser igual o mayor a 0"),
  });

  // * Validación de datos
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: itemToUpdate ? itemToUpdate : {
      image: {} as ItemImage,
      name: "",
      price: undefined,
      units: undefined,
    }
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  // ? Actualizar el valor de la imagen
  const handleImage = (url: string) => {
    const path =  itemToUpdate ? itemToUpdate.image.path : `${user?.uid}/${Date.now}`;
    setValue("image", {
      url,
      path,
    });
    setImage(url)
  };

  useEffect(() => {
    if (itemToUpdate) setImage(itemToUpdate.image.url)
  }, [open])
  

  // todo: Envio de datos a la base de datos
  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    if(itemToUpdate)UpdateItem(item)
    else createItem(item);
  };

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

  // ! Agregar el producto a la coleccion de un usuario
  const createItem = async (item: Products) => {
    // * Accedemos a la coleccion del usuario y creamos una nueva subcoleccion
    const path = `users/${user?.uid}/products`;
    setisLoading(true);
    try {
      // ? Subir la imagen
      const base64 = item.image.url;
      const imageUrl = await uploadImageToCloudinary(base64);
      item.image.url = imageUrl;
      await addDocument(path, item);
      toast.success("Producto creado exitosamente");
      // todo: Se sube la informacion y se cierra
      setOpen(false);
      // * Limpiamos el formulatio
      form.reset();
      getItems();
      setImage('')
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setisLoading(false);
    }
  };
  
  // ! Actualizar el producto a la coleccion de un usuario
  const UpdateItem = async (item: Products) => {
    // * Accedemos al producto y lo actualizamos
    const path = `users/${user?.uid}/products/${itemToUpdate?.id}`;
    setisLoading(true);
    try {
      // ? Si la imagen cambia se debe de modificar en la bdd
      if(itemToUpdate?.image.url !== item.image.url){
        // ? Subir la imagen
        const delImage = itemToUpdate?.image.url
        DeleteImage(delImage)
        const base64 = item.image.url;
        const imageUrl = await uploadImageToCloudinary(base64);
        item.image.url = imageUrl;
      }
      await UpdateDocument(path, item);
      toast.success("Producto actualizado exitosamente");
      // todo: Se sube la informacion y se cierra
      setOpen(false);
      // * Limpiamos el formulatio
      form.reset();
      getItems()
      setImage('')
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setisLoading(false);
    }
  };

  const DeleteImage = async ( url : any ) => {
    try {
      const publicId = url.split("/").pop()?.split(".")[0] || "";

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
    } catch (error: any) {
      toast.error(error.message, {duration:5000} )
    }
  }

  return (
    // ! Para manejar el cierre del formulario una vez se creo el producto
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> { itemToUpdate? 'Actualizar Producto' : 'Crear Producto' } </DialogTitle>
          <DialogDescription>
            Gestiona tu producto con la siguiente información
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-12.5 px-14.5 shadow-lg rounded-xl text-center bg-white"
        >
          <div className="flex flex-col text-left mb-4" id="input-group">
            <label
              className="text-[#283629] text-sm font-semibold m-2 text-center"
              htmlFor="image"
            >
              Imagen
            </label>
            {
              image ? (
                <div className="text-center">

                  <Image
                    src={image}
                    width={1000}
                    height={1000}
                    alt="item-image"
                    className="w-20 m-auto"
                  />
                  <Button
                    type="button"
                    onClick={()=>handleImage('')}
                    disabled={isLoading}
                    className="mt-2"
                    >
                    Remover Imagen
                  </Button>
                </div>
              ):(

                <DrapAndDropImage handleImage={handleImage} />
              )
            }
            <label
              className="text-[#283629] text-sm font-semibold m-2 text-center"
              htmlFor="name"
            >
              Nombre:
            </label>
            <input
              {...register("name")}
              required
              className="px-4 py-2 md:px-6 rounded-full mb-5 bg-[#edfff0] border-2 border-[#faf0f1] outline-none placeholder:text-[#b5cab6]"
              type="text"
              name="name"
              id="name"
              step={0.01}
              placeholder="Nombre del Producto"
            />
            <div className="flex justify-center">
              <span className="text-red-500 w-max rounded-lg pt-1">
                {errors.name?.message}
              </span>
            </div>
            <label
              className="text-[#283629] text-sm font-semibold m-2 text-center"
              htmlFor="price"
            >
              Precio:
            </label>
            <input
              {...register("price")}
              required
              className="px-4 py-2 md:px-6 rounded-full mb-5 bg-[#edfff0] border-2 border-[#faf0f1] outline-none placeholder:text-[#b5cab6]"
              type="number"
              name="price"
              id="price"
              step={0.01}
              placeholder="0.00"
            />
            <div className="flex justify-center">
              <span className="text-red-500 w-max rounded-lg pt-1">
                {errors.price?.message}
              </span>
            </div>
            <label
              className="text-[#283629] text-sm font-semibold m-2 text-center"
              htmlFor="price"
            >
              Unidades:
            </label>
            <input
              {...register("units")}
              required
              className="px-4 py-2 md:px-6 rounded-full mb-5 bg-[#edfff0] border-2 border-[#faf0f1] outline-none placeholder:text-[#b5cab6]"
              type="number"
              name="units"
              id="units"
              step={1}
              placeholder="0"
            />
            <div className="flex justify-center">
              <span className="text-red-500 w-max rounded-lg pt-1">
                {errors.units?.message}
              </span>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                 { itemToUpdate? 'Actualizar' : 'Crear' } 
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
