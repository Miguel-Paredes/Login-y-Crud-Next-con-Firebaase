export interface Products {
    id?: string,
    image: ItemImage
    name: string,
    price: number
    units: number
}

export interface ItemImage {
    path: string
    url: string
}