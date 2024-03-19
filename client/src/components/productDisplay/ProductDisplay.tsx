import React, { useEffect, useState } from "react";

import style from './ProductDisplay.module.scss';
import type Product from "@custom_types/product";
import Filter from "@components/filter/Filter";
import setFilterRequest from "@utilities/setFilterRequest";

interface ProductDisplayProps {
    genreId: string;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ genreId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect((): void => {
        // set loading active
        setIsLoading(true);

        const initialRetrieveProducts = async(): Promise<void> => {
            let data: Product[] = [];
            try {
                if (genreId !== 'all') {
                    if (typeFilter === 'all') {
                        const response = await fetch(`http://localhost:3000/genres/${genreId}`);
                        data = await response.json();
                    } else {
                        const response = await fetch(`http://localhost:3000/genres/${genreId}/${typeFilter}`);
                        data = await response.json();
                    }
                } else {
                    if (typeFilter === 'all') {
                        const response = await fetch(`http://localhost:3000/products/all`);
                        data = await response.json();
                    } else {
                        const response = await fetch(`http://localhost:3000/products/bytype/${typeFilter}`);
                        data = await response.json();
                    }
                }
            } catch(err) {
                console.log(err); // log error
            }

            setProducts(data);
        };

        void initialRetrieveProducts();
    }, [genreId, typeFilter]);

    useEffect((): void => {
        if (products.length > 0) setIsLoading(false);
    }, [products]);

    const updateFilter = (newFilter: string): void => {
        const filterId = setFilterRequest(newFilter);
        setTypeFilter(filterId);
    };

    const loading = isLoading ? <div className={style.loading}><div className={style.loadingIcon}></div></div> : null;

    return (
        <div className={style.productDisplay}>
            { loading }
            <Filter productIsActive={true} updateFilter={updateFilter}/>
        </div>
    );
};

export default ProductDisplay;
