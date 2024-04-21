import React, { useEffect, useState } from "react";

import retrieveTypes from "@utilities/retrieveTypes";

import style from './NewProductForm.module.scss';
import Modal from "@components/modal/Modal";
import endpoint from "@utilities/endpoint";

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

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setCurrentName(e.target.value);
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        setCurrentDescription(e.target.value);
    }

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>):void {
        const { value } = e.target;
        if (typeof value === 'number' && value >= 0) setCurrentPrice(value);
    }

    function handleStockChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        if (typeof value === 'number' && value >= 0) setCurrentStock(value);
    }

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        setCurrentType(e.target.value);
    }

    function handleGenreChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setCurrentGenres(e.target.value.toLowerCase());
    }

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
            setModal(
                <Modal closeModal={() => { setModal(null); }}>
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
                <input id="name-input" name="name-input" type="text" onChange={(e) => { handleNameChange(e); }} required />
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="description-input">Description</label>
                <textarea id="description-input" name="description-input" onChange={(e) => { handleDescriptionChange(e); }} required />
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="price-input">Price</label>
                <input id="price-input" name="price-input" type="number" min={0} step={0.1} onChange={(e) => { handlePriceChange(e); }} required />
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="stock-input">Initial stock</label>
                <input id="stock-input" name="stock-input" type="number" max={100} min={0} step={1} onChange={(e) => { handleStockChange(e); }} required />
                <p className={style.inputInfo}>Max 100</p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="type-input">Type</label>
                <select id="type-input" name="type-input" value={currentType} onChange={(e) => { handleTypeChange(e); }} required>
                    <option>Select Type...</option>
                    {typeOptions}
                </select>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="genres-input">Genres</label>
                <input id="genres-input" name="genres-input" type="text" onChange={(e) => { handleGenreChange(e); }} required />
                <p className={style.inputInfo}>Minimum of one required</p>
                <p className={style.inputInfo}>Separate genres with a comma</p>
            </div>

            <button className={style.formSubmitBtn} type="submit" onClick={(e) => { void submitForm(e); }}>Add Product</button>
        </form>
    </main>
    );
};

export default NewProductForm;
