import React, { useEffect, useState } from "react";

import retrieveTypes from "@utilities/retrieveTypes";
import { type FilterIdSet } from "@custom_types/types";

import style from './NewProductForm.module.scss';

const NewProductForm: React.FC = () => {
    const [typeIdArr, setTypeIdArr] = useState<FilterIdSet[]>([]);
    const [typeOptions, setTypeOptions] = useState<React.ReactNode[]>([]);

    const [currentName, setCurrentName] = useState<string>('');
    const [currentDescription, setCurrentDescription] = useState<string>('');
    const [currentStock, setCurrentStock] = useState<number>(0);
    const [currentType, setCurrentType] = useState<string>('Select type...');

    useEffect(() => {
        void(retrieveTypes(setTypeOptions, setTypeIdArr));
    }, []);

    useEffect(() => { // to remove
        console.log(currentName);
        console.log(currentDescription);
        console.log(currentStock);
        console.log(currentType);
        console.log(typeIdArr);
    }, [currentType]);

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setCurrentName(e.target.value);
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        setCurrentDescription(e.target.value);
    }

    function handleStockChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value } = e.target;
        if (typeof value === 'number' && value >= 0) setCurrentStock(value);
    }

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        setCurrentType(e.target.value.toLowerCase());
    }

    return (<div className={style.formContainer}>
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
                <label htmlFor="stock-input">Initial stock</label>
                <input id="stock-input" name="stock-input" type="number" max={100} min={0} onChange={(e) => { handleStockChange(e); }} required />
                <p className={style.inputInfo}>
                    Max 100
                </p>
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="type-input">Type</label>
                <select id="type-input" name="type-input" onChange={(e) => { handleTypeChange(e); }} required>
                    {typeOptions}
                </select>
                {/* <p className={style.inputInfo}>
                    Separate genres with a comma
                </p> */}
            </div>

            <div className={style.inputContainer}>
                <label htmlFor="genres-input">Genres</label>
                <input id="genres-input" name="genres-input" type="text" required />
                <p className={style.inputInfo}>
                    Separate genres with a comma
                </p>
            </div>

            <button className={style.formSubmitBtn} type="submit">Add Product</button>
        </form>
    </div>
    );
};

export default NewProductForm;
