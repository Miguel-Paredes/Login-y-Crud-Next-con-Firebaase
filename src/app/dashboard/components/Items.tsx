import { CreateUpdateItem } from "./create-update-item.form";

export default function Items() {
  return (
    <>
      <div className="flex justify-between items-center m-4 mb-8">
        <h1 className="text-2xl ml-1">Productos</h1>
        <CreateUpdateItem/>
      </div>
    </>
  )
}
