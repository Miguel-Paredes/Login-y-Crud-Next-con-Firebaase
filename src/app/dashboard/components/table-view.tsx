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
import { ConfirmDeliton } from "./confirm-delete";
import { Skeleton } from "@/components/ui/skeleton";

interface TableViewProps {
  items: Products[];
  getItems: () => Promise<void>;
  DeleteItem: (item: Products) => Promise<void>;
  isLoading : boolean
}

export function TableView({ items, getItems, DeleteItem, isLoading }: TableViewProps) {
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
        {!isLoading && items && items.map((item) => (
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
              <ConfirmDeliton DeleteItem={DeleteItem} item={item}>
                <Button className="ml-4" variant={"destructive"}>
                  <Trash2 />
                </Button>
              </ConfirmDeliton>
            </TableCell>
          </TableRow>
        ))}
        { isLoading && [1, 1, 1, 1, 1, 1, 1].map((e, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="w-16 h-16 rounded-lg" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-4" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
