export const formatPrice = ( price : number ) =>{
    // * Hacemos que el precio tenga 2 decimales
    const fixedPrice = parseFloat(price.toFixed(2))
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(fixedPrice) + ' USD'
}