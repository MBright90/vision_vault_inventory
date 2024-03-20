import React, { useEffect, useState } from "react";

import style from './ProductDisplay.module.scss';
import type Product from "@custom_types/product";
import Filter from "@components/filter/Filter";

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

        const retrieveProducts = async(): Promise<void> => {
            let data: Product[] = [];

            try {
                if (genreId !== 'all') {
                    if (typeFilter === 'all') {
                        const response = await fetch(`http://localhost:3000/products/bygenre/${genreId}`); // tick
                        data = await response.json();
                    } else {
                        const response = await fetch(`http://localhost:3000/products/bygenreandtype/${genreId}/${typeFilter}`);
                        data = await response.json();
                    }
                } else {
                    if (typeFilter === 'all') {
                        const response = await fetch(`http://localhost:3000/products/all`); // tick
                        data = await response.json();
                    } else {
                        const response = await fetch(`http://localhost:3000/products/bytype/${typeFilter}`); // tick
                        data = await response.json();
                    }
                }
            } catch(err) {
                console.log(err); // log error
            }

            console.log(data);
            setProducts(data);
        };

        void retrieveProducts();
    }, [genreId, typeFilter]);

    useEffect((): void => {
        if (products.length > 0) setIsLoading(false);
    }, [products]);

    const updateFilter = (newFilter: string): void => {
        setTypeFilter(newFilter);
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
