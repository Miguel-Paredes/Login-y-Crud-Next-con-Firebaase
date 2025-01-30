'use client'
import { getColection } from "@/lib/firebase";
import { CreateUpdateItem } from "./create-update-item.form";
import { useUser } from "@/hooks/us-user";
import { useEffect, useState } from "react";
import { TableView } from "./table-view";
import { Products } from "@/interfaces/product.interfaces";
import { Button } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { orderBy, where } from "firebase/firestore";

export default function Items() {

  const user = useUser()
  const [items, setItems] = useState<Products[]>([])

  const getItems = async () => {
    // Indicamos la ruta en donde se encuentra la coleccion
    const path = `users/${user?.uid}/products`
    const query = [
      // Ordenar por fecha creacion de producto
      orderBy('createdAt', 'desc'),
      // Si el precio es igual a 12
      // where('price', '==', 12)
    ]
    try {
      const res = await getColection(path, query) as Products[]
      setItems(res)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(user) getItems()
  }, [user])
  

  return (
    <>
      <div className="flex justify-between items-center m-4 mb-8">
        <h1 className="text-2xl ml-1">Productos</h1>
        <CreateUpdateItem getItems={getItems}>
          <Button className="px-6">
            Agregar
            <CirclePlus className="ml-2 w-[20px]" />
          </Button>
        </CreateUpdateItem>
      </div>
      <TableView items={items} getItems={getItems}/>
    </>
  )
}
