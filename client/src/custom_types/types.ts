export interface genre_type {
    _id: string,
    __v: number,
    name: string,
    products: string[],
}

export interface product_type {
    _id: string,
    __v: number,
    name: string,
    description: string,
    price: number,
    number_in_stock: number,
    genres: Array<{
        name: string,
        _id: string
    }>,
    type: {
        name: string,
        _id: string
    },
    stock_last_updated: Date,
    last_updated: Date
}

export interface productType_type {
    _id: string,
    __v: number,
    products: string[],
    name: string
}
