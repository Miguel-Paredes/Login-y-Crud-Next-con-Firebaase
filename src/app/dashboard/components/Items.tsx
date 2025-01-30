'use client'
import { getColection } from "@/lib/firebase";
import { CreateUpdateItem } from "./create-update-item.form";
import { useUser } from "@/hooks/us-user";
import { useEffect, useState } from "react";
import { TableView } from "./table-view";
import { Products } from "@/interfaces/product.interfaces";

export default function Items() {

  const user = useUser()
  const [items, setItems] = useState<Products[]>([])

  const getItems = async () => {
    // Indicamos la ruta en donde se encuentra la coleccion
    const path = `users/${user?.uid}/products`
    try {
      const res = await getColection(path) as Products[]
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
        <CreateUpdateItem/>
      </div>
      <TableView items={items}/>
    </>
  )
}
