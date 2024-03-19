import React, { useEffect, useState } from "react";

import style from './ProductDisplay.module.scss';
import type Product from "@custom_types/product";

interface ProductDisplayProps {
    genreId: string;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ genreId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // activate loading
        setIsLoading(true);
        const retrieveProducts = async(): Promise<void> => {
            let data: Product[] = [];
            try {
                if (genreId !== 'all') {
                    const response = await fetch(`http://localhost:3000/genres/${genreId}`);
                    data = await response.json();
                } else {
                    const response = await fetch(`http://localhost:3000/products/all`);
                    data = await response.json();
                }
            } catch(err) {
                console.log(err); // log error
            }
            setProducts(data);
        };

        void retrieveProducts();
    }, [genreId]);

    useEffect(() => {
        if (products.length > 0) setIsLoading(false);
    }, [products]);

    const loading = isLoading ? <div className={style.loading}><div className={style.loadingIcon}></div></div> : null;

    return (
        <div className={style.productDisplay}>
            { loading }
        </div>
    );
};

export default ProductDisplay;
