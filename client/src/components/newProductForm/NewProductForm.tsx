import React, { useEffect, useState } from "react";

import retrieveTypes from "@utilities/retrieveTypes";

import style from './NewProductForm.module.scss';
import Modal from "@components/modal/Modal";
import endpoint from "@utilities/endpoint";
import { redirect } from "react-router-dom";

const NewProductForm: React.FC = () => {
    const [modal, setModal] = useState<React.ReactNode | null>(null);

    const [typeOptions, setTypeOptions] = useState<React.ReactNode[]>([]);

    const [currentName, setCurrentName] = useState<string>('');
    const [currentDescription, setCurrentDescription] = useState<string>('');
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [currentStock, setCurrentStock] = useState<number>(0);
    const [currentType, setCurrentType] = useState<string>('');
    const [currentGenres, setCurrentGenres] = useState<string>('');

    // Create option nodes for select element list
    useEffect(() => {
        void(retrieveTypes(setTypeOptions, null));
    }, []);

    // function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    //     setCurrentName(e.target.value);
    // }

    // function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    //     setCurrentDescription(e.target.value);
    // }

    useEffect(() => {
        console.log(currentPrice);
    }, [currentPrice]);

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

    // function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    //     setCurrentType(e.target.value);
    // }

    // function handleGenreChange(e: React.ChangeEvent<HTMLInputElement>): void {
    //     setCurrentGenres(e.target.value.toLowerCase());
    // }

    async function submitForm(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
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

        const response = await fetch(`${endpoint}/products/`, requestOptions);

        if (!response.ok) {
            setModal(
                <Modal closeModal={() => { setModal(null); }}>
                    <h3>Error adding product</h3>
                    <p>Please check all fields are completed and try again</p>
                </Modal>
            );
        } else {
            const confirm = { text: 'Ok', func: () => { redirect('/'); } };
            setModal(
                <Modal closeModal={() => { setModal(null); }} confirm={confirm}>
                    <p>Product added</p>
                </Modal>
            );
        }
    }

    return (<main className={style.formContainer}>
        { modal }
        <h3>Add Product</h3>
        <form action="" className={style.newProductForm}>

            <div className={style.inputContainer}>
                <label htmlFor="name-input">Product Name</label>
                <input id="name-input" name="name-input" type="text" onChange={(e) => { setCurrentName(e.target.value); }} required />
                <p className={style.inputInfo}>Required</p>
                <p className={style.inputInfo}>2 - 150 characters</p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="description-input">Description</label>
                <textarea id="description-input" name="description-input" onChange={(e) => { setCurrentDescription(e.target.value); }} required />
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="price-input">Price</label>
                <input id="price-input" name="price-input" type="number" value={currentPrice} min={0} step={0.01} onChange={(e) => { handlePriceChange(e); }} required />
                <p className={style.inputInfo}>Required</p>
                <p className={style.inputInfo}>Must be more than 0.00</p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="stock-input">Initial stock</label>
                <input id="stock-input" name="stock-input" type="number" value={currentStock} max={100} min={0} step={1} onChange={(e) => { handleStockChange(e); }} required />
                <p className={style.inputInfo}>Required</p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="type-input">Type</label>
                <select id="type-input" name="type-input" value={currentType} onChange={(e) => { setCurrentType(e.target.value); }} required>
                    <option>Select Type...</option>
                    {typeOptions}
                </select>
                <p className={style.inputInfo}>Required</p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="genres-input">Genres</label>
                <input id="genres-input" name="genres-input" type="text" onChange={(e) => { setCurrentGenres(e.target.value.toLowerCase()); }} required />
                <p className={style.inputInfo}>Minimum of one required</p>
                <p className={style.inputInfo}>Separate genres with a comma</p>
            </div>

            <button className={style.formSubmitBtn} type="submit" onClick={(e) => { void submitForm(e); }}>Add Product</button>
        </form>
    </main>
    );
};

export default NewProductForm;
