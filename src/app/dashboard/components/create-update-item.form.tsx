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
import { CirclePlus, LoaderCircle } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDocument, setDocument } from "@/lib/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { ItemImage, Products } from "@/interfaces/product.interfaces";
import DrapAndDropImage from "@/components/ui/drag-and-drop-images";
import { useUser } from "@/hooks/us-user";

export function CreateUpdateItem() {
  const user = useUser()
  const [isLoading, setisLoading] = useState<boolean>(false);
  // Para que se cierre el formulario una vez subido un producto
  const [open, setOpen] = useState<boolean>(false)

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
    defaultValues: {
      image: {} as ItemImage,
      name: "",
      price: undefined,
      units: undefined,
    },
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  // ? Actualizar el valor de la imagen
  const handleImage = (url: string) => {
    let path = `${user?.uid}/${Date.now}`
    setValue('image', {
      url,
      path
    })
  }

  // todo: Envio de datos a la base de datos
  const onSubmit = async (item: z.infer<typeof formSchema>) => {
    console.log(item)
    createItem(item)
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
      const base64 = item.image.url
      const imagePath = item.image.path
      const imageUrl = await uploadImageToCloudinary(base64)
      item.image.url = imageUrl
      await addDocument(path, item);
      toast.success('Producto creado exitosamente')
      // todo: Se sube la informacion y se cierra
      setOpen(false)
      // * Limpiamos el formulatio
      form.reset()
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setisLoading(false);
    }
  };

  return (
    // ! Para manejar el cierre del formulario una vez se creo el producto
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6">
          Agregar
          <CirclePlus className="ml-2 w-[20px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
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
            <DrapAndDropImage handleImage={handleImage}/>
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
                Crear
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
