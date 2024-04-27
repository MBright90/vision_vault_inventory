import React, { useEffect, useState } from "react";

import style from './EditProductForm.module.scss';
import { redirect, useParams } from "react-router-dom";
import retrieveTypes from "@utilities/retrieveTypes";
import endpoint from "@utilities/endpoint";
import Modal from "@components/modal/Modal";
import { type product_type } from "@custom_types/types";

const EditProductForm: React.FC = () => {
    const { productId } = useParams();

    const [modal, setModal] = useState<React.ReactNode | null>(null);

    const [typeOptions, setTypeOptions] = useState<React.ReactNode[]>([]);

    const [currentName, setCurrentName] = useState<string>('');
    const [currentDescription, setCurrentDescription] = useState<string>('');
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [currentStock, setCurrentStock] = useState<number>(0);
    const [currentType, setCurrentType] = useState<string>('');
    const [currentGenres, setCurrentGenres] = useState<string>('');

    useEffect(() => {
        const retrieveProduct = async (): Promise<void> => {
            try {
                const response = await fetch(`${endpoint}/products/${productId}`);
                if (!response.ok) {
                    setModal(
                        <Modal closeModal={() => {setModal(null);} }>
                            <p>Error retrieving product</p>
                        </Modal>
                    );
                    return;
                }

                const product: product_type = await response.json();
                setCurrentName(product.name);
                setCurrentDescription(product.description);
                setCurrentPrice(product.price);
                setCurrentStock(product.number_in_stock);
                setCurrentType(product.type.name);
                setCurrentGenres(product.genres.join(', '));
            } catch (err) {
                console.log(err);
            }
        };

        console.log('retrieving');

        // Set options for types
        void retrieveProduct();
        void retrieveTypes(setTypeOptions, null);
    }, []);


    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>):void {
        const { value } = e.target;

        try {
            // convert value to float, reduce to 2DP, the convert to float again
            const priceValue = parseFloat(value);
            if (priceValue >= 0) setCurrentPrice(parseFloat(priceValue.toFixed(2)));
        } catch (err) {
            setCurrentPrice(0);
            console.log(err);
        }
    }

    function handleStockChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        
        try {
            const stockValue = parseInt(value);
            if (stockValue >= 0) setCurrentStock(stockValue);
        } catch (err) {
            setCurrentStock(0);
            console.log(err);
        }
    }

    async function submitForm(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({
                name: currentName,
                description: currentDescription,
                price: currentPrice,
                number_in_stock: currentStock,
                genres: currentGenres,
                type: currentType
            })
        };

        try {
            const response = await fetch(`${endpoint}/products/edit/${productId}`, requestOptions);
            if (!response.ok) {
                const data = await response.json();
                setModal(
                    <Modal closeModal={() => { setModal(null); }}>
                        <p>Error updating product</p>
                        <p>Error: {data.err}</p>
                    </Modal>
                );
            } else {
                const confirm = { text: 'Ok', func: () => { redirect('/'); } };
                setModal(
                    <Modal closeModal={() => { setModal(null); }} confirm={confirm}>
                        <p>Product edited successfully</p>
                    </Modal>
                );
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <main className={style.formContainer}>
            { modal }
            <h3>Edit Product</h3>
            <form action="" className={style.editProductForm}>

                <div className={style.inputContainer}>
                    <label htmlFor="name-input">Product Name</label>
                    <input id="name-input" name="name-input" type="text" value={currentName} onChange={(e) => { setCurrentName(e.target.value); }} required />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="description-input">Description</label>
                    <textarea id="description-input" name="description-input" value={currentDescription} onChange={(e) => { setCurrentDescription(e.target.value); }} required />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="price-input">Price</label>
                    <input id="price-input" name="price-input" type="number" min={0} value={currentPrice} step={.01} onChange={(e) => { handlePriceChange(e); }} required />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="stock-input">Current stock</label>
                    <input id="stock-input" name="stock-input" type="number" max={100} min={0} value={currentStock} step={1} onChange={(e) => { handleStockChange(e); }} required />
                    <p className={style.inputInfo}>Max 100</p>
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="type-input">Type</label>
                    <select id="type-input" name="type-input" value={currentType} onChange={(e) => { setCurrentType(e.target.value); }} required>
                        <option>Select Type...</option>
                        {typeOptions}
                    </select>
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="genres-input">Genres</label>
                    <input id="genres-input" name="genres-input" type="text" value={currentGenres} onChange={(e) => { setCurrentGenres(e.target.value); }} required />
                    <p className={style.inputInfo}>Minimum of one required</p>
                    <p className={style.inputInfo}>Separate genres with a comma</p>
                </div>

                <button className={style.formSubmitBtn} type="submit" onClick={(e) => { void submitForm(e); }}>Update Product</button>
            </form>
        </main>
    );
};

export default EditProductForm;
