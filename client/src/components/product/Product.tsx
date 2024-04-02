import React, { useState } from "react";

import Modal from "@components/modal";
import capitalize from "@utilities/capitalize";
import style from "./Product.module.scss";
import type { product_type } from "@custom_types/types";
import endpoint from "@utilities/endpoint";

interface ProductProps {
    product: product_type
}

interface product_genre {
    name: string,
    _id: string
}

const Product: React.FC<ProductProps> = ({ product }) => {
    const [isEditingStock, setIsEditingStock] = useState<boolean>(false);
    const [editingStockValue, setEditingStockValue] = useState<number>(0);

    const [modal, setModal] = useState<React.ReactNode | null>(null);

    const productGenres: React.ReactNode[] = product.genres.map((genre: product_genre) => {
        return <span key={genre._id}>{capitalize(genre.name)}</span>;
    });

    const lastUpdatedArr: string[] = product.stock_last_updated.split('T');
    const lastUpdatedDate: string[] = lastUpdatedArr[0].split('-');
    const formattedLastUpdated: string = `${lastUpdatedArr[1].split('.')[0]} ${lastUpdatedDate[2]}/${lastUpdatedDate[1]}/${lastUpdatedDate[0]}`;

    // Stock update funcs
    const beginStockUpdate = (): void => {
        setIsEditingStock(true);
    };

    const changeStockEditValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newValue = parseInt(e.target.value);
        console.log(newValue);
        setEditingStockValue(newValue);
    };

    const updateStock = async (): Promise<void> => {
        // const response = await fetch(`${endpoint}/update_stock/${product._id}/${editingStockValue}`);
        console.log('updatingStock');
        const response = { ok: false };
        if (!response.ok) { setModal(
            <Modal closeModal={() => { setModal(null); }}>
                <p>Error updating stock amount</p>
                <p>Please try again later</p>
            </Modal>
        ); } else {
            // set out stock change
            product.number_in_stock = 1;
            setModal(
                <Modal closeModal={() => { setModal(null); }}>
                    <p>Stock updated</p>
                </Modal>
            );
            setEditingStockValue(0);
            setIsEditingStock(false);
        }
    };

    // Editing funcs
    const beginProductEdit = (): void => {
        console.log('beginning product edit');
    };

    // const editProduct = () => {

    // };

     return (
        <div className={style.productContainer}>
            { modal }
            <p className={style.productName}>{product.name}</p>
            <p className={style.productDetails}>{capitalize(product.type.name)} / {productGenres}</p>
            <p className={style.productDescription}>{product.description}</p>
            <div className={style.inStockContainer}>
                <button className={style.stockButton} onClick={beginStockUpdate}>Update stock</button>
                <p>In stock: { product.number_in_stock > 0 ? product.number_in_stock : 'NO' }</p>

                { isEditingStock ? <>
                    <input type='number' className={style.stockUpdate} value={editingStockValue} onChange={(e) => { changeStockEditValue(e); }} min={-100} max={100}/>
                    <button onClick={() => { void updateStock(); }}>Submit</button>
                    <button onClick={() => { setIsEditingStock(false); setEditingStockValue(0); }}>Cancel</button>
                </> : null }

            </div>
            <div className={style.editContainer}>
                <button className={style.editButton} onClick={beginProductEdit}>Edit details</button>
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
