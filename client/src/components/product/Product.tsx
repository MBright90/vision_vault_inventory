import React, { useEffect, useState } from "react";

import style from "./Product.module.scss";
import type product_type from "@custom_types/product";

interface ProductProps {
    product: product_type
}

const Product: React.FC<ProductProps> = ({ product }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        setIsEditing(false);
    }, [isEditing]);

     return (
        <div className={style.productContainer}>
            { isEditing ? <p>editing</p>: <p>{product.name}</p>}
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
