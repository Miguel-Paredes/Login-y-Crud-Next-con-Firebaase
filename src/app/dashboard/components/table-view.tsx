import { formatPrice } from "@/actions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Products } from "@/interfaces/product.interfaces"
import Image from "next/image"

  export function TableView( { items } : { items : Products[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Unidades</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-center w-[250px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Image
                    src={item.image.url}
                    width={1000}
                    height={1000}
                    alt={item.name}
                    className="object-cover w-16 h-16"
                />
                </TableCell>
              <TableCell className="font-semibold w-[350px]">{item.name}</TableCell>
              <TableCell>{formatPrice(item.price)}</TableCell>
              <TableCell className="text-right">{item.units}</TableCell>
              <TableCell className="text-right">{formatPrice(item.units * item.price)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  