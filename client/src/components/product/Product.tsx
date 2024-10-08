import React, { useState } from "react";

import AuthModal from "@components/modals/authModal";
import ConfirmModal from "@components/modals/confirmModal/ConfirmModal";
import capitalize from "@utilities/capitalize";
import style from "./Product.module.scss";
import type { product_type } from "@custom_types/types";
import endpoint from "@utilities/endpoint";
import { Link } from "react-router-dom";

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
            <ConfirmModal closeModal={() => { setModal(null); }}>
                <p>Error updating stock amount</p>
                <p>Please try again later</p>
            </ConfirmModal>
        ); } else {
            // set out stock change
            product.number_in_stock = product.number_in_stock + editingStockValue;
            setModal(
                <ConfirmModal closeModal={() => { setModal(null); }}>
                    <p>Stock updated</p>
                </ConfirmModal>
            );
            setEditingStockValue(0);
            setIsEditingStock(false);
        }
    };

    const showDeleteModal = (): void => {
        const genreIds = product.genres.map((genre) => genre._id);

        setModal(
            <AuthModal 
                closeModal={() => { setModal(null); }}
                reqOptions={{
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ genreIds, typeId: product.type._id })
                }}
                productId={product._id}
                displayModalFunc={(message: string) => {
                    setModal(
                        <ConfirmModal closeModal={() => { setModal(null); }}>
                            {message}
                        </ConfirmModal>
                    );}
                }/>
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
                    <input 
                        type='number'
                        name='update-stock'
                        id='update-stock'
                        className={style.stockUpdate}
                        value={editingStockValue}
                        onChange={(e) => { changeStockEditValue(e); }}
                        role='textbox'
                        min={-100} max={100}
                    />
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
