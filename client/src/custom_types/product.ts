interface Product {
    __id: string,
    __v: number,
    name: string,
    description: string,
    price: number,
    number_in_stock: number,
    genres: string[],
    type: string,
    stock_last_updated: Date,
    last_updated: Date
}

export default Product;
