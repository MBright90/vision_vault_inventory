import React, { useEffect, useState } from "react";

import style from './ProductDisplay.module.scss';
import type { product_type } from "@custom_types/types";
import Filter from "@components/filter/Filter";
import Product from "@components/product/Product";

interface ProductDisplayProps {
    genreId: string;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ genreId }) => {
    const [products, setProducts] = useState<product_type[]>([]);
    const [productList, setProductList] = useState<React.ReactNode[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [activeProduct, setActiveProduct] = useState<product_type | null>(null);

    useEffect((): void => {
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
            if (activeProduct !== null) setProducts(data);
            setIsLoading(false);
        };

        void retrieveProducts();
    }, [genreId, typeFilter, activeProduct]);

    useEffect((): void => {
        // create productList here
        if (products.length > 0) {
            const productListArr = products.map((product) => {
                return (<tr className={style.productListTr} key={product._id} onClick={() => { updateActiveProduct(product); }}>
                    <td className={style.productListName}><p className={style.tableText}>{product.name}</p></td>
                    <td className={style.productListDesc}><p className={style.tableText}>{product.description}</p></td>
                    <td className={style.productListType}>{product.type.name}</td>
                    <td className={style.productListStock}>{product.number_in_stock}</td>
                </tr>);
            });
            setProductList(productListArr);
        } else {
            setProductList([]);
        }
    }, [products]);

    const updateActiveProduct = (product: product_type | null): void => {
        setActiveProduct(product);
    };

    const updateFilter = (newFilter: string): void => {
        setActiveProduct(null);
        setTypeFilter(newFilter);
    };

    const loading = isLoading ? <div className={style.loading}><div className={style.loadingIcon}></div></div> : null;

    return (
        <div className={style.productDisplayContainer}>
            <Filter goBack={() => { updateActiveProduct(null); }} productIsActive={activeProduct !== null} updateFilter={updateFilter}/>

            { activeProduct !== null ? <Product product={activeProduct} closeSelection={() => { updateActiveProduct(null); }}/> : 
            <>
                { loading }
                <div className={style.tableWrapper}>
                    <table className={style.productTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>In Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            { productList.length > 0 ? productList : <tr>
                                <td className={style.noProductMessage} colSpan={4}>No products matching search parameters</td>
                            </tr> }
                        </tbody>
                    </table>
                </div>
            </>
            }
        </div>
    );
};

export default ProductDisplay;
