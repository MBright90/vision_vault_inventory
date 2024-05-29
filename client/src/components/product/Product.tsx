import React, { useState } from "react";

import Modal from "@components/modal/ConfirmModal";
import capitalize from "@utilities/capitalize";
import style from "./Product.module.scss";
import type { product_type } from "@custom_types/types";
import endpoint from "@utilities/endpoint";
import { Link } from "react-router-dom";

interface ProductProps {
    product: product_type,
    closeSelection: () => void;
}

interface product_genre {
    name: string,
    _id: string
}

const Product: React.FC<ProductProps> = ({ product, closeSelection }) => {
    const [isEditingStock, setIsEditingStock] = useState<boolean>(false);
    const [editingStockValue, setEditingStockValue] = useState<number>(0);

    const [modal, setModal] = useState<React.ReactNode | null>(null);

    const productGenres: React.ReactNode[] = product.genres.map((genre: product_genre) => {
        return <span key={genre._id}>{capitalize(genre.name)}, </span>;
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
        setEditingStockValue(newValue);
    };

    const updateStock = async (): Promise<void> => {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ increment: editingStockValue })
        };

        const response = await fetch(`${endpoint}/products/update_stock/${product._id}`, requestOptions);
        if (!response.ok) { setModal(
            <Modal closeModal={() => { setModal(null); }}>
                <p>Error updating stock amount</p>
                <p>Please try again later</p>
            </Modal>
        ); } else {
            // set out stock change
            product.number_in_stock = product.number_in_stock + editingStockValue;
            setModal(
                <Modal closeModal={() => { setModal(null); }}>
                    <p>Stock updated</p>
                </Modal>
            );
            setEditingStockValue(0);
            setIsEditingStock(false);
        }
    };

    const deleteCallback = async (): Promise<void> => {
        const genreIds = product.genres.map((genre) => genre._id);

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ genreIds, typeId: product.type._id })
        };

        const result = await fetch(`${endpoint}/products/delete/${product._id}`, requestOptions);
        if (result.ok) console.log('deleted');
        closeSelection();
    };

    const showDeleteModal = (): void => {

        setModal(
            <Modal closeModal={() => { setModal(null); }} confirm={{ text: 'Confirm', func: deleteCallback}}>
                <p>Are you sure you want to delete this?</p>
            </Modal>
        );

    };

     return (
        <div className={style.productContainer}>
            { modal }
            <p className={style.productName}>{product.name}</p>
            <p className={style.productDetails}>{capitalize(product.type.name)} <span>|</span> {productGenres}</p>
            <p className={style.productDescription}>{product.description}</p>
            <p className={style.productPrice}>£{product.price}</p>
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
                <Link className={style.editButton} to={`/edit/${product._id}`}>Edit details</Link>
                <p>Last Edited: {formattedLastUpdated}</p>
            </div>
            <div className={style.editContainer}>
                <button className={style.editButton} onClick={showDeleteModal}>Delete</button>
            </div>
        </div>
     );
};

export default Product;
