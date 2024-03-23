import React, { useEffect, useState } from "react";

import style from './ProductDisplay.module.scss';
import type product_type from "@custom_types/product";
import Filter from "@components/filter/Filter";

interface ProductDisplayProps {
    genreId: string;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ genreId }) => {
    const [products, setProducts] = useState<product_type[]>([]);
    const [productList, setProductList] = useState<React.ReactNode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [typeFilter, setTypeFilter] = useState<string>('all');

    useEffect((): void => {
        // set loading active
        setIsLoading(true);

        const retrieveProducts = async(): Promise<void> => {
            let data: product_type[] = [];

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
            setIsLoading(false);
        };

        void retrieveProducts();
    }, [genreId, typeFilter]);

    useEffect((): void => {
        // create productList here
        if (products.length > 0) {
            const productListArr = products.map((product) => {
                return (<tr className={style.productListTr} key={product._id}>
                    <td className={style.productListName}>{product.name}</td>
                    <td className={style.productListDesc}>{product.description}</td>
                    <td className={style.productListType}>{product.type.name}</td>
                    <td className={style.productListStock}>{product.number_in_stock}</td>
                </tr>);
            });
            setProductList(productListArr);
        } else {
            const noProductMessage: React.ReactNode = (<div className={style.noProductMessage}>
                <p>No products</p>
            </div>);
            // pass noProductMessage to setProductList - iterator method?
        }
    }, [products]);

    const updateFilter = (newFilter: string): void => {
        setTypeFilter(newFilter);
    };

    const loading = isLoading ? <div className={style.loading}><div className={style.loadingIcon}></div></div> : null;

    return (
        <div className={style.productDisplayContainer}>
            <Filter productIsActive={true} updateFilter={updateFilter}/>
            <div className={style.productDisplay}>
                { loading }
                {/* Add check for length */}
                { products.length > 0 ? <p>Products exist</p> : <p>Products don&apos;t exist</p> }
            </div>
        </div>
    );
};

export default ProductDisplay;
