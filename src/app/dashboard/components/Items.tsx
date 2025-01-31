"use client";
import { delDocument, getColection } from "@/lib/firebase";
import { CreateUpdateItem } from "./create-update-item.form";
import { useUser } from "@/hooks/us-user";
import { useEffect, useState } from "react";
import { TableView } from "./table-view";
import { Products } from "@/interfaces/product.interfaces";
import { Badge, Button } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { orderBy } from "firebase/firestore";
import toast from "react-hot-toast";
import { formatPrice } from "@/actions";
import ListView from "./list-view";

export default function Items() {
  const user = useUser();
  const [items, setItems] = useState<Products[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(true);

  const getItems = async () => {
    // Indicamos la ruta en donde se encuentra la coleccion
    const path = `users/${user?.uid}/products`;
    const query = [
      // Ordenar por fecha creacion de producto
      orderBy("createdAt", "desc"),
      // Si el precio es igual a 12
      // where('price', '==', 12)
    ];
    setisLoading(true);
    try {
      const res = (await getColection(path, query)) as Products[];
      setItems(res);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  // ! Actualizar el producto a la coleccion de un usuario
  const DeleteItem = async (item: Products) => {
    // * Accedemos al producto y lo actualizamos
    const path = `users/${user?.uid}/products/${item?.id}`;
    setisLoading(true);
    try {
      DeleteImage(item.image.url);

      await delDocument(path);
      toast.success("Producto actualizado exitosamente");
      const newItems = items.filter((i) => i.id != item.id);
      setItems(newItems);
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setisLoading(false);
    }
  };

  const DeleteImage = async (url: any) => {
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
    } catch (error : any) {
      toast.error( error.message, { duration : 5000 } )
    }
  };

  // Costo total de la suma de todos los productos
  const getProfits = () => {
    return items.reduce((index, item) => index + item.price * item.units, 0);
  };

  useEffect(() => {
    if (user) getItems();
  }, [user]);

  return (
    <>
      <div className="flex justify-between items-center m-4 mb-8">
        <div>
          <h1 className="text-2xl ml-1">Productos</h1>
          {items.length > 0 && (
            <Badge className="mt-2 text-[14px]" variant={"outline"}>
              Precio Final: {formatPrice(getProfits())}
            </Badge>
          )}
        </div>
        <CreateUpdateItem getItems={getItems}>
          <Button className="px-6">
            Agregar
            <CirclePlus className="ml-2 w-[20px]" />
          </Button>
        </CreateUpdateItem>
      </div>
      <TableView
        items={items}
        getItems={getItems}
        DeleteItem={DeleteItem}
        isLoading={isLoading}
      />
      <ListView
        items={items}
        getItems={getItems}
        DeleteItem={DeleteItem}
        isLoading={isLoading}
      />
    </>
  );
}
