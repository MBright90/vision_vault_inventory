import React, { useEffect, useState } from "react";

import style from "./Product.module.scss";
import type { product_type } from "@custom_types/types";

interface ProductProps {
    product: product_type
}

interface product_genre {
    name: string,
    _id: string
}

const Product: React.FC<ProductProps> = ({ product }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setIsEditing(false);
    }, [isEditing]);

    const productGenres: React.ReactNode[] = product.genres.map((genre: product_genre) => {
        return <span key={genre._id}>{genre.name}</span>;
    });

    const lastUpdatedArr: string[] = product.stock_last_updated.split('T');
    const formattedLastUpdated: string = `${lastUpdatedArr[0]}, ${lastUpdatedArr[1]}`;

    console.log(formattedLastUpdated);

    // updateStockFunc
    // startEditing func

     return (
        <div className={style.productContainer}>
            <p className={style.productName}>{product.name}</p>
            <p className={style.productDetails}>{product.type.name} / {productGenres}</p>
            <p className={style.productDescription}>{product.description}</p>
            <div className={style.inStockContainer}>
                <button>Update stock</button>
            </div>
            <div className={style.editContainer}>
                <button>Edit</button>
                <p>Last Edited: {}</p>
            </div>
        </div>
     );
};

export default Product;

// name
// description
// price
// number_in_stock/stock_last_updated
// genres
// type
// last_updated
// edit button
// add stock button - admin
// sell one stock button
