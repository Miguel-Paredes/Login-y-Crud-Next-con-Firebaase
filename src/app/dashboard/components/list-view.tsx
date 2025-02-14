import { formatPrice } from "@/actions";
import { Badge, Button } from "@/components/ui";
import { Products } from "@/interfaces/product.interfaces";
import { LayoutList, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import { CreateUpdateItem } from "./create-update-item.form";
import { ConfirmDeliton } from "./confirm-delete";
import { Skeleton } from "@/components/ui/skeleton";

interface ListViewProps {
  items: Products[];
  getItems: () => Promise<void>;
  DeleteItem: (item: Products) => Promise<void>;
  isLoading: boolean;
}

export default function ListView({
  items,
  getItems,
  DeleteItem,
  isLoading,
}: ListViewProps) {
  return (
    <div className="block md:hidden">
      {!isLoading &&
        items &&
        items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center mb-6 border border-solid border-gray-300 rounded-xl p-6"
          >
            <div className="flex justify-start items-center">
              <Image
                src={item.image.url}
                width={1000}
                height={1000}
                alt={item.name}
                className="object-cover w-16 h-16"
              />
              <div className="ml-6">
                <h3 className="font-semibold"> {item.name} </h3>
                <div className="text-sm">
                  Precio: {formatPrice(item.price)} <br />
                  Unidades: {item.units} <br />
                  <Badge className="mt-2" variant={"outline"}>
                    Total: {formatPrice(item.price)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="ml-2">
              <CreateUpdateItem itemToUpdate={item} getItems={getItems}>
                <Button className="w-8 h-8 p-0">
                  <SquarePen className="w-5 h-5" />
                </Button>
              </CreateUpdateItem>
              <div className="mb-2"></div>
              <ConfirmDeliton DeleteItem={DeleteItem} item={item}>
                <Button className="w-8 h-8 p-0" variant={"destructive"}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </ConfirmDeliton>
            </div>
          </div>
        ))}
      {isLoading &&
        [1, 1, 1, 1, 1, 1, 1].map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center mb-6 border border-solid border-gray-300 rounded-xl p-6"
          >
            <div className="flex justify-start items-center">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="ml-6">
                <Skeleton className="w-[150px] h-4" />
                <Skeleton className="w-[100px] h-4 mt-2" />
              </div>
            </div>
          </div>
        ))}
      {!isLoading && items.length == 0 && (
        <div className="text-gray-200 my-20">
          <div className="flex justify-center">
            <LayoutList className="w-[120px] h-[120px]" />
          </div>
          <h2 className="text-center">No hay productos disponibles</h2>
        </div>
      )}
    </div>
  );
}
