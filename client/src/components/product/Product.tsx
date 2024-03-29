import React, { useEffect, useState } from "react";

import capitalize from "@utilities/capitalize";
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
        return <span key={genre._id}>{capitalize(genre.name)}</span>;
    });

    const lastUpdatedArr: string[] = product.stock_last_updated.split('T');
    const lastUpdatedDate: string[] = lastUpdatedArr[0].split('-');
    const formattedLastUpdated: string = `${lastUpdatedArr[1].split('.')[0]} ${lastUpdatedDate[2]}/${lastUpdatedDate[1]}/${lastUpdatedDate[0]}`;

    // Stock update funcs
    // const beginStockUpdate = () => {

    // };

    // const updateStock = () => {

    // };

    // Editing funcs
    // const beginProductEdit = () => {

    // };

    // const editProduct = () => {

    // };

     return (
        <div className={style.productContainer}>
            <p className={style.productName}>{product.name}</p>
            <p className={style.productDetails}>{capitalize(product.type.name)} / {productGenres}</p>
            <p className={style.productDescription}>{product.description}</p>
            <div className={style.inStockContainer}>
                <button className={style.stockButton}>Update stock</button>
                <p>In stock: { product.number_in_stock > 0 ? product.number_in_stock : 'NO' }</p>
            </div>
            <div className={style.editContainer}>
                <button className={style.editButton}>Edit details</button>
                <p>Last Edited: {formattedLastUpdated}</p>
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
