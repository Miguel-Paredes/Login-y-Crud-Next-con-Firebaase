import { formatPrice } from "@/actions";
import { Button } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Products } from "@/interfaces/product.interfaces";
import { SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { CreateUpdateItem } from "./create-update-item.form";

export function TableView({ items, getItems }: { items: Products[], getItems: () => Promise<void>; }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-center">Imagen</TableHead>
          <TableHead className="text-center">Nombre</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead className="text-center">Unidades</TableHead>
          <TableHead className="text-center">Total</TableHead>
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
            <TableCell className="font-semibold w-[350px]">
              {item.name}
            </TableCell>
            <TableCell>{formatPrice(item.price)}</TableCell>
            <TableCell className="text-center">{item.units}</TableCell>
            <TableCell className="text-center">
              {formatPrice(item.units * item.price)}
            </TableCell>
            <TableCell className="text-center">
              <CreateUpdateItem itemToUpdate={item} getItems={getItems}>
                <Button>
                  <SquarePen />
                </Button>
              </CreateUpdateItem>
              <Button className="ml-4" variant={"destructive"}>
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
