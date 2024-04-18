import React, { useEffect, useState } from "react";

import style from './EditProductForm.module.scss';
import { useParams } from "react-router-dom";
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

        // Set options for types
        void retrieveProduct();
        void retrieveTypes(setTypeOptions, null);
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
    }

    return (
        <main className={style.formContainer}>
            { modal }
            <h3>Edit Product</h3>
            <form action="" className={style.editProductForm}>

                <div className={style.inputContainer}>
                    <label htmlFor="name-input">Product Name</label>
                    <input id="name-input" name="name-input" type="text" value={currentName} onChange={(e) => { handleNameChange(e); }} required />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="description-input">Description</label>
                    <textarea id="description-input" name="description-input" value={currentDescription} onChange={(e) => { handleDescriptionChange(e); }} required />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="price-input">Price</label>
                    <input id="price-input" name="price-input" type="number" min={0} value={currentPrice} onChange={(e) => { handlePriceChange(e); }} required />
                </div>

                <div className={style.inputContainer}>
                    <label htmlFor="stock-input">Initial stock</label>
                    <input id="stock-input" name="stock-input" type="number" max={100} min={0} value={currentStock} onChange={(e) => { handleStockChange(e); }} required />
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
                    <input id="genres-input" name="genres-input" type="text" value={currentGenres} onChange={(e) => { handleGenreChange(e); }} required />
                    <p className={style.inputInfo}>Minimum of one required</p>
                    <p className={style.inputInfo}>Separate genres with a comma</p>
                </div>

                <button className={style.formSubmitBtn} type="submit" onClick={(e) => { void submitForm(e); }}>Add Product</button>
            </form>
        </main>
    );
};

export default EditProductForm;
